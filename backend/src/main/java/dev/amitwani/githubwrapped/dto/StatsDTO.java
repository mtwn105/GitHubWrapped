package dev.amitwani.githubwrapped.dto;

import dev.amitwani.githubwrapped.model.GitHubStats;
import dev.amitwani.githubwrapped.model.GitHubUser;
import dev.amitwani.githubwrapped.repository.GitHubUserRepository;
import lombok.Data;
import org.kohsuke.github.GitHub;

@Data
public class StatsDTO {
    private String username;
    private GitHubUser user;
    private GitHubStats stats;
}
