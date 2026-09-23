package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.Product;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product,Integer> {
    Product findByName(String name);
    Product findById(int id);  //Just Writing it,but Spring Provide this
    Product findByItemWeight(String itemWeight);
    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);
    Page<Product> findAllByIsActiveTrue(Pageable pageable);
    List<Product> findByStockQuantityLessThanEqualAndIsActiveTrue(int threshold);
}
