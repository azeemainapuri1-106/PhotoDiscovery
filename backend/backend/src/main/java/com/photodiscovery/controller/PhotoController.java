package com.photodiscovery.controller;

import com.photodiscovery.dto.DownloadResponse;
import com.photodiscovery.dto.PhotoDto;
import com.photodiscovery.service.CurrentUserService;
import com.photodiscovery.service.DownloadService;
import com.photodiscovery.service.PhotoService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    private final PhotoService photoService;
    private final DownloadService downloadService;
    private final CurrentUserService currentUserService;

    public PhotoController(
            PhotoService photoService,
            DownloadService downloadService,
            CurrentUserService currentUserService) {
        this.photoService = photoService;
        this.downloadService = downloadService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<PhotoDto> getPhotos(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(name = "per_page", defaultValue = "30") @Min(1) @Max(30) int perPage) {
        return photoService.getPhotos(q, category, page, perPage);
    }

    @GetMapping("/{id}")
    public PhotoDto getPhoto(@PathVariable String id) {
        return photoService.getPhoto(id);
    }

    @PostMapping("/{id}/download")
    public DownloadResponse download(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = currentUserService.requireUser(jwt).getId();
        return downloadService.download(id, userId);
    }
}
