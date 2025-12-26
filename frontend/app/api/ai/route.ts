import { Data } from '@/types/stats';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { YEAR } from '@/lib/constants';

// AI Configuration from environment variables
const AI_MODEL_ID = process.env.AI_MODEL_ID || 'mistralai/mistral-7b-instruct';
const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.9');
const AI_MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || '1200', 10);

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// Enhanced system prompt for better, more personalized responses
const SYSTEM_PROMPT = `You are GitHubWrapped AI — a witty, insightful, and slightly sassy code companion who creates personalized year-in-review summaries. You have a talent for finding humor in coding patterns and turning dry statistics into entertaining narratives.

Your personality:
- Clever and punny (you love a good code joke)
- Supportive but not afraid to roast gently
- You notice the small details that make each developer unique
- You speak like a friend who happens to know a lot about their coding habits

Guidelines:
- Reference SPECIFIC data points from the user's stats (exact numbers, languages, repos)
- Make observations that feel personal, not generic
- Use emojis strategically for emphasis, not spam (2-4 per section max)
- Keep each section punchy: 2-3 sentences max
- Be playful but never mean-spirited in roasts
- Write in English only`;

const getUserPrompt = (username: string, stats: string) => `
Analyze this GitHub developer's ${YEAR} activity and create a personalized GitHubWrapped summary.

Generate these sections (2-3 sentences each, be specific to their data):

**🎯 Your Year in Code:**
Summarize their coding journey. Mention specific numbers (commits, contributions, active days). Make it feel like a personal highlight reel.

**⚡ Code Superpower:**
Assign a creative superpower title based on their standout pattern (e.g., "The Weekend Warrior" if high weekend activity, "The Streak Master" for long streaks, "Polyglot Programmer" for diverse languages). Explain why they earned it.

**🔮 Commit Horoscope:**
Create a fun prediction based on their patterns. Reference their contribution rhythm (daily patterns, monthly trends). Give one actionable piece of advice for next year.

**🏆 Week of Glory:**
Find their most productive period. Celebrate it with specific details about what made it special.

**😴 The Drought:**
Playfully acknowledge their longest break. Be funny but understanding — we all need rest! Reference the actual gap length.

**🦊 Spirit Animal:**
Assign a coding spirit animal that matches their style. Consider: consistency, burst patterns, language preferences, weekend vs weekday activity. Make the connection clever.

**🔥 The Roast:**
One killer roast that's funny but not cruel. Reference something specific about their stats that's roast-worthy. Make them laugh at themselves.

GitHub Profile: ${username}
Year: ${YEAR}
Stats: ${stats}`;

export async function POST(req: Request) {
  const data: Data = await req.json();
  const { user, stats } = data;

  const calendar = stats.contributionCalendar;

  // Process calendar data to get monthly contributions
  const monthlyContributions = Array(12)
    .fill(0)
    .map((_, index) => {
      const month = new Date(parseInt(YEAR), index).toLocaleString("default", {
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
      const day = new Date(parseInt(YEAR), 0, index + 1).toLocaleString("default", {
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
  console.log("Using AI Model:", AI_MODEL_ID);

  const result = await streamText({
    model: openrouter.chat(AI_MODEL_ID),
    system: SYSTEM_PROMPT,
    prompt: getUserPrompt(request.username || 'Developer', JSON.stringify(request)),
    headers: {
      'HTTP-Referer': 'https://githubwrapped.xyz',
      'X-Title': `GitHub Wrapped ${YEAR} - Your Year in Code`,
    },
    temperature: AI_TEMPERATURE,
    maxTokens: AI_MAX_TOKENS,
  });

  // console.log("Results from AI:", text);

  return result.toTextStreamResponse();
}