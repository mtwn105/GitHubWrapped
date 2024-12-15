package dev.amitwani.githubwrapped.repository;

import dev.amitwani.githubwrapped.model.GitHubStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GitHubStatsRepository extends MongoRepository<GitHubStats, String> {
    GitHubStats findByUsername(String username);

    // Find top 6 users by commits
    @Query(value = "{'totalCommits': {'$gt': 0}}", sort = "{'totalCommits': -1}")
    List<GitHubStats> findTop6By();

}
