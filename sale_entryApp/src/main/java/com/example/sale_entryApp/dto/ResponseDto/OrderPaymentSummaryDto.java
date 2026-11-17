package com.example.sale_entryApp.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentSummaryDto {
    private int orderId;
    private double orderTotal;
    private double paidAmount;
    private double remainingBalance;
    private String paymentStatus;
    private List<PaymentResponseDto> payments;
}

