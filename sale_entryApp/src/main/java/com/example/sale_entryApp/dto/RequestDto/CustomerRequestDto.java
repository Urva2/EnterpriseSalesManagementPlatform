package com.example.sale_entryApp.dto.RequestDto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class CustomerRequestDto {
    @NotBlank(message = "Name is Required!")
    private String name;
    @NotBlank(message = "Address is Required!")
    @Lob
    private String address;
    @Pattern(regexp = "\\d{10}",message = "Phone No. Must be of 10 Digits.")
    private String phoneno;
}
