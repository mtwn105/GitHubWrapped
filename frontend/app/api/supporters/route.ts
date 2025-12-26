import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Supporter from "@/lib/models/Supporter";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
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

    return NextResponse.json({
      supporters: supporters.map((s) => ({
        name: s.name,
        amount: s.amount,
        currency: s.currency,
        createdAt: s.createdAt,
      })),
      totalCount,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching supporters:", error);
    return NextResponse.json(
      { error: "Failed to fetch supporters" },
      { status: 500 }
    );
  }
}

