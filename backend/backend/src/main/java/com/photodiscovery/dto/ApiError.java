package com.photodiscovery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        @JsonProperty("locked_until") Instant lockedUntil) {
}
