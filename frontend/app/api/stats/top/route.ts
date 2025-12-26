import { NextResponse } from "next/server";
import { getTopUsers } from "@/lib/services/stats-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Received request to fetch top users");

    const topUsers = await getTopUsers();

    return NextResponse.json({
      message: "Top users fetched successfully",
      data: topUsers,
    });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { message: "Error fetching top users", data: null },
      { status: 500 }
    );
  }
}

