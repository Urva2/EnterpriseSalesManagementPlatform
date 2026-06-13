package com.example.sale_entryApp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aspectj.weaver.ast.Or;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="saleorder",
indexes = {
        @Index(name="idx_customer",columnList = "c_id"),
        @Index(name="idx_customer",columnList = "status")
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
        double total=0.0;
        for(OrderItem o:list){
            total+=o.getSubtotal();
        }
        return total;
    }
}
