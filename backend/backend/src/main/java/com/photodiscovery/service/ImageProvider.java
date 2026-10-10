package com.photodiscovery.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.photodiscovery.config.UnsplashProperties;
import com.photodiscovery.exception.ResourceNotFoundException;
import com.photodiscovery.exception.UpstreamApiException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Service
public class ImageProvider {
    private final RestClient restClient;
    private final String accessKey;

    public ImageProvider(RestClient restClient, UnsplashProperties properties) {
        this.restClient = restClient;
        this.accessKey = properties.accessKey();
    }

    public List<ProvidedPhoto> fetchPhotos(String query, String category, int page, int perPage) {
        requireConfigured();
        try {
            JsonNode response;
            if ((query == null || query.isBlank()) && (category == null || category.isBlank())) {
                response = restClient.get()
                        .uri(uriBuilder -> uriBuilder.path("/photos/random")
                                .queryParam("count", perPage)
                                .build())
                        .retrieve()
                        .body(JsonNode.class);
            } else {
                String searchQuery = String.join(" ", List.of(
                        query == null ? "" : query.trim(),
                        category == null ? "" : category.trim())).trim();
                response = restClient.get()
                        .uri(uriBuilder -> uriBuilder.path("/search/photos")
                                .queryParam("query", searchQuery)
                                .queryParam("page", page)
                                .queryParam("per_page", perPage)
                                .build())
                        .retrieve()
                        .body(JsonNode.class);
                response = response == null ? null : response.path("results");
            }
            return readPhotos(response, category);
        } catch (RestClientException exception) {
            throw new UpstreamApiException("The photo provider could not complete the request.", exception);
        }
    }

    public ProvidedPhoto fetchPhoto(String id) {
        requireConfigured();
        try {
            JsonNode photo = restClient.get()
                    .uri("/photos/{id}", id)
                    .retrieve()
                    .body(JsonNode.class);
            return toPhoto(photo, null);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 404) {
                throw new ResourceNotFoundException("Photograph was not found.");
            }
            throw new UpstreamApiException("The photo provider could not load this photograph.", exception);
        } catch (RestClientException exception) {
            throw new UpstreamApiException("The photo provider could not load this photograph.", exception);
        }
    }

    public String triggerDownload(String downloadLocation) {
        requireConfigured();
        if (downloadLocation == null || downloadLocation.isBlank()) {
            throw new UpstreamApiException("The photo provider did not return a download location.");
        }
        try {
            URI uri = URI.create(downloadLocation);
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || !"api.unsplash.com".equalsIgnoreCase(uri.getHost())
                    || (uri.getPort() != -1 && uri.getPort() != 443)
                    || uri.getPath() == null
                    || !uri.getPath().startsWith("/photos/")) {
                throw new UpstreamApiException("The photo provider returned an invalid download location.");
            }
            JsonNode response = restClient.get().uri(uri).retrieve().body(JsonNode.class);
            String downloadUrl = response == null ? null : response.path("url").asText(null);
            if (downloadUrl == null || downloadUrl.isBlank()) {
                throw new UpstreamApiException("The photo provider did not return a download URL.");
            }
            return downloadUrl;
        } catch (RestClientException exception) {
            throw new UpstreamApiException("The photo provider could not prepare this download.", exception);
        }
    }

    private List<ProvidedPhoto> readPhotos(JsonNode response, String category) {
        if (response == null || !response.isArray()) {
            throw new UpstreamApiException("The photo provider returned an invalid response.");
        }
        List<ProvidedPhoto> photos = new ArrayList<>();
        for (JsonNode photo : response) {
            ProvidedPhoto providedPhoto = toPhoto(photo, category);
            if (providedPhoto != null) {
                photos.add(providedPhoto);
            }
        }
        return photos;
    }

    private ProvidedPhoto toPhoto(JsonNode photo, String requestedCategory) {
        if (photo == null || photo.isMissingNode()) {
            return null;
        }
        String id = text(photo, "id");
        String imageUrl = text(photo.path("urls"), "regular");
        if (id == null || imageUrl == null) {
            return null;
        }
        JsonNode user = photo.path("user");
        String photographer = text(user, "name");
        String photographerLink = text(user.path("links"), "html");
        String description = firstNonBlank(text(photo, "alt_description"), text(photo, "description"), "Untitled photograph");
        String category = firstNonBlank(requestedCategory, "For you");
        return new ProvidedPhoto(
                id,
                description,
                firstNonBlank(photographer, "Unknown photographer"),
                photographerLink,
                category,
                imageUrl,
                text(photo.path("links"), "download_location"),
                photo.path("width").asInt(0),
                photo.path("height").asInt(0));
    }

    private String text(JsonNode node, String field) {
        String value = node.path(field).asText(null);
        return value == null || value.isBlank() ? null : value;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private void requireConfigured() {
        if (accessKey == null || accessKey.isBlank()) {
            throw new UpstreamApiException("The photo provider is not configured on this server.");
        }
    }

    public record ProvidedPhoto(
            String id,
            String title,
            String photographer,
            String photographerUrl,
            String category,
            String imageUrl,
            String downloadLocation,
            int width,
            int height) {
    }
}
