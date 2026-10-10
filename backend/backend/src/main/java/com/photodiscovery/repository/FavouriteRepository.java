package com.photodiscovery.repository;

import com.photodiscovery.model.Favourite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    boolean existsByUserIdAndImageId(Long userId, String imageId);

    Optional<Favourite> findByUserIdAndImageId(Long userId, String imageId);

    @Query("select f.image.id from Favourite f where f.user.id = :userId order by f.createdAt desc")
    List<String> findImageIdsByUserId(@Param("userId") Long userId);
}
