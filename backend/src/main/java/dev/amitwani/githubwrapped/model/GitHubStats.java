package dev.amitwani.githubwrapped.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document("stats")
public class GitHubStats implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
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
    private ContributionCalendar contributionCalendar;
    @CreatedDate
    private Date createdDate;

    @Data
    public static class ContributionCalendar implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private int totalContributions;
        private ArrayList<Week> weeks;
    }


    @Data
    public static class Week implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private ArrayList<ContributionDay> contributionDays;
    }

    @Data
    public static class ContributionDay implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private int weekday;
        private Date date;
        private int contributionCount;
        private String color;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LanguageStats implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private String language;
        private String color;
        private long linesCount;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Repository implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private String name;
        private String topLanguage;
        private String topLanguageColor;
        private long stars;
        private long forks;
    }

}
