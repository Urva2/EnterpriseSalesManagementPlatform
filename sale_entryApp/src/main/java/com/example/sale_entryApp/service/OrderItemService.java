
package com.example.sale_entryApp.service;

import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.Product;
import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.repository.OrderItemRepo;
import com.example.sale_entryApp.repository.ProductRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public OrderItem addproduct(int productId, int orderId, int quantity) {

        SaleOrder saleOrder = saleOrderRepo.findById(orderId);
        Product product = productRepo.findById(productId);

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero.");
        }

        if (saleOrder != null && product != null
                && product.getIsActive()
                && product.getStockQuantity() >= quantity) {

            List<OrderItem> orderItemList = saleOrder.getOrderItemList();

            if (!orderItemList.isEmpty()) {
                for (OrderItem o : orderItemList) {

                    if (o.getProduct().getId() == product.getId()) {

                        for (int i = 0; i < quantity; i++) {
                            plusproduct(o.getId());
                        }

                        return o;
                    }
                }
            }

            product.setStockQuantity(
                    product.getStockQuantity() - quantity
            );

            productRepo.save(product);

            OrderItem orderItem = new OrderItem();

            orderItem.setSaleOrder(saleOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setName(product.getName());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice() * quantity);

            orderItemRepo.save(orderItem);

            if (!orderItemList.isEmpty()) {
                orderItemList.add(orderItem);
            } else {
                List<OrderItem> orderlist = new ArrayList<>();
                orderlist.add(orderItem);
                saleOrder.setOrderItemList(orderlist);
            }

            saleOrder.setTotal(
                    saleOrder.calctotal(saleOrder.getOrderItemList())
            );

            saleOrderRepo.save(saleOrder);

            return orderItem;
        }

        if (product == null) {
            throw new RuntimeException("Product does not exist.");
        }

        if (!product.getIsActive()) {
            throw new RuntimeException("Product is Not Available For Sell.");
        }

        throw new RuntimeException(
                "Saleorder does not exist or Product does not have enough Quantity."
        );
    }

    @Transactional
    public void plusproduct(int orderItmeId) {

        OrderItem orderItem = orderItemRepo.findById(orderItmeId);

        if (orderItem == null) {
            throw new RuntimeException("Order item not found.");
        }

        Product product = productRepo.findById(
                orderItem.getProduct().getId()
        );

        if (product == null) {
            throw new RuntimeException("Product not found.");
        }

        if (!product.getIsActive()) {
            throw new RuntimeException(
                    "Product " + product.getName() + " is no longer available."
            );
        }

        if (product.getStockQuantity() > 0) {

            product.setStockQuantity(
                    product.getStockQuantity() - 1
            );

            productRepo.save(product);

            orderItem.setQuantity(orderItem.getQuantity() + 1);
            orderItem.setSubtotal(
                    orderItem.getSubtotal() + orderItem.getPrice()
            );

            orderItemRepo.save(orderItem);

            SaleOrder saleOrder = orderItem.getSaleOrder();

            saleOrder.setTotal(
                    saleOrder.calctotal(saleOrder.getOrderItemList())
            );

            saleOrderRepo.save(saleOrder);

        } else {
            throw new RuntimeException("Sorry, Product is out of Stock!");
        }
    }

    @Transactional
    public void minusproduct(int orderItmeId) {

        OrderItem orderItem = orderItemRepo.findById(orderItmeId);

        if (orderItem == null) {
            throw new RuntimeException(
                    "Please Create Order First And Then Decrease."
            );
        }

        Product product = orderItem.getProduct();

        if (orderItem.getQuantity() > 1) {

            product.setStockQuantity(
                    product.getStockQuantity() + 1
            );

            productRepo.save(product);

            orderItem.setSubtotal(
                    orderItem.getSubtotal() - orderItem.getPrice()
            );

            orderItem.setQuantity(orderItem.getQuantity() - 1);

            orderItemRepo.save(orderItem);

            SaleOrder saleOrder = orderItem.getSaleOrder();

            saleOrder.setTotal(
                    saleOrder.calctotal(saleOrder.getOrderItemList())
            );

            saleOrderRepo.save(saleOrder);

        } else {

            // Restore stock before removing the order item
            product.setStockQuantity(
                    product.getStockQuantity() + 1
            );

            productRepo.save(product);

            SaleOrder saleOrder = orderItem.getSaleOrder();

            List<OrderItem> list = saleOrder.getOrderItemList();

            list.remove(orderItem);

            saleOrder.setTotal(saleOrder.calctotal(list));

            saleOrderRepo.save(saleOrder);

            orderItemRepo.delete(orderItem);
        }
    }

    // Remove complete item from cart
    @Transactional
    public void removeItem(int orderItemId) {

        OrderItem orderItem = orderItemRepo.findById(orderItemId);

        if (orderItem == null) {
            throw new RuntimeException(
                    "Order item not found with ID: " + orderItemId
            );
        }

        // Restore the entire quantity to product stock
        Product product = orderItem.getProduct();

        if (product != null) {
            product.setStockQuantity(
                    product.getStockQuantity() + orderItem.getQuantity()
            );

            productRepo.save(product);
        }

        // Update order total
        SaleOrder saleOrder = orderItem.getSaleOrder();

        if (saleOrder != null) {

            List<OrderItem> list = saleOrder.getOrderItemList();

            if (list != null) {
                list.remove(orderItem);

                saleOrder.setTotal(
                        saleOrder.calctotal(list)
                );

                saleOrderRepo.save(saleOrder);
            }
        }

        orderItemRepo.delete(orderItem);
    }

    // Compatibility method for existing callers
    @Transactional
    public void removeItemFromCart(int orderItemId) {
        removeItem(orderItemId);
    }
}
