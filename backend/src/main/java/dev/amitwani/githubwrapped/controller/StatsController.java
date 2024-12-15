package dev.amitwani.githubwrapped.controller;

import dev.amitwani.githubwrapped.dto.ResponseDTO;
import dev.amitwani.githubwrapped.dto.StatsDTO;
import dev.amitwani.githubwrapped.service.StatsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StatsController.class);

    @Autowired
    private StatsService statsService;

    @GetMapping("/{username}")
    public ResponseEntity<ResponseDTO> getStats(@PathVariable String username) {
        LOGGER.info("Received request to fetch stats for user: {}", username);
        StatsDTO statsDTO = statsService.getStats(username);
        if (statsDTO == null) {
            return ResponseEntity.status(404).body(new ResponseDTO("User stats not found", null));
        }
        return ResponseEntity.ok(new ResponseDTO("Stats fetched successfully", statsDTO));
    }

    @PostMapping("/{username}")
    public ResponseEntity<ResponseDTO> generateGitHubStats(@PathVariable String username) {
        LOGGER.info("Received request to generate stats for user: {}", username);
        return statsService.generateGitHubStats(username);
    }


}
