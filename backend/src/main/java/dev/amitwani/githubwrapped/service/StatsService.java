package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.graphql.GitHubContributionStats;
import dev.amitwani.githubwrapped.dto.graphql.GitHubPinnedItems;
import dev.amitwani.githubwrapped.model.GitHubStats;
import dev.amitwani.githubwrapped.model.GitHubUser;
import dev.amitwani.githubwrapped.repository.GitHubStatsRepository;
import dev.amitwani.githubwrapped.repository.GitHubUserRepository;
import org.kohsuke.github.GHUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StatsService.class);

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private GitHubUserRepository gitHubUserRepository;

    @Autowired
    private GitHubStatsRepository gitHubStatsRepository;

    public void generateGitHubStats(String username) {
        try {

            if (gitHubUserRepository.existsByUsername(username)) {
                throw new RuntimeException("User " + username + " stats already exists");
            }
            // Fetch User Data from GitHub
            GHUser user = gitHubService.getGitHubUser(username);
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

            // Generate Stats
            GitHubStats gitHubStats = new GitHubStats();
            gitHubStats.setUsername(username);

            List<GitHubContributionStats.RepositoryNode> repositoryNodes = gitHubService.getContributionStats(username);

            // Total Commits
            long totalCommits = repositoryNodes.stream().filter(node -> node.getCommits() != null).mapToLong(node -> node.getCommits().getTarget().getHistory().getTotalCount()).sum();

            // Total Issues
            long totalIssuesClosed = repositoryNodes.stream().mapToLong(node -> node.getIssues().getTotalCount()).sum();

            // Total Pull Requests
            long totalPullRequestsClosed = repositoryNodes.stream().mapToLong(node -> node.getPullRequests().getTotalCount()).sum();

            // Languagges
            List<GitHubContributionStats.LanguageEdge> languageEdges = repositoryNodes
                    .stream()
                    .flatMap(node -> node.getLanguages().getEdges()
                            .stream()
                            .toList()
                            .stream())
                    .toList();


            Map<String, GitHubStats.LanguageStats> languageStatsMap = new HashMap<>();

            languageEdges.forEach(edge -> {
                if (languageStatsMap.containsKey(edge.getNode().getName())) {
                    GitHubStats.LanguageStats languageStats = languageStatsMap.get(edge.getNode().getName());
                    languageStats.setLinesCount(languageStats.getLinesCount() + edge.getSize());
                    return;
                }
                GitHubStats.LanguageStats languageStats = new GitHubStats.LanguageStats();
                languageStats.setLanguage(edge.getNode().getName());
                languageStats.setColor(edge.getNode().getColor());
                languageStats.setLinesCount(edge.getSize());
                languageStatsMap.put(edge.getNode().getName(), languageStats);
            });

            List<GitHubStats.LanguageStats> languageStats = languageStatsMap.values().stream()
                    .sorted(Comparator.comparing(GitHubStats.LanguageStats::getLinesCount).reversed())
                    .toList();

            gitHubStats.setLanguagesStats(languageStats);
            gitHubStats.setTotalCommits(totalCommits);
            gitHubStats.setTotalIssuesClosed(totalIssuesClosed);
            gitHubStats.setTotalPullRequestsClosed(totalPullRequestsClosed);

            // Top Repository
            GitHubStats.Repository topRepository = new GitHubStats.Repository();

            GitHubContributionStats.RepositoryNode topRepositoryNode = repositoryNodes.stream()
                            .max(Comparator.comparing(GitHubContributionStats.RepositoryNode::getStars))
                            .orElse(null);

            if (topRepositoryNode != null) {
                topRepository.setName(topRepositoryNode.getName());
                topRepository.setTopLanguage(topRepositoryNode.getPrimaryLanguage().getName());
                topRepository.setTopLanguageColor(topRepositoryNode.getPrimaryLanguage().getColor());
                topRepository.setStars(topRepositoryNode.getStars());
                topRepository.setForks(topRepositoryNode.getForkCount());
                gitHubStats.setTopRepository(topRepository);
            }

            // Save User Data
            gitHubUser.setCreatedDate(new Date());
            gitHubUser = gitHubUserRepository.save(gitHubUser);

            // Save Stats
            gitHubStats.setUserId(gitHubUser.getId());
            gitHubStats = gitHubStatsRepository.save(gitHubStats);

            LOGGER.info("Generated stats for user: {}", gitHubStats);


        } catch (Exception e) {
            LOGGER.error("Error generating stats for user: {}", username, e);
        }
    }
}
