package dev.amitwani.githubwrapped.controller;

import dev.amitwani.githubwrapped.dto.ResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.availability.ApplicationAvailability;
import org.springframework.boot.availability.LivenessState;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HealthController.class);


    @Autowired
    ApplicationAvailability applicationAvailability;

    @GetMapping
    public ResponseEntity<ResponseDTO> healthCheck() {
        if (applicationAvailability.getLivenessState().equals(LivenessState.CORRECT)) {
            return ResponseEntity.ok(new ResponseDTO("OK", null));
        } else {
            LOGGER.error("Health check failed {}", applicationAvailability.getLivenessState());
            return ResponseEntity.status(500).body(new ResponseDTO("NOT OK", null));
        }
    }


}
