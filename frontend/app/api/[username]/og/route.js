import { ImageResponse } from "next/og";
import { getStats } from "@/app/actions/stats-action";

export const runtime = "edge";
async function loadGoogleFont(font, text) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  const stats = await getStats(username);

  if (!stats) {
    return new Response("User not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "white",
          background: "linear-gradient(135deg, #000000, #1a1a1a)",
          width: "100%",
          height: "100%",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: "bold",
            color: "#00ff87",
            fontFamily: "Geist Mono",
          }}
        >
          GitHub Wrapped 2024
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <img
            src={stats.data.user.avatarUrl}
            width="100"
            height="100"
            style={{
              borderRadius: "50px",
              border: "4px solid rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: "bold",
                color: "#00ff87",
                fontFamily: "Geist Mono",
              }}
            >
              {stats.data.user.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#888",
              }}
            >
              @{username}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
          }}
        >
          {[
            {
              value: stats.data.stats.contributionCalendar.totalContributions,
              label: "Total Contributions",
              color: "#00ff87",
            },
            {
              value: stats.data.stats.totalCommits,
              label: "Commits",
              color: "#00cc6a",
            },
            {
              value: stats.data.stats.totalIssuesClosed,
              label: "Issues Closed",
              color: "#00b359",
            },
            {
              value: stats.data.stats.totalPullRequestsClosed,
              label: "PRs Merged",
              color: "#009933",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                padding: "16px",
                borderRadius: "16px",
                width: "200px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: "bold",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#888",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Mono",
          data: await loadGoogleFont(
            "Geist Mono",
            "GitHub Wrapped 2024 " + username
          ),
          style: "normal",
        },
      ],
    }
  );
}
