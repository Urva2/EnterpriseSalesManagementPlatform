package com.example.sale_entryApp.dto.RequestDto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class AdminRequestDto {
    @NotBlank(message = "Name is Required!")
    private String name;
    @NotBlank
    @Email(message = "Enter Valid Email!")
    private String email;
    @NotBlank
    @Size(min=6,max=20,message = "Invalid Password!Set Password Of Length 6 to 20.")
    private String password;
}
