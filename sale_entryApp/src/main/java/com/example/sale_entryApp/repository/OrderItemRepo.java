package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.SaleOrder;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
        OrderItem findById(int id); //Just Writing it,but Spring Provide this

        @Query("""
    SELECT oi.product.name, SUM(oi.quantity)
    FROM OrderItem oi
    GROUP BY oi.product.id, oi.product.name
    ORDER BY SUM(oi.quantity) DESC
    """)
        List<Object[]> getTopSellingProducts(Pageable pageable);
}
