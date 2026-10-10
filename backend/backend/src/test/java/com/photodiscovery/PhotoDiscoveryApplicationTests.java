package com.photodiscovery;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.photodiscovery.model.Image;
import com.photodiscovery.repository.ImageRepository;
import com.photodiscovery.service.ImageProvider;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

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

    @MockitoBean
    private ImageProvider imageProvider;

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
