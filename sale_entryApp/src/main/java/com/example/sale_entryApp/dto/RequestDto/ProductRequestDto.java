package com.example.sale_entryApp.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ProductRequestDto {
    @NotBlank(message = "Name is Required!")
    private String name;
    @NotBlank(message = "ItemWeight is Required.")
    private String itemWeight;
    @Positive(message = "Price of the item must be Positive.")
    private double price;
}
