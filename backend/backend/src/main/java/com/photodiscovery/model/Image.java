package com.photodiscovery.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "images", uniqueConstraints = @UniqueConstraint(
        name = "uk_images_source_external_id", columnNames = {"source", "external_id"}))
public class Image {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 32)
    private String source;

    @Column(name = "external_id", nullable = false, length = 64)
    private String externalId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 200)
    private String photographer;

    @Column(name = "photographer_url", length = 500)
    private String photographerUrl;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "download_location", length = 1000)
    private String downloadLocation;

    @Column(nullable = false)
    private int width;

    @Column(nullable = false)
    private int height;

    protected Image() {
    }

    public Image(
            String id,
            String title,
            String photographer,
            String photographerUrl,
            String category,
            String imageUrl,
            String downloadLocation,
            int width,
            int height) {
        this.id = id;
        this.source = "UNSPLASH";
        this.externalId = id;
        update(title, photographer, photographerUrl, category, imageUrl, downloadLocation, width, height);
    }

    public void update(
            String title,
            String photographer,
            String photographerUrl,
            String category,
            String imageUrl,
            String downloadLocation,
            int width,
            int height) {
        this.title = title;
        this.photographer = photographer;
        this.photographerUrl = photographerUrl;
        this.category = category;
        this.imageUrl = imageUrl;
        this.downloadLocation = downloadLocation;
        this.width = width;
        this.height = height;
    }

    public String getId() {
        return id;
    }

    public String getSource() {
        return source;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getTitle() {
        return title;
    }

    public String getPhotographer() {
        return photographer;
    }

    public String getPhotographerUrl() {
        return photographerUrl;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDownloadLocation() {
        return downloadLocation;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public String getRatio() {
        return height > width ? "portrait" : "landscape";
    }
}
