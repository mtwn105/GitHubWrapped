import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  // Only allow proxying from trusted domains
  const allowedDomains = [
    "avatars.githubusercontent.com",
    "github.com",
  ];

  try {
    const url = new URL(imageUrl);
    if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

