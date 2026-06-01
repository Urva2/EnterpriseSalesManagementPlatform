package com.example.sale_entryApp.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(name="itemWeight",nullable = false)
    private String itemWeight;
    @Column(nullable = false)
    private Double price;
    @Column(nullable = false)
    private Integer stockQuantity;
    @OneToMany(mappedBy = "product")
    //@JsonManagedReference(value = "product-item")
    private List<OrderItem> orderItemList;
}
