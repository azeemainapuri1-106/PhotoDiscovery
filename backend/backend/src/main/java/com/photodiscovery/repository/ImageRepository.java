package com.photodiscovery.repository;

import com.photodiscovery.model.Image;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, String> {
    Optional<Image> findBySourceAndExternalId(String source, String externalId);

    long countBySourceAndExternalId(String source, String externalId);

    List<Image> findAllBySourceAndExternalIdIn(String source, Collection<String> externalIds);
}
