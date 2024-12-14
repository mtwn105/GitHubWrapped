package dev.amitwani.githubwrapped.controller;

import dev.amitwani.githubwrapped.dto.ResponseDTO;
import dev.amitwani.githubwrapped.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/{username}")
    public String getStats() {
        return "Stats";
    }

    @PostMapping("/{username}")
    public ResponseEntity<ResponseDTO> generateGitHubStats(@PathVariable String username) {
        CompletableFuture.runAsync(() -> statsService.generateGitHubStats(username));
        return ResponseEntity.ok(new ResponseDTO("Started processing stats...", null));
    }


}
