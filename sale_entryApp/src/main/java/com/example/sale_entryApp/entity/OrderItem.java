package com.example.sale_entryApp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="orderitem")
public class OrderItem { //here validation also Done in Service layer
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @PositiveOrZero(message = "Invalid Quantity of Order!")
    @Column
    private int quantity;
    @PositiveOrZero(message = "Invalid Price of Order!")
    @Column
    private double price;
    @PositiveOrZero(message = "Invalid Subtotal of Order!")
    @Column
    private double subtotal;
    @ManyToOne
    @JoinColumn(name="s_id")
    @JsonBackReference(value = "order-item")
    private SaleOrder saleOrder;

    @ManyToOne
    @JoinColumn(name="p_id")
    @JsonBackReference(value = "product-item")
    private Product product;
}
