package com.photodiscovery.service;

import com.photodiscovery.dto.AuthResponse;
import com.photodiscovery.dto.LoginRequest;
import com.photodiscovery.dto.RegisterRequest;
import com.photodiscovery.exception.DuplicateResourceException;
import com.photodiscovery.exception.InvalidCredentialsException;
import com.photodiscovery.model.DownloadQuota;
import com.photodiscovery.model.User;
import com.photodiscovery.repository.DownloadQuotaRepository;
import com.photodiscovery.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final DownloadQuotaRepository quotaRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(
            UserRepository userRepository,
            DownloadQuotaRepository quotaRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {
        this.userRepository = userRepository;
        this.quotaRepository = quotaRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }

        User user = userRepository.saveAndFlush(new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password())));
        quotaRepository.save(new DownloadQuota(user));
        try {
            return tokenService.issue(user);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        return tokenService.issue(user);
    }
}
