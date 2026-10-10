package com.photodiscovery.service;

import com.photodiscovery.exception.ResourceNotFoundException;
import com.photodiscovery.model.User;
import com.photodiscovery.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireUser(Jwt jwt) {
        try {
            long userId = Long.parseLong(jwt.getSubject());
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User account was not found."));
        } catch (NumberFormatException exception) {
            throw new ResourceNotFoundException("User account was not found.");
        }
    }
}
