package com.example.sale_entryApp.dto.ResponseDto;

import com.example.sale_entryApp.entity.PaymentMethod;
import com.example.sale_entryApp.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;
    private int orderId;
    private double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionReference;
    private LocalDateTime paymentDate;
    private String remarks;
    private double orderTotal;
    private double orderPaidAmount;
    private double remainingBalance;
}

