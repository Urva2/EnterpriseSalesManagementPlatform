package com.example.sale_entryApp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="saleorder",
indexes = {
        @Index(name="idx_customer",columnList = "c_id"),
        @Index(name="idx_customer",columnList = "status"),
        @Index(name = "idx_saleorder_date", columnList = "date"),
        @Index(name = "idx_saleorder_salesperson", columnList = "sales_p_id"),
        @Index(name = "idx_saleorder_customer", columnList = "c_id")
})
public class SaleOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private double total;
    @Column(nullable = false)
    private String status;

    @Column
    private String remarks;

    @Column
    private Double discountPercent = 0.0;

    @Column
    private Double discountAmount = 0.0;

    @Column
    private Double paidAmount = 0.0;

    @Column
    private String paymentStatus = "UNPAID";

    @OneToMany(mappedBy = "saleOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "order-payments")
    private List<Payment> payments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="c_id")
    //@JsonBackReference(value = "customer-order")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="sales_p_id")
   // @JsonBackReference(value = "salesperson-order")
    private SalesPerson salesPerson;

    @OneToMany(mappedBy = "saleOrder",cascade = CascadeType.ALL)
    @JsonManagedReference(value = "order-item")
    private List<OrderItem> orderItemList;

    public double calctotal(List<OrderItem> list){
        double subtotal = 0.0;
        if (list != null) {
            for(OrderItem o : list){
                subtotal += o.getSubtotal();
            }
        }
        double discount = 0.0;
        if (discountPercent != null && discountPercent > 0.0) {
            discount = (subtotal * discountPercent) / 100.0;
        }
        this.discountAmount = discount;
        double finalTotal = subtotal - discount;
        return Math.max(0.0, finalTotal);
    }
}
