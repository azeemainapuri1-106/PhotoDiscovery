package com.photodiscovery.exception;

import java.time.Instant;

public class QuotaExceededException extends RuntimeException {
    private final Instant lockedUntil;

    public QuotaExceededException(Instant lockedUntil) {
        super("The download limit has been reached.");
        this.lockedUntil = lockedUntil;
    }

    public Instant getLockedUntil() {
        return lockedUntil;
    }
}
