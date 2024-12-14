package dev.amitwani.githubwrapped.dto.graphql;

import lombok.Data;

import java.util.List;

@Data
public class GitHubPinnedItems {

    private DataNode data;

    @Data
    public static class DataNode {
        private UserNode user;
    }

    @Data
    public static class UserNode {
        private PinnedItems pinnedItems;
    }

    @Data
    public static class PinnedItems {
        private List<Edge> edges;
    }

    @Data
    public static class Edge {
        private Node node;
    }

    @Data
    public static class Node {
        private String name;
        private String description;
        private String url;
        private int stars;
        private int forkCount;
        private PrimaryLanguage primaryLanguage;
    }

    @Data
    public static class PrimaryLanguage {
        private String name;
        private String color;
    }
}
