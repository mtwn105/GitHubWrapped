import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContributionDay {
  weekday: number;
  date: Date;
  contributionCount: number;
  color: string;
}

export interface IWeek {
  contributionDays: IContributionDay[];
}

export interface IContributionCalendar {
  totalContributions: number;
  weeks: IWeek[];
}

export interface ILanguageStats {
  language: string;
  color: string;
  linesCount: number;
}

export interface IRepository {
  name: string;
  topLanguage: string | null;
  topLanguageColor: string | null;
  stars: number;
  forks: number;
}

export interface IGitHubStats extends Document {
  username: string;
  userId: string;
  totalCommits: number;
  totalIssuesClosed: number;
  totalPullRequestsClosed: number;
  totalStars: number;
  totalForks: number;
  topRepository: IRepository | null;
  languagesStats: ILanguageStats[];
  contributionCalendar: IContributionCalendar;
  createdDate: Date;
}

const ContributionDaySchema = new Schema<IContributionDay>(
  {
    weekday: { type: Number, required: true },
    date: { type: Date, required: true },
    contributionCount: { type: Number, default: 0 },
    color: { type: String, default: "#ebedf0" },
  },
  { _id: false }
);

const WeekSchema = new Schema<IWeek>(
  {
    contributionDays: { type: [ContributionDaySchema], default: [] },
  },
  { _id: false }
);

const ContributionCalendarSchema = new Schema<IContributionCalendar>(
  {
    totalContributions: { type: Number, default: 0 },
    weeks: { type: [WeekSchema], default: [] },
  },
  { _id: false }
);

const LanguageStatsSchema = new Schema<ILanguageStats>(
  {
    language: { type: String, required: true },
    color: { type: String, default: "#666" },
    linesCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const RepositorySchema = new Schema<IRepository>(
  {
    name: { type: String, required: true },
    topLanguage: { type: String, default: null },
    topLanguageColor: { type: String, default: null },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
  },
  { _id: false }
);

const StatsSchema = new Schema<IGitHubStats>(
  {
    username: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    totalCommits: { type: Number, default: 0 },
    totalIssuesClosed: { type: Number, default: 0 },
    totalPullRequestsClosed: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    topRepository: { type: RepositorySchema, default: null },
    languagesStats: { type: [LanguageStatsSchema], default: [] },
    contributionCalendar: {
      type: ContributionCalendarSchema,
      default: { totalContributions: 0, weeks: [] },
    },
    createdDate: { type: Date, default: Date.now },
  },
  {
    collection: "stats",
  }
);

const Stats: Model<IGitHubStats> =
  mongoose.models.Stats || mongoose.model<IGitHubStats>("Stats", StatsSchema);

export default Stats;

