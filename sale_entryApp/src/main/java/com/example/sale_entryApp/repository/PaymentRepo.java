package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.Payment;
import com.example.sale_entryApp.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    List<Payment> findBySaleOrderIdOrderByPaymentDateDesc(int orderId);
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}

