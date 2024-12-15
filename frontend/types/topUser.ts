export interface TopUserResponse {
  message: string
  data: TopUser[]
}

export interface TopUser {
  username: string
  name: string
  avatarUrl: string
  totalCommits: number
  totalIssuesClosed: number
  totalPullRequestsClosed: number
  totalStars: number
  totalForks: number
}
