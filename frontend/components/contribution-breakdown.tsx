"use client";

import { ContributionCalendar } from "@/types/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ContributionBreakdownProps {
  calendar: ContributionCalendar;
}

const chartConfig = {
  name: {
    label: "Name",
    color: "#2563eb",
  },
  total: {
    label: "Total",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function ContributionBreakdown({
  calendar,
}: ContributionBreakdownProps) {
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
    .filter((day) => day.weekday === 0 || day.weekday === 6)
    .reduce((total) => total + 1, 0);

  // Active Days
  const activeDays = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.contributionCount && day.contributionCount > 0).length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-white">
        {/* Monthly Contributions */}
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Contributions by Month (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <BarChart data={monthlyContributions}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Contributions */}
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Contributions by Day (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyContributions}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 text-white">
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Active Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-white-600"
                    strokeWidth="12"
                    strokeDasharray={`${(activeDays / 365) * 352} 352`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold">{activeDays}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-green-600"
                    strokeWidth="12"
                    strokeDasharray={`${(longestStreak / 365) * 352} 352`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold">{longestStreak}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Longest Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-red-600"
                    strokeWidth="12"
                    strokeDasharray={`${(longestGap / 365) * 352} 352`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold">{longestGap}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 backdrop-blur-sm border-white/[0.08] text-white">
          <CardHeader>
            <CardTitle>Weekend Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="12"
                    strokeDasharray={`${(weekendActivity / 365) * 352} 352`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold">{weekendActivity}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
