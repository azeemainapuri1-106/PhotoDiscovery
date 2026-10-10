package com.photodiscovery.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "download_quotas", uniqueConstraints = @UniqueConstraint(
        name = "uk_download_quotas_user", columnNames = "user_id"))
public class DownloadQuota {
    public static final int MAX_DOWNLOADS_PER_CYCLE = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "downloads_in_cycle", nullable = false)
    private int downloadsInCycle;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    protected DownloadQuota() {
    }

    public DownloadQuota(User user) {
        this.user = user;
        this.downloadsInCycle = 0;
    }

    public void resetCycle() {
        downloadsInCycle = 0;
        lockedUntil = null;
    }

    public void recordDownload(Instant now) {
        downloadsInCycle++;
        if (downloadsInCycle >= MAX_DOWNLOADS_PER_CYCLE) {
            lockedUntil = now.plusSeconds(24 * 60 * 60);
        }
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public int getDownloadsInCycle() {
        return downloadsInCycle;
    }

    public Instant getLockedUntil() {
        return lockedUntil;
    }
}
