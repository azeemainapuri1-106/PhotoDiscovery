package com.photodiscovery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class HttpClientConfig {
    @Bean
    RestClient unsplashRestClient(RestClient.Builder builder, UnsplashProperties properties) {
        return builder
                .baseUrl(properties.baseUrl())
                .defaultHeader("Accept-Version", "v1")
                .defaultHeader("Authorization", "Client-ID " + properties.accessKey())
                .build();
    }
}
