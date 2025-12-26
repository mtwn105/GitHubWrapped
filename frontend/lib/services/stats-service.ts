import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Stats from "@/lib/models/Stats";
import {
  getGitHubUser,
  getPinnedRepos,
  getRepositoryStats,
  getContributionStats,
  aggregateLanguageStats,
  findTopRepository,
  calculateTotals,
} from "@/lib/github";
import { User as UserType, Stats as StatsType } from "@/types/stats";

export interface StatsDTO {
  username: string;
  user: UserType;
  stats: StatsType;
}

// Transform MongoDB document to frontend type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformUser(doc: any): UserType {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id?.toString() || obj.id,
    username: obj.username,
    name: obj.name,
    bio: obj.bio,
    email: obj.email,
    company: obj.company,
    location: obj.location,
    avatarUrl: obj.avatarUrl,
    blogUrl: obj.blogUrl,
    twitterUsername: obj.twitterUsername,
    followers: obj.followers,
    following: obj.following,
    publicRepos: obj.publicRepos,
    pinnedRepositories: obj.pinnedRepositories || [],
    createdDate: obj.createdDate?.toISOString() || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformStats(doc: any): StatsType {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id?.toString() || obj.id,
    username: obj.username,
    userId: obj.userId,
    totalCommits: obj.totalCommits,
    totalIssuesClosed: obj.totalIssuesClosed,
    totalPullRequestsClosed: obj.totalPullRequestsClosed,
    totalStars: obj.totalStars,
    totalForks: obj.totalForks,
    topRepository: obj.topRepository,
    languagesStats: obj.languagesStats || [],
    contributionCalendar: obj.contributionCalendar || {
      totalContributions: 0,
      weeks: [],
    },
    monthlyContributions: [],
    dailyContributions: [],
  };
}

export interface TopUserDTO {
  username: string;
  name: string;
  avatarUrl: string;
  totalContributions: number;
  totalCommits: number;
  totalIssuesClosed: number;
  totalPullRequestsClosed: number;
  totalStars: number;
  totalForks: number;
}

export interface AllUserDTO {
  username: string;
}

export async function getStats(username: string): Promise<StatsDTO | null> {
  await dbConnect();

  const normalizedUsername = username.toLowerCase();

  const user = await User.findOne({ username: normalizedUsername });
  if (!user) {
    console.log(`User not found for username: ${normalizedUsername}`);
    return null;
  }

  const stats = await Stats.findOne({ username: normalizedUsername });
  if (!stats) {
    console.log(`Stats not found for username: ${normalizedUsername}`);
    return null;
  }

  return {
    username: normalizedUsername,
    user: transformUser(user),
    stats: transformStats(stats),
  };
}

export async function generateGitHubStats(
  username: string
): Promise<{ status: number; data: StatsDTO | null; message: string }> {
  await dbConnect();

  const normalizedUsername = username.toLowerCase();

  // Check if stats already exist
  const existingStats = await getStats(normalizedUsername);
  if (existingStats) {
    console.log(`User ${normalizedUsername} stats already exists`);
    return {
      status: 200,
      data: existingStats,
      message: "User stats already exists",
    };
  }

  // Fetch GitHub user data
  const githubUser = await getGitHubUser(normalizedUsername);
  if (!githubUser) {
    return {
      status: 404,
      data: null,
      message: "No user data found",
    };
  }

  // Fetch pinned repositories
  const pinnedRepos = await getPinnedRepos(normalizedUsername);

  // Create and save user document
  const userDoc = new User({
    username: normalizedUsername,
    name: githubUser.name,
    bio: githubUser.bio,
    email: githubUser.email,
    company: githubUser.company,
    location: githubUser.location,
    avatarUrl: githubUser.avatarUrl,
    blogUrl: githubUser.blogUrl,
    twitterUsername: githubUser.twitterUsername,
    followers: githubUser.followers,
    following: githubUser.following,
    publicRepos: githubUser.publicRepos,
    pinnedRepositories: pinnedRepos,
    createdDate: new Date(),
  });

  const savedUser = await userDoc.save();

  // Fetch repository stats
  const repositories = await getRepositoryStats(normalizedUsername);

  // Fetch contribution stats
  const contributionStats = await getContributionStats(normalizedUsername);

  if (!contributionStats) {
    return {
      status: 500,
      data: null,
      message: "Failed to fetch contribution stats",
    };
  }

  // Process and aggregate data
  const languagesStats = aggregateLanguageStats(repositories);
  const topRepository = findTopRepository(repositories);
  const { totalStars, totalForks } = calculateTotals(repositories);

  // Create and save stats document
  const statsDoc = new Stats({
    username: normalizedUsername,
    userId: savedUser._id.toString(),
    totalCommits: contributionStats.commits,
    totalIssuesClosed: contributionStats.issuesClosed,
    totalPullRequestsClosed: contributionStats.pullRequestsClosed,
    totalStars,
    totalForks,
    topRepository,
    languagesStats,
    contributionCalendar: contributionStats.contributionCalendar,
    createdDate: new Date(),
  });

  const savedStats = await statsDoc.save();

  return {
    status: 201,
    data: {
      username: normalizedUsername,
      user: transformUser(savedUser),
      stats: transformStats(savedStats),
    },
    message: "Stats generated successfully",
  };
}

export async function getTopUsers(): Promise<TopUserDTO[]> {
  await dbConnect();

  // Find top 6 users by total commits
  const topStats = await Stats.find()
    .sort({ totalCommits: -1 })
    .limit(6)
    .lean();

  const topUsers: TopUserDTO[] = [];

  for (const stats of topStats) {
    const user = await User.findOne({
      username: stats.username.toLowerCase(),
    }).lean();

    if (user) {
      topUsers.push({
        username: stats.username,
        name: user.name || "",
        avatarUrl: user.avatarUrl,
        totalContributions: stats.contributionCalendar.totalContributions,
        totalCommits: stats.totalCommits,
        totalIssuesClosed: stats.totalIssuesClosed,
        totalPullRequestsClosed: stats.totalPullRequestsClosed,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
      });
    }
  }

  // Sort by total contributions
  topUsers.sort((a, b) => b.totalContributions - a.totalContributions);

  return topUsers;
}

export async function getAllUsers(): Promise<AllUserDTO[]> {
  await dbConnect();

  const users = await User.find({}, { username: 1, _id: 0 }).lean();

  return users.map((user) => ({ username: user.username }));
}

