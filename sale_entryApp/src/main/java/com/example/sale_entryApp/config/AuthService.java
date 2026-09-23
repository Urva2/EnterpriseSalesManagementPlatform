package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.RequestDto.LoginRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.LoginResponseDto;
import com.example.sale_entryApp.service.RefreshTokenService;
import com.example.sale_entryApp.util.CookieUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletResponse;
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

    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private CookieUtil cookieUtil;
    public LoginResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequestDto.getName(),
                loginRequestDto.getPassword())
        );
        AuthenticatedUser authenticatedUser=(AuthenticatedUser) authentication.getPrincipal();
        String accessToken= authUtil.generateAccessToken(authenticatedUser);

        //Refresh token
        String rawRefreshToken = refreshTokenService.createRefreshToken(authenticatedUser);
        cookieUtil.addRefreshTokenCookie(response, rawRefreshToken);
        String arr[]=accessToken.split("\\.");//For Debugging only.
        String header = new String(  ////For Debugging only.
                Base64.getUrlDecoder().decode(arr[0]),////For Debugging only.
                StandardCharsets.UTF_8//For Debugging only.
        );//For Debugging only.
        System.out.println(header);//For Debugging only.
        return new LoginResponseDto(accessToken,authenticatedUser.getUsername());
    }
}
