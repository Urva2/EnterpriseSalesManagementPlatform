package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken,Long> {

    @Modifying
    @Query("UPDATE RefreshToken r SET r.isRevoked = true WHERE r.userId = :userId")
    void revokeAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiresAt < :now")
    void deleteAllExpired(@Param("now") LocalDateTime now);

    Optional<RefreshToken> findByToken(String token);
}
