package com.photodiscovery.service;

import com.photodiscovery.dto.AuthResponse;
import com.photodiscovery.model.DownloadQuota;
import com.photodiscovery.model.User;
import com.photodiscovery.repository.DownloadQuotaRepository;
import com.photodiscovery.repository.UserRepository;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoogleAuthService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthService.class);

    private final UserRepository userRepository;
    private final DownloadQuotaRepository quotaRepository;
    private final JwtDecoder googleJwtDecoder;
    private final TokenService tokenService;
    private final String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository,
            DownloadQuotaRepository quotaRepository,
            @Qualifier("googleJwtDecoder") JwtDecoder googleJwtDecoder,
            TokenService tokenService,
            @Value("${app.google.client-id}") String googleClientId) {
        this.userRepository = userRepository;
        this.quotaRepository = quotaRepository;
        this.googleJwtDecoder = googleJwtDecoder;
        this.tokenService = tokenService;
        this.googleClientId = googleClientId;
    }

    @Transactional
    public AuthResponse authenticate(String idToken) {
        if (googleClientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Google sign-in is not configured.");
        }

        final Jwt googleToken;
        try {
            googleToken = googleJwtDecoder.decode(idToken);
        } catch (JwtException exception) {
            logger.warn("Google ID-token verification failed: {}", exception.getClass().getSimpleName());
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Google authentication failed. Please try again.");
        }

        String subject = googleToken.getSubject();
        String email = googleToken.getClaimAsString("email");
        if (subject == null
                || subject.isBlank()
                || email == null
                || !email.contains("@")
                || !Boolean.TRUE.equals(googleToken.getClaim("email_verified"))) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Google authentication failed. Please use a verified Google account and try again.");
        }
        email = email.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByGoogleSubject(subject).orElse(null);
        if (user == null) {
            user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (user != null) {
                if (user.getGoogleSubject() != null && !user.getGoogleSubject().equals(subject)) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "This email is already linked to a different Google account.");
                }
                user.linkGoogleSubject(subject);
                userRepository.save(user);
            } else {
                String name = googleToken.getClaimAsString("name");
                if (name == null || name.isBlank()) {
                    name = email.substring(0, email.indexOf('@'));
                }
                user = new User(name, email, null);
                user.linkGoogleSubject(subject);
                user = userRepository.saveAndFlush(user);
                quotaRepository.save(new DownloadQuota(user));
            }
        }
        return tokenService.issue(user);
    }
}
