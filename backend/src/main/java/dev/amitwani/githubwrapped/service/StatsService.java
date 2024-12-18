package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.AllUserDTO;
import dev.amitwani.githubwrapped.dto.ResponseDTO;
import dev.amitwani.githubwrapped.dto.StatsDTO;
import dev.amitwani.githubwrapped.dto.TopUserDTO;
import dev.amitwani.githubwrapped.dto.graphql.GitHubContributionStats;
import dev.amitwani.githubwrapped.dto.graphql.GitHubPinnedItems;
import dev.amitwani.githubwrapped.dto.graphql.GitHubRepositoryStats;
import dev.amitwani.githubwrapped.model.GitHubStats;
import dev.amitwani.githubwrapped.model.GitHubUser;
import dev.amitwani.githubwrapped.repository.GitHubStatsRepository;
import dev.amitwani.githubwrapped.repository.GitHubUserRepository;
import org.kohsuke.github.GHUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StatsService.class);

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private GitHubUserRepository gitHubUserRepository;

    @Autowired
    private GitHubStatsRepository gitHubStatsRepository;

    public ResponseEntity<ResponseDTO> generateGitHubStats(String username) {
        try {
            StatsDTO statsDTO = getStats(username.toLowerCase());
            if (statsDTO != null) {
                LOGGER.info("User {} stats already exists", username);
                return ResponseEntity.ok(new ResponseDTO("User stats already exists", statsDTO));
            }
            GHUser user;
            try {
                // Fetch User Data from GitHub
                user = gitHubService.getGitHubUser(username.toLowerCase());
                LOGGER.info("Fetched user data for user: {}", user);

                if (user == null) {
                    LOGGER.error("No user data found for user: {}", username);
                    return ResponseEntity.status(404).body(new ResponseDTO("No user data found", null));
                }

            } catch (Exception e) {
                LOGGER.error("Failed to fetch user data for user: {}", username, e);
                return ResponseEntity.status(404).body(new ResponseDTO("No user data found", null));
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
            gitHubUser.setUsername(username.toLowerCase());

            // Get User Pinned Repos
            GitHubPinnedItems pinnedRepos = gitHubService.getPinnedRepos(username.toLowerCase());
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
                        node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getName() : null,
                        node.getPrimaryLanguage() != null ? node.getPrimaryLanguage().getColor() : null
                ));
            }

            // Generate Stats
            GitHubStats gitHubStats = new GitHubStats();
            gitHubStats.setUsername(username.toLowerCase());

            List<GitHubRepositoryStats.RepositoryNode> repositoryNodes = gitHubService.getRepositoryStats(username.toLowerCase());

            // Languages
            List<GitHubRepositoryStats.LanguageEdge> languageEdges = repositoryNodes
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

            // Get Contribution Stats
            GitHubContributionStats contributionStats = gitHubService.getContributionStats(username.toLowerCase());

            gitHubStats.setTotalCommits(contributionStats.getData().getUser().getContributionsCollection().getCommits());
            gitHubStats.setTotalIssuesClosed(contributionStats.getData().getUser().getContributionsCollection().getIssuesClosed());
            gitHubStats.setTotalPullRequestsClosed(contributionStats.getData().getUser().getContributionsCollection().getPullRequestsClosed());
            gitHubStats.setContributionCalendar(contributionStats.getData().getUser().getContributionsCollection().getContributionCalendar());

            // Top Repository
            GitHubStats.Repository topRepository = new GitHubStats.Repository();

            GitHubRepositoryStats.RepositoryNode topRepositoryNode = repositoryNodes.stream()
                    .max(Comparator.comparing(GitHubRepositoryStats.RepositoryNode::getStars))
                    .orElse(null);

            if (topRepositoryNode != null) {
                topRepository.setName(topRepositoryNode.getName());
                topRepository.setTopLanguage(topRepositoryNode.getPrimaryLanguage() != null ? topRepositoryNode.getPrimaryLanguage().getName() : null);
                topRepository.setTopLanguageColor(topRepositoryNode.getPrimaryLanguage() != null ? topRepositoryNode.getPrimaryLanguage().getColor() : null);
                topRepository.setStars(topRepositoryNode.getStars());
                topRepository.setForks(topRepositoryNode.getForkCount());
                gitHubStats.setTopRepository(topRepository);
            }

            // Total Stars
            gitHubStats.setTotalStars(repositoryNodes.stream().mapToInt(GitHubRepositoryStats.RepositoryNode::getStars).sum());

            // Total Forks
            gitHubStats.setTotalForks(repositoryNodes.stream().mapToInt(GitHubRepositoryStats.RepositoryNode::getForkCount).sum());

            // Save User Data
            gitHubUser.setCreatedDate(new Date());
            gitHubUser = gitHubUserRepository.save(gitHubUser);
            LOGGER.info("Saved user data for user: {}", gitHubUser);

            // Save Stats
            gitHubStats.setUserId(gitHubUser.getId());
            gitHubStats = gitHubStatsRepository.save(gitHubStats);
            LOGGER.info("Generated stats for user: {}", gitHubStats);

            statsDTO = new StatsDTO();
            statsDTO.setStats(gitHubStats);
            statsDTO.setUser(gitHubUser);
            statsDTO.setUsername(username.toLowerCase());

            return ResponseEntity.status(201).body(new ResponseDTO("Stats generated successfully", statsDTO));
        } catch (Exception e) {
            LOGGER.error("Error generating stats for user: {}", username, e);
        }
        return ResponseEntity.internalServerError().body(new ResponseDTO("Error generating stats", null));
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

        gitHubStatsList.forEach(gitHubStats -> {
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
        });

        topUserList.sort(Comparator.comparing(TopUserDTO::getTotalContributions).reversed());

        return topUserList;
    }

    public List<AllUserDTO> getAllUsers() {
        return gitHubUserRepository.findAllUsername();
    }
}
