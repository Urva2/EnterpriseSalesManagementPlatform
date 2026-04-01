package com.example.sale_entryApp.dto.ResponseDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class OrderItemDTO {
    private String name;
    private int quantity;
    private double price;
    private double subtotal;
}
