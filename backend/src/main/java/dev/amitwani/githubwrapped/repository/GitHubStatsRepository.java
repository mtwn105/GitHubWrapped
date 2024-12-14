package dev.amitwani.githubwrapped.repository;

import dev.amitwani.githubwrapped.model.GitHubStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GitHubStatsRepository extends MongoRepository<GitHubStats, String> {
    GitHubStats findByUsername(String username);
}
