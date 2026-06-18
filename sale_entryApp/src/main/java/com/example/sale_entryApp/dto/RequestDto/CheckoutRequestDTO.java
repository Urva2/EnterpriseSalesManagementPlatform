package com.example.sale_entryApp.dto.RequestDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutRequestDTO {
    private List<CartItemDTO> items;
}
