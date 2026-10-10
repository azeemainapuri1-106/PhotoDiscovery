package com.photodiscovery.dto;

import com.photodiscovery.model.User;
import java.time.Instant;

public record UserDto(Long id, String name, String email, Instant createdAt) {
    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
