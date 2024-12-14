package dev.amitwani.githubwrapped.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("stats")
public class GitHubStats {
    @Id
    private String id;
    private String username;
    private String userId;
}
