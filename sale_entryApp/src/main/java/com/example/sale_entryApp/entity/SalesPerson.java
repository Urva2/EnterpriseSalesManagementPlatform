package com.example.sale_entryApp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="salesperson",
        indexes = {
                @Index(name = "idx_name", columnList = "name")
        })
public class SalesPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role;
    @Column
    private String phoneno;
    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "salesPerson")
    private List<SaleOrder> saleOrderList;
}
