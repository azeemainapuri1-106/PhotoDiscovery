package com.photodiscovery.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.photodiscovery.dto.DownloadResponse;
import com.photodiscovery.exception.QuotaExceededException;
import com.photodiscovery.model.Download;
import com.photodiscovery.model.DownloadQuota;
import com.photodiscovery.model.Image;
import com.photodiscovery.model.User;
import com.photodiscovery.repository.DownloadQuotaRepository;
import com.photodiscovery.repository.DownloadRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DownloadServiceTest {
    private static final Instant NOW = Instant.parse("2026-10-10T12:00:00Z");

    @Mock
    private PhotoService photoService;

    @Mock
    private ImageProvider imageProvider;

    @Mock
    private DownloadQuotaRepository quotaRepository;

    @Mock
    private DownloadRepository downloadRepository;

    private DownloadQuota quota;
    private DownloadService downloadService;

    @BeforeEach
    void setUp() {
        quota = new DownloadQuota(new User("A Person", "a@example.com", "hash"));
        downloadService = new DownloadService(
                photoService,
                imageProvider,
                quotaRepository,
                downloadRepository,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void recordsDownloadOnlyAfterProviderConfirmsDownloadUrl() {
        Image image = image();
        when(photoService.requireStoredPhoto("photo-1")).thenReturn(image);
        when(quotaRepository.findByUserIdForUpdate(7L)).thenReturn(Optional.of(quota));
        when(imageProvider.triggerDownload("https://api.unsplash.com/photos/photo-1/download"))
                .thenReturn("https://images.example/download.jpg");

        DownloadResponse response = downloadService.download("photo-1", 7L);

        assertThat(response.quota().downloadsUsed()).isEqualTo(1);
        assertThat(response.quota().downloadsLeft()).isEqualTo(2);
        assertThat(response.quota().lockedUntil()).isNull();
        verify(quotaRepository).findByUserIdForUpdate(7L);
        verify(downloadRepository).save(org.mockito.ArgumentMatchers.any(Download.class));
    }

    @Test
    void rejectsDownloadWhileCycleIsLockedWithoutCallingProvider() {
        quota.recordDownload(NOW.minusSeconds(3));
        quota.recordDownload(NOW.minusSeconds(2));
        quota.recordDownload(NOW.minusSeconds(1));
        when(photoService.requireStoredPhoto("photo-1")).thenReturn(image());
        when(quotaRepository.findByUserIdForUpdate(7L)).thenReturn(Optional.of(quota));

        assertThatThrownBy(() -> downloadService.download("photo-1", 7L))
                .isInstanceOf(QuotaExceededException.class)
                .extracting("lockedUntil")
                .isEqualTo(NOW.plusSeconds(24 * 60 * 60 - 1));

        verify(imageProvider, never()).triggerDownload(org.mockito.ArgumentMatchers.any());
        verify(downloadRepository, never()).save(org.mockito.ArgumentMatchers.any(Download.class));
    }

    private Image image() {
        return new Image(
                "photo-1",
                "A photo",
                "A photographer",
                "https://unsplash.com/@photographer",
                "Nature",
                "https://images.unsplash.com/photo.jpg",
                "https://api.unsplash.com/photos/photo-1/download",
                1200,
                1800);
    }
}
