package com.photodiscovery.dto;

import java.time.Instant;

public record DownloadResponse(String photoId, String downloadUrl, Instant downloadedAt, QuotaDto quota) {
}
