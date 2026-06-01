package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.RequestDto.LoginRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.LoginResponseDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AuthUtil authUtil;
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequestDto.getName(),
                loginRequestDto.getPassword())
        );
        AuthenticatedUser authenticatedUser=(AuthenticatedUser) authentication.getPrincipal();
        String accessToken= authUtil.getAccessToken(authenticatedUser);
        String arr[]=accessToken.split("\\.");
        String header = new String(
                Base64.getUrlDecoder().decode(arr[0]),
                StandardCharsets.UTF_8
        );
        System.out.println(header);
        return new LoginResponseDto(accessToken,authenticatedUser.getUsername());
    }
}
