package dev.amitwani.githubwrapped.repository;

import dev.amitwani.githubwrapped.dto.AllUserDTO;
import dev.amitwani.githubwrapped.dto.TopUserDTO;
import dev.amitwani.githubwrapped.model.GitHubUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GitHubUserRepository extends MongoRepository<GitHubUser, String> {

    List<GitHubUser> findByUsername(String username);
    @Query(value = "{}", fields = "{ 'username' : 1, '_id' : 0 }")
    List<AllUserDTO> findAllUsername();
}
