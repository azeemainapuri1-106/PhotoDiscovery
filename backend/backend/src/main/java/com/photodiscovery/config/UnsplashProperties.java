package com.photodiscovery.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotBlank;

@ConfigurationProperties("unsplash")
@Validated
public record UnsplashProperties(
        @NotBlank String baseUrl,
        @NotBlank String accessKey,
        String secretKey) {
}
