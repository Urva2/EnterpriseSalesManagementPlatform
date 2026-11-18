package com.example.sale_entryApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItemDto {
    private String productName;
    private int quantity;
    private double unitPrice;
    private double subtotal;
}

