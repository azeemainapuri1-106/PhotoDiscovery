package com.photodiscovery.controller;

import com.photodiscovery.service.CurrentUserService;
import com.photodiscovery.service.FavouriteService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {
    private final FavouriteService favouriteService;
    private final CurrentUserService currentUserService;

    public FavouriteController(FavouriteService favouriteService, CurrentUserService currentUserService) {
        this.favouriteService = favouriteService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<String> getFavourites(@AuthenticationPrincipal Jwt jwt) {
        return favouriteService.getFavouriteIds(currentUserService.requireUser(jwt).getId());
    }

    @PostMapping("/{photoId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addFavourite(@PathVariable String photoId, @AuthenticationPrincipal Jwt jwt) {
        favouriteService.addFavourite(currentUserService.requireUser(jwt).getId(), photoId);
    }

    @DeleteMapping("/{photoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavourite(@PathVariable String photoId, @AuthenticationPrincipal Jwt jwt) {
        favouriteService.removeFavourite(currentUserService.requireUser(jwt).getId(), photoId);
    }
}
