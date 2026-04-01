package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.Product;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product,Integer> {
    Product findByName(String name);
    Product findById(int id);  //Just Writing it,but Spring Provide this
    Product findByItemWeight(String itemWeight);
}
