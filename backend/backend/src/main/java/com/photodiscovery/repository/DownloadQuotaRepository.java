package com.photodiscovery.repository;

import com.photodiscovery.model.DownloadQuota;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DownloadQuotaRepository extends JpaRepository<DownloadQuota, Long> {
    Optional<DownloadQuota> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from DownloadQuota q where q.user.id = :userId")
    Optional<DownloadQuota> findByUserIdForUpdate(@Param("userId") Long userId);
}
