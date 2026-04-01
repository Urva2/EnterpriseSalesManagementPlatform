package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.OrderItem;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
        OrderItem findById(int id); //Just Writing it,but Spring Provide this
}
