package com.photodiscovery.dto;

import com.photodiscovery.model.DownloadQuota;
import java.time.Instant;

public record QuotaDto(int downloadsUsed, int downloadsLeft, Instant lockedUntil) {
    public static QuotaDto from(DownloadQuota quota, Instant now) {
        boolean cycleExpired = quota.getLockedUntil() != null && !quota.getLockedUntil().isAfter(now);
        int used = cycleExpired ? 0 : quota.getDownloadsInCycle();
        Instant lock = cycleExpired ? null : quota.getLockedUntil();
        return new QuotaDto(used, Math.max(0, DownloadQuota.MAX_DOWNLOADS_PER_CYCLE - used), lock);
    }
}
