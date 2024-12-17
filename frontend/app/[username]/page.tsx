import type { Metadata } from "next";

import ContributionBreakdown from "@/components/contribution-breakdown";
import ProfileHeader from "@/components/profile-header";
import SaveImageButton from "@/components/save-image";
import {
  ContributionCalendar,
  ContributionDay as ContributionDayType,
  StatsResponse,
  Week,
} from "@/types/stats";
import Link from "next/link";
import {
  GitCommit,
  CircleSlash,
  GitPullRequest,
  Star,
  GitFork,
} from "lucide-react";
import SocialShare from "@/components/social-share";
import { getStats } from "../actions/stats-action";
import { IdentifyComponent } from "@openpanel/nextjs";
export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  // read route params
  const username = (await params).username;

  // fetch data
  const stats = await getStats(username);

  return {
    title: stats?.data?.user?.name + " | GitHub Wrapped 2024",
    openGraph: {
      images: [
        {
          url: `/api/${username}/og`,
        },
      ],
    },
  };
}

function ContributionDay({ day }: { day: ContributionDayType }) {
  return (
    <div
      className="w-[10px] h-[10px] md:w-2.5 md:h-2.5 rounded-sm text-white/[0.08]"
      style={{
        backgroundColor:
          day.color === "#ebedf0" ? "#222" : day.color || "#161b22",
      }}
      title={`${day.contributionCount} contributions on ${day.date}`}
    />
  );
}

function ContributionGraph({
  calendar,
  className,
}: {
  calendar: ContributionCalendar;
  className?: string;
}) {
  return (
    <div
      className={`bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-3 md:p-6 overflow-x-auto ${className}`}
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Contribution Graph (2024)
      </h2>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[repeat(53,1fr)] gap-[1px] md:gap-1 min-w-[600px] md:min-w-0">
          {calendar.weeks.map((week: Week, weekIndex: number) => (
            <div key={weekIndex} className="flex flex-col gap-[2px] md:gap-1">
              {week.contributionDays.map(
                (day: ContributionDayType, dayIndex: number) => (
                  <ContributionDay key={dayIndex} day={day} />
                )
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 text-xs md:text-sm text-muted-foreground mt-2">
          <span>More</span>
          <div className="flex gap-[2px] md:gap-1">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-[#161b22]" />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-[#0e4429]" />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-[#006d32]" />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-[#26a641]" />
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm bg-[#39d353]" />
          </div>
          <span>Less</span>
        </div>
      </div>
    </div>
  );
}

export default async function GitHubWrapped({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const stats: StatsResponse = await getStats(username);

  if (!stats?.data) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8">
        <h1 className="text-white text-center text-2xl md:text-3xl">
          No GitHub Wrapped found for
        </h1>
        <p className="text-white font-bold text-base md:text-lg mt-4">
          {username}
        </p>
        <Link
          className="text-white text-base font-semibold md:text-lg mt-8 underline"
          href={`/`}
        >
          Generate your GitHub Wrapped
        </Link>
      </div>
    );
  }

  const { user, stats: githubStats } = stats.data;

  return (
    <>
      <IdentifyComponent
        profileId={username}
        firstName={user.name || ""}
        properties={{
          totalContributions:
            githubStats.contributionCalendar.totalContributions,
          totalCommits: githubStats.totalCommits,
          totalPRs: githubStats.totalPullRequestsClosed,
          totalIssues: githubStats.totalIssuesClosed,
          totalStars: githubStats.totalStars,
        }}
      />
      <div className="container text-white mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} username={username} />

        <div className="flex flex-col gap-2 md:flex-row md:gap-4 mb-6">
          <SaveImageButton />
          <SocialShare username={username} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8">
          {/* Contribution Stats */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Contributions (2024)
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4" />
                  <span className="text-sm md:text-base text-muted-foreground">
                    Total Commits
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold">
                  {githubStats.totalCommits}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <CircleSlash className="w-4 h-4" />
                  <span className="text-sm md:text-base text-muted-foreground">
                    Issues Closed
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold">
                  {githubStats.totalIssuesClosed}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4" />
                  <span className="text-sm md:text-base text-muted-foreground">
                    PRs Merged
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold">
                  {githubStats.totalPullRequestsClosed}
                </span>
              </div>
            </div>
          </div>

          {/* Repository Stats */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Repository Impact
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span className="text-sm md:text-base text-muted-foreground">
                    Total Stars
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold">
                  {githubStats.totalStars}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4" />
                  <span className="text-sm md:text-base text-muted-foreground">
                    Total Forks
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold">
                  {githubStats.totalForks}
                </span>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Top Languages
            </h2>
            <div className="space-y-3">
              {githubStats.languagesStats.slice(0, 5).map((lang) => (
                <div key={lang.language} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color || "#666" }}
                  />
                  <span className="text-sm md:text-base text-muted-foreground">
                    {lang.language}
                  </span>
                  <span className="text-xs md:text-sm ml-auto">
                    {(
                      ((lang.linesCount || 0) /
                        githubStats.languagesStats.reduce(
                          (acc, curr) => acc + (curr.linesCount || 0),
                          0
                        )) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Repository */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-4 md:p-6 mt-3 md:mt-8">
          <h2 className="text-base md:text-xl font-semibold mb-4">
            Top Repository
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <a
                    href={`https://github.com/${githubStats.topRepository?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline text-xs md:text-base"
                  >
                    {githubStats.topRepository?.name}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs md:text-sm">
                    ⭐ {githubStats.topRepository?.stars}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs md:text-sm">
                    🍴 {githubStats.topRepository?.forks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <ContributionGraph
          className="mt-3 md:mt-8"
          calendar={githubStats.contributionCalendar}
        />

        {/* Contribution Breakdown */}
        <ContributionBreakdown calendar={githubStats.contributionCalendar} />

        {/* Pinned Repositories */}
        {user.pinnedRepositories.length > 0 && (
          <div className="mt-3 md:mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Pinned Repositories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {user.pinnedRepositories.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-4 md:p-6 hover:scale-105 transition-all duration-300 hover:cursor-pointer hover:bg-white/10"
                >
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    {repo.name}
                  </h3>
                  {repo.description && (
                    <p className="text-muted-foreground text-xs md:text-sm mb-4">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    {repo.topLanguage && (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: repo.topLanguageColor || "#666",
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {repo.topLanguage}
                        </span>
                      </div>
                    )}
                    {repo.stars && repo.stars > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          ⭐ {repo.stars}
                        </span>
                      </div>
                    )}
                    {repo.forkCount && repo.forkCount > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          🍴 {repo.forkCount}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
