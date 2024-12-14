package dev.amitwani.githubwrapped.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Document("stats")
public class GitHubStats {
    @Id
    private String id;
    private String username;
    private String userId;
    private long totalCommits;
    private long totalIssuesClosed;
    private long totalPullRequestsClosed;
    private long totalStars;
    private long totalForks;
    private Repository topRepository;
    private List<LanguageStats> languagesStats = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LanguageStats {
        private String language;
        private String color;
        private long linesCount;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Repository {
        private String name;
        private String topLanguage;
        private String topLanguageColor;
        private long stars;
        private long forks;
    }

}
