package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.graphql.GitHubPinnedItems;
import dev.amitwani.githubwrapped.model.GitHubUser;
import dev.amitwani.githubwrapped.repository.GitHubUserRepository;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GHUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class StatsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StatsService.class);

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private GitHubUserRepository gitHubUserRepository;

    public void generateGitHubStats(String username) {
        try {
            // Fetch User Data from GitHub
            Instant startTime = Instant.now();

            GHUser user = gitHubService.getGitHubUser(username);

            Instant endTime = Instant.now();
            LOGGER.info("Time taken to fetch user data: {}", endTime.toEpochMilli() - startTime.toEpochMilli());
            LOGGER.info("Fetched user data for user: {}", user);

            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Process User Data
            GitHubUser gitHubUser = new GitHubUser();
            gitHubUser.setBio(user.getBio());
            gitHubUser.setCompany(user.getCompany());
            gitHubUser.setEmail(user.getEmail());
            gitHubUser.setAvatarUrl(user.getAvatarUrl());
            gitHubUser.setBlogUrl(user.getBlog());
            gitHubUser.setFollowers(user.getFollowersCount());
            gitHubUser.setFollowing(user.getFollowingCount());
            gitHubUser.setPublicRepos(user.getPublicRepoCount());
            gitHubUser.setName(user.getName());
            gitHubUser.setTwitterUsername(user.getTwitterUsername());
            gitHubUser.setUsername(user.getLogin());

            // Save User Data
            gitHubUser.setCreatedDate(new Date());
            gitHubUser = gitHubUserRepository.save(gitHubUser);
            LOGGER.info("Saved user data for user: {}", gitHubUser);

            // Get User Pinned Repos
            GitHubPinnedItems pinnedRepos = gitHubService.getPinnedRepos(username);
            LOGGER.info("Fetched pinned repos for user: {}", pinnedRepos);

            // Save Pinned Repos
            List<GitHubPinnedItems.Node> pinnedRepoNodes = pinnedRepos.getData().getUser().getPinnedItems().getEdges().stream().map(edge -> edge.getNode()).toList();

            for (GitHubPinnedItems.Node node : pinnedRepoNodes) {
                gitHubUser.getPinnedRepositories().add(new GitHubUser.PinnedRepositories(
                        node.getName(),
                        node.getDescription(),
                        node.getUrl(),
                        node.getStars(),
                        node.getForkCount(),
                        node.getPrimaryLanguage().getName(),
                        node.getPrimaryLanguage().getColor()
                ));
            }

            gitHubUser = gitHubUserRepository.save(gitHubUser);

        } catch (Exception e) {
            LOGGER.error("Error generating stats for user: {}", username, e);
        }
    }
}
