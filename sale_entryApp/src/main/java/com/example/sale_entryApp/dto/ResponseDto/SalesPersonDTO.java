package com.example.sale_entryApp.dto.ResponseDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class SalesPersonDTO {
    private String name;
    private String email;
    private String role;
    private String phoneno;
}

