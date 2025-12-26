import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPinnedRepository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forkCount: number;
  topLanguage: string | null;
  topLanguageColor: string | null;
}

export interface IGitHubUser extends Document {
  username: string;
  name: string | null;
  bio: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
  avatarUrl: string;
  blogUrl: string | null;
  twitterUsername: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  pinnedRepositories: IPinnedRepository[];
  createdDate: Date;
}

const PinnedRepositorySchema = new Schema<IPinnedRepository>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    url: { type: String, required: true },
    stars: { type: Number, default: 0 },
    forkCount: { type: Number, default: 0 },
    topLanguage: { type: String, default: null },
    topLanguageColor: { type: String, default: null },
  },
  { _id: false }
);

const UserSchema = new Schema<IGitHubUser>(
  {
    username: { type: String, required: true, index: true },
    name: { type: String, default: null },
    bio: { type: String, default: null },
    email: { type: String, default: null },
    company: { type: String, default: null },
    location: { type: String, default: null },
    avatarUrl: { type: String, required: true },
    blogUrl: { type: String, default: null },
    twitterUsername: { type: String, default: null },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    publicRepos: { type: Number, default: 0 },
    pinnedRepositories: { type: [PinnedRepositorySchema], default: [] },
    createdDate: { type: Date, default: Date.now },
  },
  {
    collection: "user",
  }
);

const User: Model<IGitHubUser> =
  mongoose.models.User || mongoose.model<IGitHubUser>("User", UserSchema);

export default User;

