package com.photodiscovery.controller;

import com.photodiscovery.dto.AuthResponse;
import com.photodiscovery.dto.GoogleAuthRequest;
import com.photodiscovery.dto.LoginRequest;
import com.photodiscovery.dto.RegisterRequest;
import com.photodiscovery.dto.UserDto;
import com.photodiscovery.service.AuthService;
import com.photodiscovery.service.CurrentUserService;
import com.photodiscovery.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final CurrentUserService currentUserService;

    public AuthController(
            AuthService authService,
            GoogleAuthService googleAuthService,
            CurrentUserService currentUserService) {
        this.authService = authService;
        this.googleAuthService = googleAuthService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse google(@Valid @RequestBody GoogleAuthRequest request) {
        return googleAuthService.authenticate(request.idToken());
    }

    @GetMapping("/me")
    public UserDto currentUser(@AuthenticationPrincipal Jwt jwt) {
        return UserDto.from(currentUserService.requireUser(jwt));
    }
}
