package com.photodiscovery.dto;

public record AuthResponse(String token, String tokenType, long expiresIn, UserDto user) {
}
