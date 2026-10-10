package com.photodiscovery.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("photodiscovery")
public record PhotoDiscoveryProperties(Cors cors, Jwt jwt) {
    public record Cors(String allowedOrigin) {
    }

    public record Jwt(String secret, long ttlSeconds) {
    }
}
