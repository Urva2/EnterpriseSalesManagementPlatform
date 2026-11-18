package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.InvoiceDto;
import com.example.sale_entryApp.dto.InvoiceItemDto;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.*;
import com.example.sale_entryApp.mapper.SaleOrderMapper;
import com.example.sale_entryApp.repository.CustomerRepo;
import com.example.sale_entryApp.repository.OrderItemRepo;
import com.example.sale_entryApp.repository.ProductRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sale_entryApp.dto.RequestDto.CartItemDTO;
import com.example.sale_entryApp.repository.ProductRepo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class SaleOrderService {
    @Autowired
    private SaleOrderRepo saleOrderRepo;
    @Autowired
    private SalesPersonRepo salesPersonRepo;
    @Autowired
    private CustomerRepo customerRepo;
    @Autowired
    private SaleOrderMapper saleOrderMapper;
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductService productService;

    public static AuthenticatedUser isAuthenticated(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new RuntimeException("Invalid user principal.");
        }
        return user;
    }
    @Transactional
    public SaleOrderDTO createSaleOrder(int salespersonId, int customerId) //crt-slorder
    {
        SalesPerson salesPerson = salesPersonRepo.findById(salespersonId);
        Customer customer = customerRepo.findById(customerId);
        if (salesPerson != null && customer != null) {
            SaleOrder saleOrder = new SaleOrder();
            saleOrder.setCustomer(customer);
            saleOrder.setSalesPerson(salesPerson);
            saleOrder.setDate(LocalDate.now());
            saleOrder.setTotal(0);
            saleOrder.setStatus(OrderStatus.PENDING.name()); //we have to store this saleorder id in when this method calls
            SaleOrder saved = saleOrderRepo.save(saleOrder);
            return saleOrderMapper.saleOrderDto(saved);
        }
        throw new RuntimeException("Error!Customer or SalesPerson Id not Valid.");
    }

    //Updates The Stock of Product after Order is either deleted or it's Status Changes to Cancelled
    public void cancelOrder(int orderId){
        List<Object[]> saleOrderOrderItemList=orderItemRepo.findProductIdsAndQuantitiesByOrderId(orderId);
        if (saleOrderOrderItemList != null) {
            for (Object[] row: saleOrderOrderItemList) {
                Integer productId=(Integer) row[0];
                Integer quantity=(Integer) row[1];
                productService.incrementStock(productId,quantity);
            }
        }
    }

    @Transactional
    public String updateOrderStatus(int orderId, String status) {
        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        if (saleOrder == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        OrderStatus targetStatus = OrderStatus.fromString(status);
        OrderStatus currentStatus = OrderStatus.fromString(saleOrder.getStatus());

        if (currentStatus == targetStatus) {
            throw new RuntimeException("Order is already in status: " + targetStatus);
        }

        // Validate state transitions
        boolean validTransition = false;
        switch (currentStatus) {
            case PENDING -> validTransition = (targetStatus == OrderStatus.CONFIRMED || targetStatus == OrderStatus.CANCELLED);
            case CONFIRMED -> validTransition = (targetStatus == OrderStatus.PROCESSING || targetStatus == OrderStatus.CANCELLED);
            case PROCESSING -> validTransition = (targetStatus == OrderStatus.DELIVERED || targetStatus == OrderStatus.CANCELLED);
            case DELIVERED, CANCELLED -> validTransition = false; // Terminal states
        }

        if (!validTransition) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + targetStatus);
        }

        if (targetStatus == OrderStatus.CANCELLED) {
            restoreStockForOrder(saleOrder);
        }

        saleOrder.setStatus(targetStatus.name());
        saleOrderRepo.save(saleOrder);
        return targetStatus.name();
    }

    private void restoreStockForOrder(SaleOrder saleOrder) {
        if (saleOrder.getOrderItemList() != null) {
            for (OrderItem item : saleOrder.getOrderItemList()) {
                Product product = item.getProduct();
                if (product != null) {
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepo.save(product);
                }
            }
        }
    }

//    public List<SaleOrderDTO> viewSaleOrder() {
//        List<SaleOrder> saleOrders = saleOrderRepo.findAll();
//        if (!saleOrders.isEmpty()) {
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Error!! SaleOrders Not Found.");
//    }

    //Order is Kept(For Financial Report) but Product Stock is Released
    @Transactional
    public SaleOrderDTO deleteSaleOrderById(int id){
        SaleOrder saleOrder = saleOrderRepo.findById(id);
        if (saleOrder == null) {
            throw new RuntimeException("Order With ID:"+id+"Not Exist!");
        }

        if ("Cancelled".equalsIgnoreCase(saleOrder.getStatus())) {
            throw new RuntimeException(
                    "Order Has Already Been Deleted. ID: " + id);
        }
        restoreStockForOrder(saleOrder);
        saleOrder.setStatus("Cancelled");
        //   System.out.println("Order Status:"+saleOrder.getStatus());
        saleOrderRepo.save(saleOrder);
        return saleOrderMapper.saleOrderDto(saleOrder);
    }

    @Transactional
    public SaleOrderDTO deleteSaleOrderBySalesPerson(int id, int salesPersonId) {

        SaleOrder saleOrder = saleOrderRepo.findByIdAndSalesPersonId(id, salesPersonId);

        if (saleOrder == null) {
            throw new RuntimeException(
                    "SalesPerson Does Not Have Order With ID: " + id);
        }

        if ("Cancelled".equalsIgnoreCase(saleOrder.getStatus())) {
            throw new RuntimeException(
                    "Order Has Already Been Deleted. ID: " + id);
        }

        restoreStockForOrder(saleOrder);
        saleOrder.setStatus("Cancelled");
        saleOrderRepo.save(saleOrder);

        return saleOrderMapper.saleOrderDto(saleOrder);
    }

//    public double cal_revenue(int s_personId){
//        List<SaleOrder> saleOrders=saleOrderRepo.findBySalesPersonId(s_personId);
//        double totalrev=0.0;
//        if(!saleOrders.isEmpty())
//        {
//            for(SaleOrder s:saleOrders){
//                totalrev+=s.getTotal();
//            }
//            return totalrev;
//        }
//        return totalrev;
//    }

//    public List<SaleOrderDTO> deleteSaleOrderByStatus(String status){
//        List<SaleOrder> saleOrders=saleOrderRepo.findByStatus(status);
//        if(!saleOrders.isEmpty()){
//            saleOrderRepo.deleteAll(saleOrders);
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Not Found Any Orders With Status:"+status);
//    }
//    public List<SaleOrderDTO> deleteSaleOrderByDate(LocalDate date){
//        List<SaleOrder> saleOrders=saleOrderRepo.findByDate(date);
//        if(!saleOrders.isEmpty()){
//            saleOrderRepo.deleteAll(saleOrders);
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Not Found Any Orders With Date:"+date);
//    }
    public double cal_revenue(int s_personId){
        List<SaleOrder> saleOrders=saleOrderRepo.findBySalesPersonId(s_personId);
        double totalrev=0.0;
        if(!saleOrders.isEmpty())
        {
            for(SaleOrder s:saleOrders){
                totalrev+=s.getTotal();
            }
            return totalrev;
        }
        return totalrev;
    }

    @Transactional(readOnly = true)
    public SaleOrderDTO getOrderById(int id) {
        SaleOrder saleOrder = saleOrderRepo.findById(id);
        if (saleOrder == null) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user = isAuthenticated(authentication);
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_ADMIN"));
        if (!isAdmin && saleOrder.getSalesPerson() != null && saleOrder.getSalesPerson().getId() != Math.toIntExact(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this order.");
        }
        return saleOrderMapper.saleOrderDto(saleOrder);
    }

    @Transactional
    public SaleOrderDTO updateRemarks(int id, String remarks) {
        SaleOrder saleOrder = saleOrderRepo.findById(id);
        if (saleOrder == null) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        saleOrder.setRemarks(remarks);
        SaleOrder saved = saleOrderRepo.save(saleOrder);
        return saleOrderMapper.saleOrderDto(saved);
    }

    @Transactional
    public SaleOrderDTO applyDiscount(int id, double percent) {
        if (percent < 0 || percent > 100) {
            throw new RuntimeException("Discount percent must be between 0 and 100");
        }
        SaleOrder saleOrder = saleOrderRepo.findById(id);
        if (saleOrder == null) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        saleOrder.setDiscountPercent(percent);
        saleOrder.setTotal(saleOrder.calctotal(saleOrder.getOrderItemList()));
        SaleOrder saved = saleOrderRepo.save(saleOrder);
        return saleOrderMapper.saleOrderDto(saved);
    }

    @Transactional(readOnly = true)
    public InvoiceDto generateInvoice(int orderId) {
        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        if (saleOrder == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        InvoiceDto invoice = new InvoiceDto();
        invoice.setInvoiceNumber("INV-" + saleOrder.getId() + "-" + (saleOrder.getDate() != null ? saleOrder.getDate().toString() : LocalDate.now().toString()));
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setOrderId(saleOrder.getId());
        invoice.setOrderStatus(saleOrder.getStatus());
        invoice.setRemarks(saleOrder.getRemarks());

        if (saleOrder.getCustomer() != null) {
            invoice.setCustomerName(saleOrder.getCustomer().getName());
            invoice.setCustomerPhone(saleOrder.getCustomer().getPhoneno());
            invoice.setCustomerAddress(saleOrder.getCustomer().getAddress());
        }

        if (saleOrder.getSalesPerson() != null) {
            invoice.setSalespersonName(saleOrder.getSalesPerson().getName());
        }

        List<InvoiceItemDto> itemDtos = new ArrayList<>();
        double subtotal = 0.0;
        if (saleOrder.getOrderItemList() != null) {
            for (OrderItem item : saleOrder.getOrderItemList()) {
                subtotal += item.getSubtotal();
                itemDtos.add(new InvoiceItemDto(
                        item.getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getSubtotal()
                ));
            }
        }
        invoice.setItems(itemDtos);
        invoice.setSubtotal(subtotal);
        invoice.setDiscountPercent(saleOrder.getDiscountPercent() != null ? saleOrder.getDiscountPercent() : 0.0);
        invoice.setDiscountAmount(saleOrder.getDiscountAmount() != null ? saleOrder.getDiscountAmount() : 0.0);
        invoice.setGrandTotal(saleOrder.getTotal());
        double paid = saleOrder.getPaidAmount() != null ? saleOrder.getPaidAmount() : 0.0;
        invoice.setPaidAmount(paid);
        invoice.setRemainingBalance(Math.max(0.0, saleOrder.getTotal() - paid));
        invoice.setPaymentStatus(saleOrder.getPaymentStatus() != null ? saleOrder.getPaymentStatus() : "UNPAID");

        return invoice;
    }

    //Note by Urva:Needed Pagination here.
    @Transactional(readOnly = true)
    public List<SaleOrderDTO> getMyOrders() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user =isAuthenticated(authentication);

        int id = Math.toIntExact(user.getId());

        List<SaleOrder> orders = saleOrderRepo.findBySalesPersonId(id);

        if (orders.isEmpty()) {
            throw new RuntimeException("No orders found for current user.");
        }

        return orders.stream()
                .map(saleOrderMapper::saleOrderDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<SaleOrderDTO> getAllSaleOrders(Pageable pageable) {
        return saleOrderRepo.findAll(pageable).map(saleOrderMapper::saleOrderDto);
    }

    @Transactional(readOnly = true)
    public Page<SaleOrderDTO> searchSaleOrdersByCustomerName(String customerName, Pageable pageable) {
        Page<SaleOrder> ordersPage = saleOrderRepo.findByCustomerNameContainingIgnoreCase(customerName, pageable);
        return ordersPage.map(saleOrderMapper::saleOrderDto);
    }

    @Transactional(readOnly = true)
    public Page<SaleOrderDTO> getMyOrdersByname(Pageable pageable, String customerName) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user =isAuthenticated(authentication);
        int id=Math.toIntExact(user.getId());
        Page<SaleOrder> saleOrders=saleOrderRepo.findByCustomerNameContainingIgnoreCaseAndSalesPersonId(customerName,id,pageable);
        return saleOrders.map(saleOrderMapper::saleOrderDto);
    }

    @Transactional(readOnly = true)
    public Page<SaleOrderDTO> searchSaleOrdersByStatus(String status, Pageable pageable) {
        Page<SaleOrder> saleOrders;
        if (status != null && !status.trim().isEmpty()) {
             saleOrders= saleOrderRepo.findByStatusIgnoreCase(status, pageable);
        } else {
            // If no name is provided, just return all products paginated
            saleOrders = saleOrderRepo.findAll(pageable);
        }
        return saleOrders.map(saleOrderMapper::saleOrderDto);
    }

    @Transactional(readOnly = true)
    public Page<SaleOrderDTO> getMyOrdersByStatus(Pageable pageable, String status) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user =isAuthenticated(authentication);
        int id=Math.toIntExact(user.getId());
        Page<SaleOrder> saleOrders=saleOrderRepo.findByStatusContainingIgnoreCaseAndSalesPersonId(status,id,pageable);
        return saleOrders.map(saleOrderMapper::saleOrderDto);
    }
    private double syncCartItems(SaleOrder saleOrder, List<CartItemDTO> items, boolean deductStock) {
        if (saleOrder.getOrderItemList() != null && !saleOrder.getOrderItemList().isEmpty()) {
            orderItemRepo.deleteAll(saleOrder.getOrderItemList());
            saleOrder.getOrderItemList().clear();
        } else if (saleOrder.getOrderItemList() == null) {
            saleOrder.setOrderItemList(new ArrayList<>());
        }

        double total = 0.0;

        if (items != null) {
            for (CartItemDTO itemDto : items) {
                Product product = productRepo.findById(itemDto.getProductId());

                if (product != null && product.getIsActive()) {

                    if (deductStock) {
                        product.setStockQuantity(
                                product.getStockQuantity() - itemDto.getQuantity()
                        );
                        productRepo.save(product);
                    }

                    OrderItem orderItem = new OrderItem();
                    orderItem.setSaleOrder(saleOrder);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(itemDto.getQuantity());
                    orderItem.setName(product.getName());
                    orderItem.setPrice(product.getPrice());

                    double subtotal =
                            product.getPrice() * itemDto.getQuantity();

                    orderItem.setSubtotal(subtotal);

                    orderItemRepo.save(orderItem);
                    saleOrder.getOrderItemList().add(orderItem);

                    total += subtotal;
                }
            }
        }

        return total;
    }

    @Transactional
    public SaleOrderDTO saveDraft(int orderId, List<CartItemDTO> items) {

        SaleOrder saleOrder = saleOrderRepo.findById(orderId);

        if (saleOrder == null) {
            throw new RuntimeException("Sale Order Not Found");
        }

        double total = syncCartItems(saleOrder, items, false);

        saleOrder.setTotal(total);
        saleOrder.setStatus("DRAFT");

        SaleOrder saved = saleOrderRepo.save(saleOrder);

        return saleOrderMapper.saleOrderDto(saved);
    }

    @Transactional
    public SaleOrderDTO confirmAndCheckout(
            int orderId,
            List<CartItemDTO> items) {

        SaleOrder saleOrder = saleOrderRepo.findById(orderId);

        if (saleOrder == null) {
            throw new RuntimeException("Sale Order Not Found");
        }

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Cannot checkout an empty cart.");
        }

        // 1. Validate Stock first
        for (CartItemDTO itemDto : items) {

            Product product = productRepo.findById(itemDto.getProductId());

            if (product == null || !product.getIsActive()) {
                throw new RuntimeException("Product is no longer available.");
            }

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException(
                        "Product " + product.getName()
                                + " only has " + product.getStockQuantity()
                                + " units left. Please update your cart."
                );
            }
        }

        // 2. Clear existing items and deduct stock
        double total = syncCartItems(saleOrder, items, true);

        saleOrder.setTotal(total);
        saleOrder.setStatus("COMPLETED");

        SaleOrder saved = saleOrderRepo.save(saleOrder);

        return saleOrderMapper.saleOrderDto(saved);
    }
}
