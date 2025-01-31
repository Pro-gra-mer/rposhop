package com.rposhop.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {
    private final SecretKey secretKey;

    public JwtUtils() {
        String encodedKey = System.getenv("JWT_SECRET_KEY");
        if (encodedKey == null || encodedKey.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY no está configurada en las variables de entorno.");
        }
        this.secretKey = Keys.hmacShaKeyFor(encodedKey.getBytes());
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hora de validez
                .signWith(secretKey, SignatureAlgorithm.HS256) // ⬅ Asegura que se usa HS256
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
