package dev.amitwani.githubwrapped.dto.graphql;

import dev.amitwani.githubwrapped.model.GitHubStats;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;

@Data
public class GitHubContributionStats {

    private DataNode data;

    @Data
    public static class ContributionsCollection {
        private int commits;
        private int issuesClosed;
        private int pullRequestsClosed;
        private GitHubStats.ContributionCalendar contributionCalendar;
    }

    @Data
    public static class DataNode {
        private User user;
    }

    @Data
    public static class User {
        private ContributionsCollection contributionsCollection;
    }

}
