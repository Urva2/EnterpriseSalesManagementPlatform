package com.example.sale_entryApp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InvoiceDto {
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private int orderId;
    private String orderStatus;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String salespersonName;
    private List<InvoiceItemDto> items;
    private double subtotal;
    private double discountPercent;
    private double discountAmount;
    private double grandTotal;
    private double paidAmount;
    private double remainingBalance;
    private String paymentStatus;
    private String remarks;
}

