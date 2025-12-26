import { NextRequest, NextResponse } from "next/server";
import { getStats, generateGitHubStats } from "@/lib/services/stats-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    console.log(`Received request to fetch stats for user: ${username}`);

    const statsDTO = await getStats(username);

    if (!statsDTO) {
      return NextResponse.json(
        { message: "User stats not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Stats fetched successfully",
      data: statsDTO,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { message: "Error fetching stats", data: null },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    console.log(`Received request to generate stats for user: ${username}`);

    const result = await generateGitHubStats(username);

    return NextResponse.json(
      { message: result.message, data: result.data },
      { status: result.status }
    );
  } catch (error) {
    console.error("Error generating stats:", error);
    return NextResponse.json(
      { message: "Error generating stats", data: null },
      { status: 500 }
    );
  }
}

