import { Octokit } from "@octokit/rest";
import { YEAR_START, YEAR_END } from "./constants";

// Lazy initialization - only create when needed
let octokit: Octokit | null = null;

function getOctokit(): Octokit {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("Please define the GITHUB_TOKEN environment variable");
    }
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

function getGraphQLUrl(): string {
  return process.env.GITHUB_GRAPHQL_URL || "https://api.github.com/graphql";
}

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Please define the GITHUB_TOKEN environment variable");
  }
  return token;
}

// Types for GraphQL responses
interface PrimaryLanguage {
  name: string;
  color: string;
}

interface PinnedItemNode {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forkCount: number;
  primaryLanguage: PrimaryLanguage | null;
}

interface PinnedItemsResponse {
  data: {
    user: {
      pinnedItems: {
        edges: Array<{
          node: PinnedItemNode;
        }>;
      };
    };
  };
}

interface LanguageEdge {
  node: {
    name: string;
    color: string;
  };
  size: number;
}

interface RepositoryNode {
  name: string;
  stars: number;
  forkCount: number;
  primaryLanguage: PrimaryLanguage | null;
  commits: {
    target: {
      history: {
        totalCount: number;
      };
    } | null;
  } | null;
  languages: {
    edges: LanguageEdge[];
  };
}

interface RepositoryStatsResponse {
  data: {
    user: {
      repositories: {
        edges: Array<{
          node: RepositoryNode;
        }>;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
    };
  };
}

interface ContributionDay {
  weekday: number;
  date: string;
  contributionCount: number;
  color: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

interface ContributionStatsResponse {
  data: {
    user: {
      contributionsCollection: {
        commits: number;
        issuesClosed: number;
        pullRequestsClosed: number;
        contributionCalendar: ContributionCalendar;
      };
    };
  };
}

async function graphqlRequest<T>(query: string): Promise<T> {
  const response = await fetch(getGraphQLUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGitHubToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubUser(username: string) {
  try {
    const { data } = await getOctokit().users.getByUsername({ username });
    return {
      username: data.login,
      name: data.name,
      bio: data.bio,
      email: data.email,
      company: data.company,
      location: data.location,
      avatarUrl: data.avatar_url,
      blogUrl: data.blog,
      twitterUsername: data.twitter_username,
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
    };
  } catch (error) {
    console.error(`Failed to fetch user data for: ${username}`, error);
    return null;
  }
}

export async function getPinnedRepos(username: string) {
  const query = `
    query {
      user(login: "${username}") {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          edges {
            node {
              ... on Repository {
                name
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
  `;

  try {
    const response = await graphqlRequest<PinnedItemsResponse>(query);
    return response.data.user.pinnedItems.edges.map((edge) => ({
      name: edge.node.name,
      description: edge.node.description,
      url: edge.node.url,
      stars: edge.node.stars,
      forkCount: edge.node.forkCount,
      topLanguage: edge.node.primaryLanguage?.name || null,
      topLanguageColor: edge.node.primaryLanguage?.color || null,
    }));
  } catch (error) {
    console.error(`Failed to fetch pinned repos for: ${username}`, error);
    return [];
  }
}

export async function getRepositoryStats(username: string): Promise<RepositoryNode[]> {
  const allRepositories: RepositoryNode[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const afterClause: string = cursor !== null ? `, after: "${cursor}"` : "";
    const query = `
      query {
        user(login: "${username}") {
          repositories(first: 100${afterClause}, isFork: false) {
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
                      history(since: "${YEAR_START}", until: "${YEAR_END}") {
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
    `;

    try {
      const response = await graphqlRequest<RepositoryStatsResponse>(query);
      const repos = response.data.user.repositories;

      allRepositories.push(...repos.edges.map((edge) => edge.node));

      hasNextPage = repos.pageInfo.hasNextPage;
      cursor = repos.pageInfo.endCursor;
    } catch (error) {
      console.error(`Failed to fetch repository stats for: ${username}`, error);
      break;
    }
  }

  return allRepositories;
}

export async function getContributionStats(username: string) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection(
          from: "${YEAR_START}"
          to: "${YEAR_END}"
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
  `;

  try {
    const response = await graphqlRequest<ContributionStatsResponse>(query);
    return response.data.user.contributionsCollection;
  } catch (error) {
    console.error(`Failed to fetch contribution stats for: ${username}`, error);
    return null;
  }
}

// Helper to aggregate language stats from repositories
export function aggregateLanguageStats(
  repositories: RepositoryNode[]
): Array<{ language: string; color: string; linesCount: number }> {
  const languageMap = new Map<
    string,
    { language: string; color: string; linesCount: number }
  >();

  for (const repo of repositories) {
    for (const edge of repo.languages.edges) {
      const existing = languageMap.get(edge.node.name);
      if (existing) {
        existing.linesCount += edge.size;
      } else {
        languageMap.set(edge.node.name, {
          language: edge.node.name,
          color: edge.node.color,
          linesCount: edge.size,
        });
      }
    }
  }

  return Array.from(languageMap.values()).sort(
    (a, b) => b.linesCount - a.linesCount
  );
}

// Helper to find top repository by stars
export function findTopRepository(repositories: RepositoryNode[]) {
  if (repositories.length === 0) return null;

  const top = repositories.reduce((max, repo) =>
    repo.stars > max.stars ? repo : max
  );

  return {
    name: top.name,
    topLanguage: top.primaryLanguage?.name || null,
    topLanguageColor: top.primaryLanguage?.color || null,
    stars: top.stars,
    forks: top.forkCount,
  };
}

// Helper to calculate total stars and forks
export function calculateTotals(repositories: RepositoryNode[]) {
  return repositories.reduce(
    (acc, repo) => ({
      totalStars: acc.totalStars + repo.stars,
      totalForks: acc.totalForks + repo.forkCount,
    }),
    { totalStars: 0, totalForks: 0 }
  );
}

