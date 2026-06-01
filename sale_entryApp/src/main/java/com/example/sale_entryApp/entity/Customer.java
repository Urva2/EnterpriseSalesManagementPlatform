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
@Table(name="customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    @Lob
    private String address;
    @Column(nullable = false)
    private String phoneno;
    @OneToMany(mappedBy = "customer")
   // @JsonManagedReference(value = "customer-order")
    private List<SaleOrder> saleOrderList;
}
