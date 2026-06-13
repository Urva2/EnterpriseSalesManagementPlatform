package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.service.OrderItemService;
import com.example.sale_entryApp.service.SaleOrderService;
import jdk.jfr.Percentage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

//Request Dto of SaleOrder and OrderItems is not made bcz,this 2 entity is not getting any sensitive data from input
@RestController
@RequestMapping("/orders")
public class SaleOrderController {
    @Autowired
    private SaleOrderService saleOrderService;
    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private SaleOrderRepo saleOrderRepo;
    //For Createing Empty SaleOrder
    @PostMapping("/createCart/{customerId}")
    public ResponseEntity<?> createOrder(@PathVariable int customerId){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AuthenticatedUser user = SaleOrderService.isAuthenticated(authentication);
            int salespersonId = Math.toIntExact(user.getId());
            SaleOrderDTO saleOrder = saleOrderService.createSaleOrder(salespersonId,customerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(saleOrder);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    //For Adding Item into the Cart and Creates new OrderItem
    @PostMapping("/{productId}/addToCart/{orderId}")
    public ResponseEntity<?> addProductInSaleOrder(@PathVariable int productId, @PathVariable int orderId, @RequestParam(defaultValue = "1") int quantity){
        try {
            OrderItem orderItem = orderItemService.addproduct(productId, orderId, quantity);
            return ResponseEntity.status(HttpStatus.OK).body(orderItem);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    //For Increasing Quntity Of Items Of OrderItem
    @PutMapping("/incrsQty/{orderItmeId}")
    public ResponseEntity<?> increaseQuntity(@PathVariable int orderItmeId){
        orderItemService.plusproduct(orderItmeId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    //For Decreasing Quntity Of Items Of OrderItem
    @PutMapping("/dcrsQty/{orderItmeId}")
    public ResponseEntity<?> decreaseQuntity(@PathVariable int orderItmeId){
        try {
            orderItemService.minusproduct(orderItmeId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
    //For Updating Status Of SalesOrder
    @PutMapping("/updatestatus/{orderId}")
    public ResponseEntity<?> statusupdate(@RequestBody SaleOrder saleOrder,@PathVariable int orderId){
        try {
            String status = saleOrder.getStatus();
            String updatedStatus=saleOrderService.updateOrderStatus(orderId,status);
            return ResponseEntity.status(HttpStatus.OK).body(updatedStatus);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    //For Calculating total revenue Of All Sales Order
    @GetMapping("/totalrev")
    public double cal_revenue(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user =SaleOrderService.isAuthenticated(authentication);
        int salesPersonId= Math.toIntExact(user.getId());
        Double totalRev = saleOrderRepo.calculateTotalRevenueBySalesPersonId(salesPersonId);
        return totalRev != null ? totalRev : 0.0;
    }
    //For Now in this controller Route the Admin and SalesPerson based on Their Autherity,Later will Done using @PreAuthorize
    @PutMapping("/delete-order/{id}")
    public ResponseEntity<SaleOrderDTO> deleteSaleOrderById(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser user = SaleOrderService.isAuthenticated(authentication);
        SaleOrderDTO saleOrderDTO;
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(auth -> Objects.equals(auth.getAuthority(), "ROLE_ADMIN"));
        if(isAdmin) {
            saleOrderDTO=saleOrderService.deleteSaleOrderById(id);
        }
        else{
            int salesPersonId = Math.toIntExact(user.getId());
            saleOrderDTO = saleOrderService.deleteSaleOrderBySalesPerson(id, salesPersonId);
        }
        return ResponseEntity.ok(saleOrderDTO);
    }
//    @DeleteMapping
//    public ResponseEntity<?> deleteAllOrders(){
//        try{
//            List<SaleOrderDTO> saleOrderDTOList=saleOrderService.deleteAllSaleOrder();
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTOList);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }
//    @DeleteMapping("/dltbyid/{id}")
//    public ResponseEntity<?> deleteOrderById(@PathVariable int id){
//        try{
//            SaleOrderDTO saleOrderDTO=saleOrderService.deleteSaleOrderById(id);
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTO);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }
//    @DeleteMapping("/dltbysalesPersonId/{id}")
//    public ResponseEntity<?> deleteOrderBySalePersonId(@PathVariable int id){
//        try{
//            List<SaleOrderDTO> saleOrderDTOList=saleOrderService.deleteSaleOrderBySalesPersonId(id);
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTOList);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }
//    @DeleteMapping("/dltbycustomerId/{id}")
//    public ResponseEntity<?> deleteOrderByCustomerId(@PathVariable int id){
//        try{
//            List<SaleOrderDTO> saleOrderDTOList=saleOrderService.deleteSaleOrderByCustomerId(id);
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTOList);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }
//    @DeleteMapping("/dltbyStatus/{status}")
//    public ResponseEntity<?> deleteOrderByStatus(@PathVariable String status){
//        try{
//            List<SaleOrderDTO> saleOrderDTOList=saleOrderService.deleteSaleOrderByStatus(status);
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTOList);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }
//    @DeleteMapping("/dltbyDate/{date}")
//    public ResponseEntity<?> deleteOrderByDate(@PathVariable LocalDate date){
//        try{
//            List<SaleOrderDTO> saleOrderDTOList=saleOrderService.deleteSaleOrderByDate(date);
//            return ResponseEntity.status(HttpStatus.OK).body(saleOrderDTOList);
//        }catch (RuntimeException e){
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
//        }
//    }

    //Need Pagination Here.
    @GetMapping("/my-orders")
    public ResponseEntity<List<SaleOrderDTO>> getMyOrders()
    {
        return ResponseEntity.ok(saleOrderService.getMyOrders());
    }
    @GetMapping("/search-my-orders")
    public ResponseEntity<Page<SaleOrderDTO>> searchMyOrderes(@PageableDefault(page = 0,size = 10) Pageable pageable,
                                                              @RequestParam String customerName){
        Page<SaleOrderDTO> saleOrderDTOS=saleOrderService.getMyOrdersByname(pageable,customerName);
        return ResponseEntity.ok(saleOrderDTOS);
    }
    @GetMapping("/search-my-orders-status")
    public ResponseEntity<Page<SaleOrderDTO>> searchMyOrderesByStatus(@PageableDefault(page = 0,size = 10) Pageable pageable,
                                                              @RequestParam String status){
        Page<SaleOrderDTO> saleOrderDTOS=saleOrderService.getMyOrdersByStatus(pageable,status);
        return ResponseEntity.ok(saleOrderDTOS);
    }
    @GetMapping("/viewOrders")
    public ResponseEntity<Page<SaleOrderDTO>> getAllSaleOrders(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<SaleOrderDTO> orders = saleOrderService.getAllSaleOrders(pageable);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<SaleOrderDTO>> searchSaleOrdersByCustomerName(
            @RequestParam String customerName,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<SaleOrderDTO> orders = saleOrderService.searchSaleOrdersByCustomerName(customerName, pageable);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/search-status")
    public ResponseEntity<Page<SaleOrderDTO>> searchSaleOrderByStatus(@RequestParam String status,
                                                                      @PageableDefault(page = 0, size = 10) Pageable pageable){
        Page<SaleOrderDTO> orders = saleOrderService.searchSaleOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }
}

//http://localhost:8080/orders
//http://localhost:8080/orders/dltbyid
//http://localhost:8080/orders/dltbysalesPersonId/{id}
//http://localhost:8080/orders/dltbycustomerId/{id}
//http://localhost:8080/orders/dltbyStatus/{status}
//http://localhost:8080/orders/dltbyDate/{date}