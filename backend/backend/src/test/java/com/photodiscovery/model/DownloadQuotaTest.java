package com.photodiscovery.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import org.junit.jupiter.api.Test;

class DownloadQuotaTest {
    @Test
    void locksForTwentyFourHoursOnTheThirdDownload() {
        Instant now = Instant.parse("2026-10-10T12:00:00Z");
        DownloadQuota quota = new DownloadQuota(new User("A Person", "a@example.com", "hash"));

        quota.recordDownload(now);
        quota.recordDownload(now.plusSeconds(1));
        assertThat(quota.getDownloadsInCycle()).isEqualTo(2);
        assertThat(quota.getLockedUntil()).isNull();

        quota.recordDownload(now.plusSeconds(2));

        assertThat(quota.getDownloadsInCycle()).isEqualTo(3);
        assertThat(quota.getLockedUntil()).isEqualTo(now.plusSeconds(2 + 24 * 60 * 60));
    }

    @Test
    void resetsCountAndLockAtTheStartOfANewCycle() {
        DownloadQuota quota = new DownloadQuota(new User("A Person", "a@example.com", "hash"));
        Instant now = Instant.parse("2026-10-10T12:00:00Z");
        quota.recordDownload(now);
        quota.recordDownload(now);
        quota.recordDownload(now);

        quota.resetCycle();

        assertThat(quota.getDownloadsInCycle()).isZero();
        assertThat(quota.getLockedUntil()).isNull();
    }
}
