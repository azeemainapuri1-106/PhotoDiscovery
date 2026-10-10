package com.photodiscovery.service;

import com.photodiscovery.dto.PhotoDto;
import com.photodiscovery.exception.ResourceNotFoundException;
import com.photodiscovery.model.Image;
import com.photodiscovery.repository.ImageRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PhotoService {
    private final ImageProvider imageProvider;
    private final ImageRepository imageRepository;

    public PhotoService(ImageProvider imageProvider, ImageRepository imageRepository) {
        this.imageProvider = imageProvider;
        this.imageRepository = imageRepository;
    }

    @Transactional
    public List<PhotoDto> getPhotos(String query, String category, int page, int perPage) {
        List<ImageProvider.ProvidedPhoto> provided = imageProvider.fetchPhotos(query, category, page, perPage);
        return persist(provided);
    }

    @Transactional
    public PhotoDto getPhoto(String id) {
        Image image = imageRepository.findById(id)
                .orElseGet(() -> persistOne(imageProvider.fetchPhoto(id)));
        return PhotoDto.from(image);
    }

    @Transactional(readOnly = true)
    public Image requireStoredPhoto(String id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Photograph was not found."));
    }

    private List<PhotoDto> persist(List<ImageProvider.ProvidedPhoto> photos) {
        List<String> ids = photos.stream().map(ImageProvider.ProvidedPhoto::id).toList();
        Map<String, Image> existing = new HashMap<>();
        imageRepository.findAllById(ids).forEach(image -> existing.put(image.getId(), image));

        List<Image> images = new ArrayList<>();
        for (ImageProvider.ProvidedPhoto photo : photos) {
            Image image = existing.get(photo.id());
            if (image == null) {
                image = new Image(
                        photo.id(),
                        photo.title(),
                        photo.photographer(),
                        photo.photographerUrl(),
                        photo.category(),
                        photo.imageUrl(),
                        photo.downloadLocation(),
                        photo.width(),
                        photo.height());
            } else {
                image.update(
                        photo.title(),
                        photo.photographer(),
                        photo.photographerUrl(),
                        photo.category(),
                        photo.imageUrl(),
                        photo.downloadLocation(),
                        photo.width(),
                        photo.height());
            }
            images.add(image);
        }
        return imageRepository.saveAll(images).stream().map(PhotoDto::from).toList();
    }

    private Image persistOne(ImageProvider.ProvidedPhoto photo) {
        if (photo == null) {
            throw new ResourceNotFoundException("Photograph was not found.");
        }
        return imageRepository.save(new Image(
                photo.id(),
                photo.title(),
                photo.photographer(),
                photo.photographerUrl(),
                photo.category(),
                photo.imageUrl(),
                photo.downloadLocation(),
                photo.width(),
                photo.height()));
    }
}
