export interface StatsResponse {
  message: string | null
  data: Data | null
}

export interface Data {
  username: string | null
  user: User
  stats: Stats
}

export interface User {
  id: string
  username: string | null
  name: string | null
  bio: string | null
  email: string | null
  company: string | null
  location: string | null
  avatarUrl: string
  blogUrl: string | null
  twitterUsername: string | null
  followers: number
  following: number
  publicRepos: number
  pinnedRepositories: PinnedRepository[]
  createdDate: string
}

export interface PinnedRepository {
  name: string | null
  description: string | null
  url: string | null
  stars: number | null
  forkCount: number | null
  topLanguage: string | null
  topLanguageColor: string | null
}

export interface Stats {
  id: string
  username: string | null
  userId: string | null
  totalCommits: number | null
  totalIssuesClosed: number | null
  totalPullRequestsClosed: number | null
  totalStars: number | null
  totalForks: number | null
  topRepository: TopRepository | null
  languagesStats: LanguagesStat[]
  contributionCalendar: ContributionCalendar
  monthlyContributions: MonthlyContribution[]
  dailyContributions: DailyContribution[]
}

export interface TopRepository {
  name: string | null
  topLanguage: string | null
  topLanguageColor: string | null
  stars: number | null
  forks: number | null
}

export interface LanguagesStat {
  language: string | null
  color: string | null
  linesCount: number | null
}

export interface ContributionCalendar {
  totalContributions: number | null
  weeks: Week[]
}

export interface Week {
  contributionDays: ContributionDay[]
}

export interface ContributionDay {
  weekday: number | null
  date: string | null
  contributionCount: number | null
  color: string | null
}

export interface MonthlyContribution {
  month: string
  value: number
}

export interface DailyContribution {
  day: string
  value: number
}

