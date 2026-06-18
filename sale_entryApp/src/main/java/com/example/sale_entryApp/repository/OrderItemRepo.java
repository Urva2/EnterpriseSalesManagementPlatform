package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.SaleOrder;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
        OrderItem findById(int id); //Just Writing it,but Spring Provide this
        @Query("""
    SELECT oi.product.id, oi.quantity
    FROM OrderItem oi
    WHERE oi.saleOrder.id = :id
""")
        List<Object[]> findProductIdsAndQuantitiesByOrderId(@Param("id") int id);
}
