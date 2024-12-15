package dev.amitwani.githubwrapped.dto;

import dev.amitwani.githubwrapped.model.GitHubStats;
import dev.amitwani.githubwrapped.model.GitHubUser;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class StatsDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String username;
    private GitHubUser user;
    private GitHubStats stats;
}
