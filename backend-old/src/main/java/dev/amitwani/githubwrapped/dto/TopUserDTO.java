package dev.amitwani.githubwrapped.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class TopUserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String username;
    private String name;
    private String avatarUrl;
    private long totalContributions;
    private long totalCommits;
    private long totalIssuesClosed;
    private long totalPullRequestsClosed;
    private long totalStars;
    private long totalForks;
}
