package com.photodiscovery.dto;

import com.photodiscovery.model.Download;
import java.time.Instant;

public record DownloadHistoryDto(
        Long id,
        String photoId,
        String title,
        String image,
        String photographer,
        Instant downloadedAt) {
    public static DownloadHistoryDto from(Download download) {
        return new DownloadHistoryDto(
                download.getId(),
                download.getImage().getId(),
                download.getImage().getTitle(),
                download.getImage().getImageUrl(),
                download.getImage().getPhotographer(),
                download.getDownloadedAt());
    }
}
