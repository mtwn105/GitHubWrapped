"use server";

import { getTopUsers as getTopUsersService } from "@/lib/services/stats-service";

export const getTopUsers = async () => {
  try {
    const topUsers = await getTopUsersService();
    return { message: "Top users fetched successfully", data: topUsers };
  } catch (error) {
    console.error("Error fetching top users:", error);
    return { error: "Error fetching top users" };
  }
};
