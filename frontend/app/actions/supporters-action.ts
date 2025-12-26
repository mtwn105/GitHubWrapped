"use server";

import dbConnect from "@/lib/mongodb";
import Supporter from "@/lib/models/Supporter";
import { Supporter as SupporterType, SupportersResponse } from "@/types/supporter";

export async function getSupporters(): Promise<{
  data?: SupportersResponse;
  error?: string;
}> {
  try {
    await dbConnect();

    // Fetch supporters who opted to display on wall, sorted by most recent
    const supporters = await Supporter.find({ displayOnWall: true })
      .select("name amount currency createdAt -_id")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Get total stats
    const stats = await Supporter.aggregate([
      { $match: { displayOnWall: true } },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalCount = stats[0]?.totalCount || 0;
    const totalAmount = stats[0]?.totalAmount || 0;

    const formattedSupporters: SupporterType[] = supporters.map((s) => ({
      paymentId: "",
      name: s.name,
      amount: s.amount,
      currency: s.currency,
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return {
      data: {
        supporters: formattedSupporters,
        totalCount,
        totalAmount,
      },
    };
  } catch (error) {
    console.error("Error fetching supporters:", error);
    return { error: "Failed to fetch supporters" };
  }
}

export async function getSupporterCount(): Promise<{
  count: number;
  totalAmount: number;
}> {
  try {
    await dbConnect();

    const stats = await Supporter.aggregate([
      { $match: { displayOnWall: true } },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return {
      count: stats[0]?.totalCount || 0,
      totalAmount: stats[0]?.totalAmount || 0,
    };
  } catch (error) {
    console.error("Error fetching supporter count:", error);
    return { count: 0, totalAmount: 0 };
  }
}

