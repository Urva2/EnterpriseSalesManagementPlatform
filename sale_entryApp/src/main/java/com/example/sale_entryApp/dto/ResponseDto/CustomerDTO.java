package com.example.sale_entryApp.dto.ResponseDto;

import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class CustomerDTO {
    private String name;
    @Lob
    private String address;
    private String phoneno;
}
