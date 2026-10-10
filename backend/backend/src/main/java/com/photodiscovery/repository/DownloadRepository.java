package com.photodiscovery.repository;

import com.photodiscovery.model.Download;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findAllByUserIdOrderByDownloadedAtDesc(Long userId);
}
