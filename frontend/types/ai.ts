
export interface AIAnalysisRequest {
  username: string | null;
  name: string | null
  bio: string | null
  blogUrl: string | null
  twitterUsername: string | null
  followers: number
  following: number
  publicRepos: number
  pinnedRepositories: PinnedRepository[]
  totalCommits: number | null
  totalIssuesClosed: number | null
  totalPullRequestsClosed: number | null
  totalStars: number | null
  totalForks: number | null
  topRepository: TopRepository | null
  languagesStats: LanguagesStat[]
  monthlyContributions: Contribution[]
  dailyContributions: Contribution[]
  longestStreak: number | null
  longestGap: number | null
  weekendActivity: number | null
  activeDays: number | null
}

export interface Contribution {
  name: string;
  total: number;
}

export interface PinnedRepository {
  name: string | null
  description: string | null
  stars: number | null
  forkCount: number | null
  topLanguage: string | null
}

export interface TopRepository {
  name: string | null
  topLanguage: string | null
  stars: number | null
  forks: number | null
}

export interface LanguagesStat {
  language: string | null
  linesCount: number | null
}