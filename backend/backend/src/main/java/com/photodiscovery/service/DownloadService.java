package com.photodiscovery.service;

import com.photodiscovery.dto.DownloadHistoryDto;
import com.photodiscovery.dto.DownloadResponse;
import com.photodiscovery.dto.QuotaDto;
import com.photodiscovery.exception.QuotaExceededException;
import com.photodiscovery.exception.ResourceNotFoundException;
import com.photodiscovery.model.Download;
import com.photodiscovery.model.DownloadQuota;
import com.photodiscovery.model.Image;
import com.photodiscovery.repository.DownloadQuotaRepository;
import com.photodiscovery.repository.DownloadRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DownloadService {
    private final PhotoService photoService;
    private final ImageProvider imageProvider;
    private final DownloadQuotaRepository quotaRepository;
    private final DownloadRepository downloadRepository;
    private final Clock clock;

    public DownloadService(
            PhotoService photoService,
            ImageProvider imageProvider,
            DownloadQuotaRepository quotaRepository,
            DownloadRepository downloadRepository,
            Clock clock) {
        this.photoService = photoService;
        this.imageProvider = imageProvider;
        this.quotaRepository = quotaRepository;
        this.downloadRepository = downloadRepository;
        this.clock = clock;
    }

    @Transactional
    public DownloadResponse download(String photoId, Long userId) {
        Image image = photoService.requireStoredPhoto(photoId);
        DownloadQuota quota = quotaRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Download quota was not found."));
        Instant now = clock.instant();

        if (quota.getLockedUntil() != null) {
            if (quota.getLockedUntil().isAfter(now)) {
                throw new QuotaExceededException(quota.getLockedUntil());
            }
            quota.resetCycle();
        } else if (quota.getDownloadsInCycle() >= DownloadQuota.MAX_DOWNLOADS_PER_CYCLE) {
            Instant lockedUntil = now.plusSeconds(24 * 60 * 60);
            throw new QuotaExceededException(lockedUntil);
        }

        // Keep the row lock until the provider confirms the download URL and the
        // quota/history writes commit together.
        String downloadUrl = imageProvider.triggerDownload(image.getDownloadLocation());
        quota.recordDownload(now);
        downloadRepository.save(new Download(quota.getUser(), image, now));
        return new DownloadResponse(photoId, downloadUrl, now, QuotaDto.from(quota, now));
    }

    @Transactional(readOnly = true)
    public QuotaDto getQuota(Long userId) {
        Instant now = clock.instant();
        DownloadQuota quota = quotaRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Download quota was not found."));
        return QuotaDto.from(quota, now);
    }

    @Transactional(readOnly = true)
    public List<DownloadHistoryDto> getHistory(Long userId) {
        return downloadRepository.findAllByUserIdOrderByDownloadedAtDesc(userId)
                .stream()
                .map(DownloadHistoryDto::from)
                .toList();
    }
}
