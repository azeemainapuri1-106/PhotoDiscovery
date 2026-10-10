package com.photodiscovery.dto;

import com.photodiscovery.model.Image;

public record PhotoDto(
        String id,
        String title,
        String photographer,
        String photographerUrl,
        String category,
        String image,
        String imageUrl,
        int width,
        int height,
        String ratio) {
    public static PhotoDto from(Image image) {
        return new PhotoDto(
                image.getId(),
                image.getTitle(),
                image.getPhotographer(),
                image.getPhotographerUrl(),
                image.getCategory(),
                image.getImageUrl(),
                image.getImageUrl(),
                image.getWidth(),
                image.getHeight(),
                image.getRatio());
    }
}
