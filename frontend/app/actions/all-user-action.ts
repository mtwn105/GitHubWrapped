"use server";

import { getAllUsers as getAllUsersService } from "@/lib/services/stats-service";

export const getAllUsers = async () => {
  try {
    const allUsers = await getAllUsersService();
    return { message: "All users fetched successfully", data: allUsers };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { error: "Error fetching all users" };
  }
};
