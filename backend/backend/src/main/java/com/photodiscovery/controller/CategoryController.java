package com.photodiscovery.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private static final List<String> CATEGORIES = List.of(
            "Nature", "Interiors", "Architecture", "Travel", "Still life", "Art & design");

    @GetMapping
    public List<String> getCategories() {
        return CATEGORIES;
    }
}
