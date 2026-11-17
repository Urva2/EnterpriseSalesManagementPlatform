package com.example.sale_entryApp.dto.RequestDto;

import com.example.sale_entryApp.entity.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be greater than 0")
    private double amount;

    @NotNull(message = "Payment method is required (CASH, CARD, UPI)")
    private PaymentMethod paymentMethod;

    private String transactionReference;

    private String remarks;
}

