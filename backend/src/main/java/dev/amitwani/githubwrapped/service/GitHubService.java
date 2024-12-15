package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.graphql.GitHubContributionStats;
import dev.amitwani.githubwrapped.dto.graphql.GitHubPinnedItems;
import dev.amitwani.githubwrapped.dto.graphql.GitHubRepositoryStats;
import dev.amitwani.githubwrapped.dto.graphql.GraphQLRequest;
import jakarta.annotation.PostConstruct;
import org.kohsuke.github.GHUser;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class GitHubService {

    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(GitHubService.class);

    @Value("${github.graphql.url}")
    private String graphqlUrl;

    @Value("${github.token}")
    private String token;

    @Value("${github.username}")
    private String username;

    private GitHub unauthenticatedGitHub;
    private GitHub gitHub;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void init() throws IOException {
        unauthenticatedGitHub = new GitHubBuilder().build();
        gitHub = new GitHubBuilder().withOAuthToken(token, username).build();
    }

    public GHUser getGitHubUser(String username) throws IOException {
        try {
            return unauthenticatedGitHub.getUser(username);
        } catch (Exception e) {
            LOGGER.error("Failed to fetch user data using unauthenticated GitHub for user: {}", username, e);
            return gitHub.getUser(username);
        }
    }

    public GitHubPinnedItems getPinnedRepos(String username) {

        String graphqlQuery = """
                    query {
                      user(login: "%s") {
                        pinnedItems(first: 6, types: [REPOSITORY]) {
                          edges {
                            node {
                              ... on Repository{
                                 name,
                                 stars: stargazerCount
                                 description
                                 url
                                 forkCount
                                 primaryLanguage {
                                             name
                                             color
                                           }
                               }
                            }
                          }
                        }
                      }
                    }
                """.formatted(username);

        GraphQLRequest request = new GraphQLRequest(graphqlQuery);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");

        HttpEntity<GraphQLRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<GitHubPinnedItems> response = restTemplate.exchange(
                graphqlUrl,
                HttpMethod.POST,
                entity,
                GitHubPinnedItems.class
        );

        LOGGER.info("Response: {} {}", response.getStatusCode(), response.getBody());
        LOGGER.info("Response Headers: {}", response.getHeaders());


        return response.getBody();
    }

    public List<GitHubRepositoryStats.RepositoryNode> getRepositoryStats(String username) {

        String graphqlQuery = """
                    query {
                       user(login: "%s") {
                         repositories(first: 100, isFork: false) {
                           edges {
                             node {
                               name
                               stars: stargazerCount
                               forkCount
                               primaryLanguage {
                                   name
                                   color
                                 }
                               commits: defaultBranchRef {
                                 target {
                                   ... on Commit {
                                     history(since: "2024-01-01T00:00:00Z", until: "2024-12-31T23:59:59Z") {
                                       totalCount
                                     }
                                   }
                                 }
                               }
                               languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                                 edges {
                                   node {
                                     name
                                     color
                                   }
                                   size
                                 }
                               }
                             }
                           }
                           pageInfo {
                             hasNextPage
                             endCursor
                           }
                         }
                       }
                     }
                """.formatted(username);

        GraphQLRequest request = new GraphQLRequest(graphqlQuery);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");

        HttpEntity<GraphQLRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<GitHubRepositoryStats> response = restTemplate.exchange(
                graphqlUrl,
                HttpMethod.POST,
                entity,
                GitHubRepositoryStats.class
        );

        LOGGER.info("Response: {} {}", response.getStatusCode(), response.getBody());
        LOGGER.info("Response Headers: {}", response.getHeaders());


        GitHubRepositoryStats contributionStats = response.getBody();

        if (contributionStats == null) {
            return null;
        }

        List<GitHubRepositoryStats.RepositoryNode> allRepositories = new ArrayList<>(contributionStats.getData().getUser().getRepositories().getEdges().stream().map(GitHubRepositoryStats.RepositoryEdge::getNode).toList());

        // Handle pagination
        while (contributionStats.getData().getUser().getRepositories().getPageInfo().isHasNextPage()) {
            String cursor = contributionStats.getData().getUser().getRepositories().getPageInfo().getEndCursor();
            graphqlQuery = """
                        query {
                           user(login: "%s") {
                             repositories(first: 100, after: "%s", isFork: false) {
                               edges {
                                 node {
                                   name
                                   stars: stargazerCount
                                   forkCount
                                    primaryLanguage {
                                       name
                                       color
                                     }
                                   commits: defaultBranchRef {
                                     target {
                                       ... on Commit {
                                         history(since: "2024-01-01T00:00:00Z", until: "2024-12-31T23:59:59Z") {
                                           totalCount
                                         }
                                       }
                                     }
                                   }
                                   languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                                     edges {
                                       node {
                                         name
                                         color
                                       }
                                       size
                                     }
                                   }
                                 }
                               }
                               pageInfo {
                                 hasNextPage
                                 endCursor
                               }
                             }
                           }
                         }
                    """.formatted(username, cursor);

            request = new GraphQLRequest(graphqlQuery);
            entity = new HttpEntity<>(request, headers);

            response = restTemplate.exchange(
                    graphqlUrl,
                    HttpMethod.POST,
                    entity,
                    GitHubRepositoryStats.class
            );

            LOGGER.info("Response: {} {}", response.getStatusCode(), response.getBody());
            LOGGER.info("Response Headers: {}", response.getHeaders());

            contributionStats = response.getBody();

            if (contributionStats == null) {
                break;
            }

            allRepositories.addAll(contributionStats.getData().getUser().getRepositories().getEdges().stream().map(GitHubRepositoryStats.RepositoryEdge::getNode).toList());
        }

        return allRepositories;

    }

    public GitHubContributionStats getContributionStats(String username) {

        String graphqlQuery = """
                    query {
                       user(login: "%s") {
                            contributionsCollection(
                              from: "2024-01-01T00:00:00Z"
                              to: "2024-12-31T23:59:59Z"
                            ) {
                              commits: totalCommitContributions
                              issuesClosed: totalIssueContributions
                              pullRequestsClosed: totalPullRequestContributions
                              contributionCalendar {
                                totalContributions
                                weeks {
                                  contributionDays {
                                    weekday
                                    date
                                    contributionCount
                                    color
                                  }
                                }
                              }
                            }
                          }
                     }
                """.formatted(username);

        GraphQLRequest request = new GraphQLRequest(graphqlQuery);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");

        HttpEntity<GraphQLRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<GitHubContributionStats> response = restTemplate.exchange(
                graphqlUrl,
                HttpMethod.POST,
                entity,
                GitHubContributionStats.class
        );

        LOGGER.info("Response: {} {}", response.getStatusCode(), response.getBody());
        LOGGER.info("Response Headers: {}", response.getHeaders());

        return response.getBody();

    }

}
