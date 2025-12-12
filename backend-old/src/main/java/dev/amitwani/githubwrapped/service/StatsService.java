package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.*;
import dev.amitwani.githubwrapped.dto.graphql.*;
import dev.amitwani.githubwrapped.model.*;
import dev.amitwani.githubwrapped.repository.*;
import org.kohsuke.github.GHUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StatsService.class);

    private final GitHubService gitHubService;
    private final GitHubUserRepository gitHubUserRepository;
    private final GitHubStatsRepository gitHubStatsRepository;

    @Autowired
    public StatsService(GitHubService gitHubService, GitHubUserRepository gitHubUserRepository, GitHubStatsRepository gitHubStatsRepository) {
        this.gitHubService = gitHubService;
        this.gitHubUserRepository = gitHubUserRepository;
        this.gitHubStatsRepository = gitHubStatsRepository;
    }

    public ResponseEntity<ResponseDTO> generateGitHubStats(String username) {
        try {
            StatsDTO statsDTO = getStats(username.toLowerCase());
            if (statsDTO != null) {
                LOGGER.info("User {} stats already exists", username);
                return ResponseEntity.ok(new ResponseDTO("User stats already exists", statsDTO));
            }

            GHUser user = fetchGitHubUser(username);
            if (user == null) {
                return ResponseEntity.status(404).body(new ResponseDTO("No user data found", null));
            }

            GitHubUser gitHubUser = processGitHubUser(user, username);
            GitHubStats gitHubStats = generateStats(username, gitHubUser);

            statsDTO = new StatsDTO();
            statsDTO.setStats(gitHubStats);
            statsDTO.setUser(gitHubUser);
            statsDTO.setUsername(username.toLowerCase());

            return ResponseEntity.status(201).body(new ResponseDTO("Stats generated successfully", statsDTO));
        } catch (Exception e) {
            LOGGER.error("Error generating stats for user: {}", username, e);
            return ResponseEntity.internalServerError().body(new ResponseDTO("Error generating stats", null));
        }
    }

    private GHUser fetchGitHubUser(String username) {
        try {
            GHUser user = gitHubService.getGitHubUser(username.toLowerCase());
            LOGGER.info("Fetched user data for user: {}", user);
            return user;
        } catch (Exception e) {
            LOGGER.error("Failed to fetch user data for user: {}", username, e);
            return null;
        }
    }

    private GitHubUser processGitHubUser(GHUser user, String username) throws IOException {
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
        gitHubUser.setUsername(username.toLowerCase());

        GitHubPinnedItems pinnedRepos = gitHubService.getPinnedRepos(username.toLowerCase());
        LOGGER.info("Fetched pinned repos for user: {}", pinnedRepos);

        List<GitHubPinnedItems.Node> pinnedRepoNodes = pinnedRepos.getData().getUser().getPinnedItems().getEdges().stream()
                .map(GitHubPinnedItems.Edge::getNode)
                .toList();

        for (GitHubPinnedItems.Node node : pinnedRepoNodes) {
            gitHubUser.getPinnedRepositories().add(new GitHubUser.PinnedRepositories(
                    node.getName(),
                    node.getDescription(),
                    node.getUrl(),
                    node.getStars(),
                    node.getForkCount(),
                    node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getName() : null,
                    node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getColor() : null
            ));
        }

        gitHubUser.setCreatedDate(new Date());
        return gitHubUserRepository.save(gitHubUser);
    }

    private GitHubStats generateStats(String username, GitHubUser gitHubUser) {
        GitHubStats gitHubStats = new GitHubStats();
        gitHubStats.setUsername(username.toLowerCase());

        List<GitHubRepositoryStats.RepositoryNode> repositoryNodes = gitHubService.getRepositoryStats(username.toLowerCase());

        Map<String, GitHubStats.LanguageStats> languageStatsMap = repositoryNodes.stream()
                .flatMap(node -> node.getLanguages().getEdges().stream())
                .collect(Collectors.toMap(
                        edge -> edge.getNode().getName(),
                        edge -> new GitHubStats.LanguageStats(edge.getNode().getName(), edge.getNode().getColor(), edge.getSize()),
                        (existing, replacement) -> {
                            existing.setLinesCount(existing.getLinesCount() + replacement.getLinesCount());
                            return existing;
                        }
                ));

        List<GitHubStats.LanguageStats> languageStats = languageStatsMap.values().stream()
                .sorted(Comparator.comparing(GitHubStats.LanguageStats::getLinesCount).reversed())
                .collect(Collectors.toList());

        gitHubStats.setLanguagesStats(languageStats);

        GitHubContributionStats contributionStats = gitHubService.getContributionStats(username.toLowerCase());

        gitHubStats.setTotalCommits(contributionStats.getData().getUser().getContributionsCollection().getCommits());
        gitHubStats.setTotalIssuesClosed(contributionStats.getData().getUser().getContributionsCollection().getIssuesClosed());
        gitHubStats.setTotalPullRequestsClosed(contributionStats.getData().getUser().getContributionsCollection().getPullRequestsClosed());
        gitHubStats.setContributionCalendar(contributionStats.getData().getUser().getContributionsCollection().getContributionCalendar());

        GitHubStats.Repository topRepository = repositoryNodes.stream()
                .max(Comparator.comparing(GitHubRepositoryStats.RepositoryNode::getStars))
                .map(node -> new GitHubStats.Repository(
                        node.getName(),
                        node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getName() : null,
                        node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getColor() : null,
                        node.getStars(),
                        node.getForkCount()
                ))
                .orElse(null);

        gitHubStats.setTopRepository(topRepository);
        gitHubStats.setTotalStars(repositoryNodes.stream().mapToInt(GitHubRepositoryStats.RepositoryNode::getStars).sum());
        gitHubStats.setTotalForks(repositoryNodes.stream().mapToInt(GitHubRepositoryStats.RepositoryNode::getForkCount).sum());

        gitHubStats.setUserId(gitHubUser.getId());
        return gitHubStatsRepository.save(gitHubStats);
    }

    public StatsDTO getStats(String username) {
        List<GitHubUser> gitHubUserList = gitHubUserRepository.findByUsername(username.toLowerCase());
        if (gitHubUserList == null || gitHubUserList.isEmpty()) {
            LOGGER.info("User not found for username: {}", username);
            return null;
        }

        List<GitHubStats> gitHubStatsList = gitHubStatsRepository.findByUsername(username.toLowerCase());
        if (gitHubStatsList == null || gitHubStatsList.isEmpty()) {
            LOGGER.info("User stats not found for username: {}", username);
            return null;
        }

        StatsDTO statsDTO = new StatsDTO();
        statsDTO.setStats(gitHubStatsList.getFirst());
        statsDTO.setUser(gitHubUserList.getFirst());
        statsDTO.setUsername(username.toLowerCase());

        return statsDTO;
    }

    public List<TopUserDTO> getTopUsers() {
        List<TopUserDTO> topUserList = new ArrayList<>();
        List<GitHubStats> gitHubStatsList = gitHubStatsRepository.findTop6ByOrderByTotalCommitsDesc();

        LOGGER.info("Fetched top users: {}", gitHubStatsList.size());

        for (GitHubStats gitHubStats : gitHubStatsList) {
            TopUserDTO topUser = new TopUserDTO();
            topUser.setUsername(gitHubStats.getUsername());

            List<GitHubUser> gitHubUserList = gitHubUserRepository.findByUsername(gitHubStats.getUsername().toLowerCase());
            if (gitHubUserList != null && !gitHubUserList.isEmpty()) {
                topUser.setName(gitHubUserList.getFirst().getName());
                topUser.setAvatarUrl(gitHubUserList.getFirst().getAvatarUrl());
                topUser.setUsername(gitHubUserList.getFirst().getUsername());
            }

            topUser.setTotalContributions(gitHubStats.getContributionCalendar().getTotalContributions());
            topUser.setTotalCommits(gitHubStats.getTotalCommits());
            topUser.setTotalIssuesClosed(gitHubStats.getTotalIssuesClosed());
            topUser.setTotalPullRequestsClosed(gitHubStats.getTotalPullRequestsClosed());
            topUser.setTotalStars(gitHubStats.getTotalStars());
            topUser.setTotalForks(gitHubStats.getTotalForks());
            topUserList.add(topUser);
        }

        topUserList.sort(Comparator.comparing(TopUserDTO::getTotalContributions).reversed());

        return topUserList;
    }

    public List<AllUserDTO> getAllUsers() {
        return gitHubUserRepository.findAllUsername();
    }
}