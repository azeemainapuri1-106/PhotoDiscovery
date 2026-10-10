package com.photodiscovery.service;

import com.photodiscovery.exception.DuplicateResourceException;
import com.photodiscovery.exception.ResourceNotFoundException;
import com.photodiscovery.model.Favourite;
import com.photodiscovery.model.Image;
import com.photodiscovery.model.User;
import com.photodiscovery.repository.FavouriteRepository;
import com.photodiscovery.repository.ImageRepository;
import com.photodiscovery.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavouriteService {
    private final FavouriteRepository favouriteRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public FavouriteService(
            FavouriteRepository favouriteRepository,
            ImageRepository imageRepository,
            UserRepository userRepository) {
        this.favouriteRepository = favouriteRepository;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<String> getFavouriteIds(Long userId) {
        return favouriteRepository.findImageIdsByUserId(userId);
    }

    @Transactional
    public void addFavourite(Long userId, String imageId) {
        if (favouriteRepository.existsByUserIdAndImageId(userId, imageId)) {
            throw new DuplicateResourceException("This photograph is already in your favourites.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User account was not found."));
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Photograph was not found."));
        favouriteRepository.save(new Favourite(user, image));
    }

    @Transactional
    public void removeFavourite(Long userId, String imageId) {
        Favourite favourite = favouriteRepository.findByUserIdAndImageId(userId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Favourite was not found."));
        favouriteRepository.delete(favourite);
    }
}
