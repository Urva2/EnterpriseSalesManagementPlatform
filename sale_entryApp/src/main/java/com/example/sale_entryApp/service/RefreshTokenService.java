
package com.example.sale_entryApp.service;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.entity.RefreshToken;
import com.example.sale_entryApp.error.InvalidTokenException;
import com.example.sale_entryApp.repository.RefreshTokenRepo;
import com.example.sale_entryApp.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepo refreshTokenRepository;
    private final TokenHashUtil tokenHashUtil;

    private static final int REFRESH_TOKEN_EXPIRY_DAYS = 7;

    @Transactional
    public String createRefreshToken(AuthenticatedUser user) {
        String rawToken = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())          // from AuthenticatedUser
                .username(user.getUsername())  // from AuthenticatedUser
                .token(tokenHashUtil.hash(rawToken))
                .isRevoked(false)
                .expiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS))
                .build();
        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    public RefreshToken validateAndGet(String rawToken) {
        String hashed = tokenHashUtil.hash(rawToken);

        RefreshToken stored = refreshTokenRepository.findByToken(hashed)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (stored.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Refresh token expired, please login again");
        }

        return stored;
    }

    @Transactional
    public void revoke(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    @Transactional
    public void revokeAllForUser(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    @Transactional
    public void cleanExpiredTokens() {
        refreshTokenRepository.deleteAllExpired(LocalDateTime.now());
    }
}