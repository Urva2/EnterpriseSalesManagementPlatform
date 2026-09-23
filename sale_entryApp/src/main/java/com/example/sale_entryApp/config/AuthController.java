package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.RequestDto.LoginRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.LoginResponseDto;
import com.example.sale_entryApp.entity.RefreshToken;
import com.example.sale_entryApp.service.RefreshTokenService;
import com.example.sale_entryApp.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private AuthUtil authUtil;
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequestDto,
                                       HttpServletResponse response){
        return ResponseEntity.ok(authService.login(loginRequestDto, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = cookieUtil.extractRefreshToken(request);
        if (rawToken == null) return ResponseEntity.status(401).body("No refresh token");

        RefreshToken stored = refreshTokenService.validateAndGet(rawToken);

        // Load user details
        AuthenticatedUser user = (AuthenticatedUser) customUserDetailsService
                .loadUserByUsername(stored.getUsername());

        // Issue new access token
        String newAccessToken = authUtil.generateAccessToken(user);

        // Rotate refresh token: revoke old, issue new
        refreshTokenService.revoke(stored);
        String newRawRefreshToken = refreshTokenService.createRefreshToken(user);
        cookieUtil.addRefreshTokenCookie(response, newRawRefreshToken);

        return ResponseEntity.ok(new LoginResponseDto(newAccessToken, user.getUsername()));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = cookieUtil.extractRefreshToken(request);
        if (rawToken != null) {
            try {
                RefreshToken stored = refreshTokenService.validateAndGet(rawToken);
                refreshTokenService.revoke(stored);
            } catch (Exception ignored) { /* Already invalid, still clear cookie */ }
        }
        cookieUtil.clearRefreshTokenCookie(response);
        return ResponseEntity.ok("Logged out");
    }
}
