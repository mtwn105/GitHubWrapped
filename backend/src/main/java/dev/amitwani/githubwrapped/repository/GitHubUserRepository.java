package dev.amitwani.githubwrapped.repository;

import dev.amitwani.githubwrapped.model.GitHubUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GitHubUserRepository extends MongoRepository<GitHubUser, String> {

    GitHubUser findByUsername(String username);
    boolean existsByUsername(String username);
}
