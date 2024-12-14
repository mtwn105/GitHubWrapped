package dev.amitwani.githubwrapped.service;

import dev.amitwani.githubwrapped.dto.graphql.GitHubPinnedItems;
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


        return response.getBody();
    }

}
