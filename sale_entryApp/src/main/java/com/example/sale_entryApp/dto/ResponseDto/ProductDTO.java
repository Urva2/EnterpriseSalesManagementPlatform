package com.example.sale_entryApp.dto.ResponseDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private String itemWeight;
    private Double price;
    private Integer stockQuantity;
}
