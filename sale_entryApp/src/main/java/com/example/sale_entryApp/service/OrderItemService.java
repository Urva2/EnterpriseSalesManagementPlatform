package com.example.sale_entryApp.service;

import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.Product;
import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.repository.OrderItemRepo;
import com.example.sale_entryApp.repository.ProductRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderItemService {
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private SaleOrderRepo saleOrderRepo;
    public OrderItem addproduct(int productId,int orderId) {
        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        Product product = productRepo.findById(productId);
        if (saleOrder != null && product != null && product.getStockQuantity()>0) {
            List<OrderItem> orderItemList = saleOrder.getOrderItemList();
            if (!orderItemList.isEmpty()) {
                for (OrderItem o : orderItemList) {
                    if (o.getProduct().getId() == product.getId()) {
                        plusproduct(o.getId());
                        return o;
                    }
                }
            }
                product.setStockQuantity(product.getStockQuantity() - 1);
                productRepo.save(product);
                OrderItem orderItem = new OrderItem();
                orderItem.setSaleOrder(saleOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(1);
                orderItem.setName(product.getName());
                orderItem.setPrice(product.getPrice());
                orderItem.setSubtotal(product.getPrice());
                orderItemRepo.save(orderItem);
                if(!orderItemList.isEmpty()) {
                    orderItemList.add(orderItem);
                }
                else{
                    List<OrderItem> orderlist=new ArrayList<>();
                    orderlist.add(orderItem);
                    saleOrder.setOrderItemList(orderlist);
                }
                //saleOrder.setOrderItemList(orderItemList);
                saleOrder.setTotal(saleOrder.calctotal(saleOrder.getOrderItemList()));
                saleOrderRepo.save(saleOrder);
                return orderItem;
            }
        System.out.println("StockQunt:"+product.getStockQuantity());
        throw new RuntimeException("Product or Saleorder Does not exist or Product is Out of Quantity:");

    }
    public void plusproduct(int orderItmeId){
        OrderItem orderItem=orderItemRepo.findById(orderItmeId);
        Product product =productRepo.findById(orderItem.getProduct().getId());
        if(product.getStockQuantity()>0) {
            product.setStockQuantity(product.getStockQuantity() - 1);
            productRepo.save(product);
            orderItem.setQuantity(orderItem.getQuantity() + 1);
            orderItem.setSubtotal(orderItem.getSubtotal() + orderItem.getPrice());
            orderItemRepo.save(orderItem);
            SaleOrder saleOrder = orderItem.getSaleOrder();
            saleOrder.setTotal(saleOrder.calctotal(saleOrder.getOrderItemList()));
            saleOrderRepo.save(saleOrder);
        }
        else{
            throw new RuntimeException("Sorry,Product is outof Stock!");
        }
    }
    public void minusproduct(int orderItmeId){
        OrderItem orderItem=orderItemRepo.findById(orderItmeId);
        Product product=orderItem.getProduct();
        if(orderItem==null){
            throw new RuntimeException("Please Create Order First And Then Decrease.");
        }
        else if(orderItem.getQuantity()>1) {            //When Quntity is More than 1
            product.setStockQuantity(product.getStockQuantity() + 1);
            productRepo.save(product);
            orderItem.setSubtotal(orderItem.getSubtotal() - orderItem.getPrice());
            orderItem.setQuantity(orderItem.getQuantity() - 1);
            orderItemRepo.save(orderItem);
            SaleOrder saleOrder=orderItem.getSaleOrder();
            saleOrder.setTotal(saleOrder.calctotal(saleOrder.getOrderItemList()));
            saleOrderRepo.save(saleOrder);
        }
        else{  //When Quantity is 1 or 0,then Will Delete OrderEntry and Update the Total Price in SaleOrder
            product.setStockQuantity(product.getStockQuantity() + 1);
            productRepo.save(product);
            SaleOrder saleOrder=orderItem.getSaleOrder();
            List<OrderItem> list=saleOrder.getOrderItemList();
            list.remove(orderItem);
            saleOrder.setTotal(saleOrder.calctotal(list));
        //    saleOrder.setStatus("Pending");
            saleOrderRepo.save(saleOrder);
            orderItemRepo.delete(orderItem);
        }
    }
}
