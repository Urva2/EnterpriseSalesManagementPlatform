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

    public static AuthenticatedUser isAuthenticated(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new RuntimeException("Invalid user principal.");
        }
        return user;
    }
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
            saleOrder.setStatus("Pending"); //we have to store this saleorder id in when this method calls
            SaleOrder saved = saleOrderRepo.save(saleOrder);
            return saleOrderMapper.saleOrderDto(saved);
        }
        throw new RuntimeException("Error!Customer or SalesPerson Id not Valid.");
    }

    public String updateOrderStatus(int orderId, String status) {
        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        if (saleOrder !=null &&status != null && !status.equals(saleOrder.getStatus())) {
            saleOrder.setStatus(status);
            saleOrderRepo.save(saleOrder);
            return status;
        } else {
            throw new RuntimeException("Select Different Status.");
        }
    }
//    public List<SaleOrderDTO> viewSaleOrder() {
//        List<SaleOrder> saleOrders = saleOrderRepo.findAll();
//        if (!saleOrders.isEmpty()) {
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Error!! SaleOrders Not Found.");
//    }

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
//    public List<SaleOrderDTO> deleteAllSaleOrder(){
//        List<SaleOrder> saleOrders=saleOrderRepo.findAll();
//        if(!saleOrders.isEmpty()){
//            saleOrderRepo.deleteAll();
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Error!Order Not Found.");
//    }
//    public List<SaleOrderDTO> deleteSaleOrderBySalesPersonId(int id){
//        List<SaleOrder> saleOrders=saleOrderRepo.findBySalesPersonId(id);
//        if(!saleOrders.isEmpty()){
//            saleOrderRepo.deleteAll(saleOrders);
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("SalesPerson With Id:"+id+" Has Not Any Orders.");
//    }

//    public List<SaleOrderDTO> deleteSaleOrderByCustomerId(int id){
//        List<SaleOrder> saleOrders=saleOrderRepo.findByCustomerId(id);
//        if(!saleOrders.isEmpty()){
//            saleOrderRepo.deleteAll(saleOrders);
//            return saleOrderMapper.toDtoSaleOrderList(saleOrders);
//        }
//        throw new RuntimeException("Customer With Id:"+id+" Has Not Any Orders.");
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

    public SaleOrderDTO getOrderById(int id){
        SaleOrder order = saleOrderRepo.findById(id);
        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        return saleOrderMapper.saleOrderDto(order);
    }
}

