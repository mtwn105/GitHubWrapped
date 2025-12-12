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
@Document("user")
public class GitHubUser implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;
    private String username;
    private String name;
    private String bio;
    private String email;
    private String company;
    private String location;
    private String avatarUrl;
    private String blogUrl;
    private String twitterUsername;
    private int followers;
    private int following;
    private int publicRepos;
    private List<PinnedRepositories> pinnedRepositories = new ArrayList<>();
    @CreatedDate
    private Date createdDate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PinnedRepositories implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;
        private String name;
        private String description;
        private String url;
        private int stars;
        private int forkCount;
        private String topLanguage;
        private String topLanguageColor;
    }

}
