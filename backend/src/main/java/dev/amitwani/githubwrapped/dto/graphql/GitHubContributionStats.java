package dev.amitwani.githubwrapped.dto.graphql;

import lombok.Data;

import java.util.List;

@Data
public class GitHubContributionStats {

    private DataNode data;

    @Data
    public static class DataNode {
        private UserNode user;
    }

    @Data
    public static class UserNode {
        private RepositoryConnection repositories;
    }

    @Data
    public static class RepositoryConnection {
        private List<RepositoryEdge> edges;
        private PageInfo pageInfo;
    }

    @Data
    public static class RepositoryEdge {
        private RepositoryNode node;
    }

    @Data
    public static class RepositoryNode {
        private String name;
        private int stars;
        private int forkCount;
        private PrimaryLanguage primaryLanguage;
        private CommitsNode commits;
        private LanguageRootNode languages;
        private IssuesNode issues;
        private PullRequestsNode pullRequests;
    }

    @Data
    public static class PrimaryLanguage {
        private String name;
        private String color;
    }

    @Data
    public static class LanguageRootNode {
        private List<LanguageEdge> edges;
    }

    @Data
    public static class LanguageEdge {
        private LanguageNode node;
        private int size;
    }

    @Data
    public static class PageInfo {
        private boolean hasNextPage;
        private String endCursor;
    }

    @Data
    public static class CommitsNode {
        private TargetNode target;
    }

    @Data
    public static class TargetNode {
        private HistoryNode history;
    }

    @Data
    public static class HistoryNode {
        private int totalCount;
    }

    @Data
    public static class LanguageNode {
        private String name;
        private String color;
    }

    @Data
    public static class IssuesNode {
        private int totalCount;
    }

    @Data
    public static class PullRequestsNode {
        private int totalCount;
    }
}
