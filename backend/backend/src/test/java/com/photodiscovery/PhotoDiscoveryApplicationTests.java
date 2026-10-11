package com.photodiscovery;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.photodiscovery.model.Image;
import com.photodiscovery.repository.ImageRepository;
import com.photodiscovery.repository.UserRepository;
import com.photodiscovery.service.ImageProvider;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
class PhotoDiscoveryApplicationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private ImageProvider imageProvider;

    @MockitoBean(name = "googleJwtDecoder")
    private JwtDecoder googleJwtDecoder;

    @Test
    void contextLoads() {
    }

    @Test
    void registerLoginAndAuthenticatedAccountEndpointsWork() throws Exception {
        String email = UUID.randomUUID() + "@example.com";
        String registerBody = objectMapper.writeValueAsString(
                java.util.Map.of("name", "Test Person", "email", email, "password", "correct-horse-42"));

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(email))
                .andReturn();

        JsonNode registerResponse = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String token = registerResponse.path("token").asText();
        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
        mockMvc.perform(get("/api/downloads/quota").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downloadsUsed").value(0))
                .andExpect(jsonPath("$.downloadsLeft").value(3));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("email", email, "password", "correct-horse-42"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("email", email, "password", "incorrect-password"))))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isConflict());
    }

    @Test
    void protectedEndpointsRejectAnonymousRequestsWithStructuredError() throws Exception {
        mockMvc.perform(get("/api/downloads/quota"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value(
                        "Authentication is required or the access token is invalid."));
    }

    @Test
    void photoFeedUsesZeroBasedPageAndCamelCasePageSize() throws Exception {
        String photoId = "feed-" + UUID.randomUUID();
        when(imageProvider.fetchPhotos(null, null, 1, 20))
                .thenReturn(List.of(new ImageProvider.ProvidedPhoto(
                        photoId,
                        "Feed photo",
                        "Photographer",
                        null,
                        "Nature",
                        "https://images.unsplash.com/feed.jpg",
                        "https://api.unsplash.com/photos/feed/download",
                        1200,
                        1800)));
        when(imageProvider.fetchPhotos("forest", null, 1, 20)).thenReturn(List.of());

        mockMvc.perform(get("/api/photos?page=0&perPage=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(photoId));

        mockMvc.perform(get("/api/photos/search?q=%20forest%20&page=0"))
                .andExpect(status().isOk());
    }

    @Test
    void googleSignInLinksVerifiedEmailToExistingAccountAndKeepsItsQuota() throws Exception {
        String email = UUID.randomUUID() + "@example.com";
        JsonNode registered = objectMapper.readTree(mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "name", "Existing Account",
                                "email", email,
                                "password", "correct-horse-42"))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        String googleSubject = "google-" + UUID.randomUUID();
        Instant issuedAt = Instant.now();
        when(googleJwtDecoder.decode("mock-google-id-token"))
                .thenReturn(Jwt.withTokenValue("mock-google-id-token")
                        .header("alg", "RS256")
                        .issuer("https://accounts.google.com")
                        .subject(googleSubject)
                        .audience(List.of("test-google-client-id"))
                        .claim("email", email)
                        .claim("email_verified", true)
                        .claim("name", "Google Display Name")
                        .issuedAt(issuedAt)
                        .expiresAt(issuedAt.plusSeconds(300))
                        .build());

        JsonNode googleResponse = objectMapper.readTree(mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("idToken", "mock-google-id-token"))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        org.junit.jupiter.api.Assertions.assertEquals(
                registered.path("user").path("id").asLong(),
                googleResponse.path("user").path("id").asLong());
        mockMvc.perform(get("/api/downloads/quota")
                        .header("Authorization", "Bearer " + googleResponse.path("token").asText()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downloadsLeft").value(3));
        org.junit.jupiter.api.Assertions.assertEquals(
                com.photodiscovery.model.AuthProvider.GOOGLE,
                userRepository.findByEmailIgnoreCase(email).orElseThrow().getAuthProvider());
    }

    @Test
    void googleVerificationFailureReturnsGoogleSpecificError() throws Exception {
        when(googleJwtDecoder.decode("invalid-google-id-token"))
                .thenThrow(new JwtException("Invalid audience"));

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("idToken", "invalid-google-id-token"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(
                        "Google authentication failed. Please try again."));
    }

    @Test
    void repeatedPhotoRefreshesUpdateOneCachedImageRecord() throws Exception {
        String imageId = "cache-" + UUID.randomUUID();
        ImageProvider.ProvidedPhoto first = new ImageProvider.ProvidedPhoto(
                imageId, "First title", "Photographer", null, "Nature",
                "https://images.unsplash.com/cache.jpg", "https://api.unsplash.com/photos/cache/download", 800, 1200);
        ImageProvider.ProvidedPhoto updated = new ImageProvider.ProvidedPhoto(
                imageId, "Updated title", "Photographer", null, "Nature",
                "https://images.unsplash.com/cache-updated.jpg",
                "https://api.unsplash.com/photos/cache/download", 800, 1200);
        when(imageProvider.fetchPhotos(null, null, 1, 20)).thenReturn(List.of(first), List.of(updated));

        mockMvc.perform(get("/api/photos?page=0&perPage=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("First title"));
        mockMvc.perform(get("/api/photos?page=0&perPage=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Updated title"));

        org.junit.jupiter.api.Assertions.assertEquals(
                1, imageRepository.countBySourceAndExternalId("UNSPLASH", imageId));
        org.junit.jupiter.api.Assertions.assertEquals(
                imageId, imageRepository.findBySourceAndExternalId("UNSPLASH", imageId).orElseThrow().getId());
    }

    @Test
    void thirdDownloadLocksAccountAndFurtherRequestReturnsUnlockTimestamp() throws Exception {
        String email = UUID.randomUUID() + "@example.com";
        String token = register(email);
        String imageId = "photo-" + UUID.randomUUID();
        imageRepository.saveAndFlush(new Image(
                imageId,
                "Test photo",
                "Test photographer",
                "https://unsplash.com/@test",
                "Nature",
                "https://images.unsplash.com/test.jpg",
                "https://api.unsplash.com/photos/" + imageId + "/download",
                1200,
                1800));
        when(imageProvider.triggerDownload("https://api.unsplash.com/photos/" + imageId + "/download"))
                .thenReturn("https://images.unsplash.com/download.jpg");

        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/photos/" + imageId + "/download")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/downloads/quota").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downloadsUsed").value(3))
                .andExpect(jsonPath("$.downloadsLeft").value(0))
                .andExpect(jsonPath("$.lockedUntil").isNotEmpty());

        mockMvc.perform(post("/api/photos/" + imageId + "/download")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.locked_until").isNotEmpty());
    }

    private String register(String email) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "name", "Quota Test",
                                "email", email,
                                "password", "correct-horse-42"))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString())
                .path("token")
                .asText();
    }
}
