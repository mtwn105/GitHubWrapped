"use server";

import {
  getStats as getStatsService,
  generateGitHubStats,
} from "@/lib/services/stats-service";

export const generateWrapped = async (username: string) => {
  try {
    const result = await generateGitHubStats(username);

    if (result.status === 404) {
      return { error: "Invalid GitHub username" };
    }

    if (result.status >= 400) {
      return { error: "Error generating wrapped" };
    }

    return { message: result.message, data: result.data };
  } catch (error) {
    console.error("Error generating wrapped:", error);
    return { error: "Error generating wrapped" };
  }
};

export const getStats = async (username: string) => {
  try {
    const statsDTO = await getStatsService(username);

    if (!statsDTO) {
      return null;
    }

    return { message: "Stats fetched successfully", data: statsDTO };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};