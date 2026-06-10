package com.example.sale_entryApp.dto.ResponseDto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private String itemWeight;
    private Double price;
    private Integer stockQuantity;
}
