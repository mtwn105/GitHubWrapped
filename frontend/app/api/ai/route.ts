import { Data } from '@/types/stats';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
export async function POST(req: Request) {
  const data: Data = await req.json();
  const { user, stats } = data;

  const calendar = stats.contributionCalendar;

  // Process calendar data to get monthly contributions
  const monthlyContributions = Array(12)
    .fill(0)
    .map((_, index) => {
      const month = new Date(2024, index).toLocaleString("default", {
        month: "short",
      });
      let total = 0;
      calendar.weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
          if (day.date && new Date(day.date).getMonth() === index) {
            total += day.contributionCount || 0;
          }
        });
      });
      return { name: month, total };
    });

  // Process calendar data to get daily contributions
  const dailyContributions = Array(7)
    .fill(0)
    .map((_, index) => {
      const day = new Date(2024, 0, index + 1).toLocaleString("default", {
        weekday: "short",
      });
      let total = 0;
      calendar.weeks.forEach((week) => {
        week.contributionDays.forEach((d) => {
          if (d.weekday === index) {
            total += d.contributionCount || 0;
          }
        });
      });
      return { name: day, total };
    });

  // Calculate longest streak
  let currentStreak = 0;
  let longestStreak = 0;
  calendar.weeks
    .flatMap((week) => week.contributionDays)
    .forEach((day) => {
      if (day.contributionCount && day.contributionCount > 0) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    });
  longestStreak = Math.max(longestStreak, currentStreak);

  // Calculate longest gap
  let longestGap = 0;
  let currentGap = 0;
  calendar.weeks
    .flatMap((week) => week.contributionDays)
    .forEach((day) => {
      if (!day.contributionCount || day.contributionCount === 0) {
        currentGap++;
      } else {
        longestGap = Math.max(longestGap, currentGap);
        currentGap = 0;
      }
    });
  longestGap = Math.max(longestGap, currentGap);

  // Weekend activity
  const weekendActivity = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter(
      (day) =>
        (day.weekday === 0 || day.weekday === 6) &&
        day.contributionCount &&
        day.contributionCount > 0
    ).length;

  // Active Days
  const activeDays = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.contributionCount && day.contributionCount > 0).length;

  const request = {
    username: data.username,
    name: user.name,
    bio: user.bio,
    blogUrl: user.blogUrl,
    twitterUsername: user.twitterUsername,
    followers: user.followers,
    following: user.following,
    publicRepos: user.publicRepos,
    pinnedRepositories: user.pinnedRepositories,
    totalCommits: stats.totalCommits,
    totalIssuesClosed: stats.totalIssuesClosed,
    totalPullRequestsClosed: stats.totalPullRequestsClosed,
    totalStars: stats.totalStars,
    totalForks: stats.totalForks,
    topRepository: stats.topRepository,
    languagesStats: stats.languagesStats,
    monthlyContributions,
    dailyContributions,
    longestStreak,
    longestGap,
    weekendActivity,
    activeDays,
  };

  console.log("Request to AI:", request);

  const result = await streamText({
    model: openrouter.chat('mistralai/mistral-7b-instruct'),
    prompt: `You are a creative assistant tasked with generating a fun and engaging GitHubWrapped summary for a user based on their GitHub activity. The user's data includes stats like total commits, contributions calendar, repositories, and more. Based on this, generate the following brief and concise sections (each no longer than 2-3 sentences):

    0. Your Year in Code: Write a short summary of the user's year in code.
1. Code Superpower of the Year: Assign a fun superpower title based on the user's standout activity and briefly explain why.
2. Commit Horoscope: Create a GitHub-themed horoscope reflecting the user's contribution patterns, with one key piece of advice for next year.
3. The Week of Wonders: Identify the user's most active week and celebrate it in 1-2 sentences.
4. The Lazy Coder’s Award: Humorously highlight a period of inactivity in 1-2 sentences.
5. Open Source Spirit Animal: Assign a spirit animal based on the user's coding style and explain the connection in one sentence.
6. Roast the user: Roast the user so hard that they will never forget this year.

Use a lighthearted, creative, and engaging tone. Heavy use of emojis. Keep the output concise and avoid unnecessary details. Use English language only.

Give output in below markdown format:

**Your Year in Code:**
**Code Superpower of the Year:**

**Commit Horoscope:**

**The Week of Wonders:**

**The Lazy Coder’s Award:**

**Open Source Spirit Animal:**

**Roast the user:**

GitHub Stats for ${request.username} in last year 2024: ${JSON.stringify(request)}`,
    headers: {
      'HTTP-Referer': 'https://githubwrapped.xyz',
      'X-Title': 'GitHub Wrapped 2024 - Your Year in Code',
    },
    temperature: 1,
    maxTokens: 1024
  });

  // console.log("Results from AI:", text);

  return result.toTextStreamResponse();
}