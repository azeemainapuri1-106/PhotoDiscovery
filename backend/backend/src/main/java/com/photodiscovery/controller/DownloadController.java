package com.photodiscovery.controller;

import com.photodiscovery.dto.DownloadHistoryDto;
import com.photodiscovery.dto.QuotaDto;
import com.photodiscovery.service.CurrentUserService;
import com.photodiscovery.service.DownloadService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/downloads")
public class DownloadController {
    private final DownloadService downloadService;
    private final CurrentUserService currentUserService;

    public DownloadController(DownloadService downloadService, CurrentUserService currentUserService) {
        this.downloadService = downloadService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/quota")
    public QuotaDto getQuota(@AuthenticationPrincipal Jwt jwt) {
        return downloadService.getQuota(currentUserService.requireUser(jwt).getId());
    }

    @GetMapping("/history")
    public List<DownloadHistoryDto> getHistory(@AuthenticationPrincipal Jwt jwt) {
        return downloadService.getHistory(currentUserService.requireUser(jwt).getId());
    }
}
