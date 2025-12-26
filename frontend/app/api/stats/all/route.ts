import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/services/stats-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Received request to fetch all users");

    const allUsers = await getAllUsers();

    return NextResponse.json({
      message: "All users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return NextResponse.json(
      { message: "Error fetching all users", data: null },
      { status: 500 }
    );
  }
}

