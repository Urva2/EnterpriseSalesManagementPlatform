package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class AuthUtil {
    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    public SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

//    public String getAccessToken(AuthenticatedUser authenticatedUser){
//        return Jwts.builder()
//                .subject(authenticatedUser.getUsername())//payload
//                .claim("UserID:",authenticatedUser.getId())
//                .claim("ROLE:",authenticatedUser.getAuthorities())//payload
//                .issuedAt(new Date())//payload
//                .expiration(new Date(System.currentTimeMillis()+1000*60*60))//payload
//                .signWith(getSecretKey()) //header part
//                .compact();//Combine the payload and header part and sign them with the secret key automatically
//    }

    // CHANGED: shorter expiry for access token
    private static final long ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

    public String generateAccessToken(AuthenticatedUser user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", user.getUserType().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRY_MS))
                .signWith(key)
                .compact();
    }
    public String getUserNameFromToken(String token){
        // Start building a JWT parser
        Claims claims = Jwts.parser()
                // Provide the secret key that will be used
                // to verify the JWT signature.
                // If the signature doesn't match, parsing will fail.
                .verifyWith(getSecretKey())
                // Build the configured JwtParser instance
                .build()
                // Parse the JWT token and verify:
                // 1. Structure of JWT
                // 2. Signature using the secret key
                // Returns a Jws<Claims> object
                .parseSignedClaims(token)
                // Extract the payload (Claims) part from the JWT.
                // Claims contain data such as:
                // sub (subject)
                // exp (expiration)
                // iat (issued at)
                // custom claims like role, email, userId, etc.
                .getPayload();
        return claims.getSubject();
    }
}
