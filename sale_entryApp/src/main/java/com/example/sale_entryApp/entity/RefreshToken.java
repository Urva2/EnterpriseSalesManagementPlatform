package com.example.sale_entryApp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ADD these instead:
    @Column(nullable = false)
    private Long userId;      // the admin.id or salesperson.id
    @Column(nullable = false)
    private String username;  // the name used to login


    @Column(nullable = false, unique = true, length = 512)
    private String token; // stores the HASHED value, never raw

    @Column(nullable = false)
    private boolean isRevoked;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
