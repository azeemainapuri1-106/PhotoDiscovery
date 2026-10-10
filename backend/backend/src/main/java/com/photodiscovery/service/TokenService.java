package com.photodiscovery.service;

import com.photodiscovery.dto.AuthResponse;
import com.photodiscovery.dto.UserDto;
import com.photodiscovery.config.PhotoDiscoveryProperties;
import com.photodiscovery.model.User;
import java.time.Instant;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final JwtEncoder jwtEncoder;
    private final long ttlSeconds;

    public TokenService(JwtEncoder jwtEncoder, PhotoDiscoveryProperties properties) {
        this.jwtEncoder = jwtEncoder;
        this.ttlSeconds = properties.jwt().ttlSeconds();
        if (ttlSeconds <= 0) {
            throw new IllegalStateException("JWT_TTL_SECONDS must be greater than zero.");
        }
    }

    public AuthResponse issue(User user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(ttlSeconds);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("photodiscovery")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .build();
        String token = jwtEncoder.encode(
                JwtEncoderParameters.from(org.springframework.security.oauth2.jwt.JwsHeader
                        .with(MacAlgorithm.HS256)
                        .build(), claims))
                .getTokenValue();
        return new AuthResponse(token, "Bearer", ttlSeconds, UserDto.from(user));
    }
}
