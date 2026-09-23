package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.*;
import com.example.sale_entryApp.mapper.SaleOrderMapper;
import com.example.sale_entryApp.repository.CustomerRepo;
import com.example.sale_entryApp.repository.OrderItemRepo;
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

import java.util.ArrayList;

import java.time.LocalDate;
import java.util.List;

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
    public SaleOrderDTO createSaleOrder(int salespersonId, int customerId) //crt-saleorder
    {
        SalesPerson salesPerson = salesPersonRepo.findById(salespersonId);
        Customer customer = customerRepo.findById(customerId);
        if (salesPerson != null && customer != null) {
            SaleOrder saleOrder = new SaleOrder();
            saleOrder.setCustomer(customer);
            saleOrder.setSalesPerson(salesPerson);
            saleOrder.setDate(LocalDate.now());
            saleOrder.setTotal(0);
            saleOrder.setStatus("Pending"); //we have to store this saleorder id in when this method calls
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
    //From changes Status,it's status changes(We have to remove this and only have to keep the Delete SaleOrder)
    public String updateOrderStatus(int orderId, String status) {
        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        if (saleOrder == null)
            throw new RuntimeException("Order not found");
        if (status == null)
            throw new RuntimeException("Status required");
        if (status.equalsIgnoreCase(saleOrder.getStatus()))
            throw new RuntimeException("Select different status");

        if(status.equalsIgnoreCase("cancelled")) {
                cancelOrder(orderId);
            }
            saleOrder.setStatus(status);
            saleOrderRepo.save(saleOrder);
            return status;
    }
//    public List<SaleOrderDTO> viewSaleOrder() {
//        List<SaleOrder> saleOrders = saleOrderRepo.findAll();
//        if (!saleOrders.isEmpty()) {
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Error!! SaleOrders Not Found.");
//    }

    //Order is Kept(For Financial Report) but Product Stock is Released
    public SaleOrderDTO deleteSaleOrderById(int id){
        SaleOrder saleOrder = saleOrderRepo.findById(id);
        if (saleOrder == null) {
            throw new RuntimeException("Order With ID:"+id+"Not Exist!");
        }

        if ("Cancelled".equalsIgnoreCase(saleOrder.getStatus())) {
            throw new RuntimeException(
                    "Order Has Already Been Deleted. ID: " + id);
        }
            saleOrder.setStatus("Cancelled");
            cancelOrder(id);
         //   System.out.println("Order Status:"+saleOrder.getStatus());
            saleOrderRepo.save(saleOrder);
            return saleOrderMapper.saleOrderDto(saleOrder);

    }
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

    //Note by Urva:Needed Pagination here.
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
    public Page<SaleOrderDTO> getAllSaleOrders(Pageable pageable) {
        return saleOrderRepo.findAll(pageable).map(saleOrderMapper::saleOrderDto);
    }
    public Page<SaleOrderDTO> searchSaleOrdersByCustomerName(String customerName, Pageable pageable) {
        Page<SaleOrder> ordersPage = saleOrderRepo.findByCustomerNameContainingIgnoreCase(customerName, pageable);
        return ordersPage.map(saleOrderMapper::saleOrderDto);
    }

    public Page<SaleOrderDTO> getMyOrdersByname(Pageable pageable, String customerName) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user =isAuthenticated(authentication);
        int id=Math.toIntExact(user.getId());
        Page<SaleOrder> saleOrders=saleOrderRepo.findByCustomerNameContainingIgnoreCaseAndSalesPersonId(customerName,id,pageable);
        return saleOrders.map(saleOrderMapper::saleOrderDto);
    }

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

    public SaleOrderDTO getOrderById(int id) {

        SaleOrder order = saleOrderRepo.findById(id);

        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + id);
        }

        return saleOrderMapper.saleOrderDto(order);
    }
}