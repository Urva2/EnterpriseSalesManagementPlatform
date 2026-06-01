package com.example.sale_entryApp.dto.ResponseDto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class LoginResponseDto {
    String jwt;
    String userName;

    public LoginResponseDto(String accessToken, String userName) {
        jwt=accessToken;
        this.userName=userName;
    }
}
