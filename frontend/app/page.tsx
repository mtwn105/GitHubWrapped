"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { generateWrapped } from "./actions/stats-action";
import { useToast } from "@/components/ui/toaster";
import { TopUser } from "@/types/topUser";
import { getTopUsers } from "./actions/top-user-action";
import Image from "next/image";
import { useOpenPanel } from "@openpanel/nextjs";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const op = useOpenPanel();

  const fetchTopUsers = useCallback(async () => {
    try {
      const response = await getTopUsers();
      if (response.error) {
        toast(response.error, "error");
        return;
      }
      setTopUsers(response.data ?? []);
    } catch (err) {
      console.error("Error fetching top users:", err);
      toast("Failed to fetch top users", "error");
    }
  }, [toast]);

  useEffect(() => {
    fetchTopUsers();
  }, [fetchTopUsers]);

  const handleGenerate = useCallback(async () => {
    if (!username.trim()) return;

    setLoading(true);
    op.track("generate_wrapped", { username });

    try {
      const response = await generateWrapped(username);
      if (response.error) {
        op.track("generate_wrapped_error", { username, error: response.error });
        toast(response.error, "error");
      } else {
        op.track("generate_wrapped_success", { username });
        toast("Successfully generated wrapped!", "success");
        router.push(`/${username}`);
      }
    } catch (error) {
      op.track("generate_wrapped_error", { username, error: "Unknown error" });
      console.error("Error generating wrapped:", error);
      toast("Error generating wrapped", "error");
    } finally {
      setLoading(false);
    }
  }, [username, op, toast, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const handleGitHubClick = useCallback(() => {
    window.open("https://github.com/mtwn105/GitHubWrapped", "_blank");
  }, []);

  const handleShareOnX = useCallback(() => {
    op.track("share_on_x", { location: "home" });
    window.open(
      "https://twitter.com/intent/tweet?text=Create your GitHub Wrapped for 2024!%20%23GitHubWrapped&url=https://githubwrapped.xyz",
      "_blank"
    );
  }, [op]);

  const scrollToTopProfiles = useCallback(() => {
    const element = document.getElementById("top-profiles");
    element?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8 md:px-0">
      <WavyBackground className="w-full max-w-4xl mx-auto">
        <p className="text-4xl md:text-7xl text-white font-bold inter-var text-center">
          GitHub Wrapped
        </p>
        <p className="text-lg sm:text-xl md:text-2xl mt-4 text-white font-normal inter-var text-center">
          Your Year in Code 2024
        </p>
        <div className="flex flex-col items-center justify-center w-full">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Enter GitHub username"
            className="px-4 py-2 mt-8 w-full max-w-[300px] text-sm rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20"
          />
          <button
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-6 sm:px-8 text-sm font-medium text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 w-full max-w-[300px]"
            onClick={handleGenerate}
          >
            Generate Wrapped
          </button>
          {loading && (
            <>
              <p className="text-sm text-white/80 mt-4">
                This may take a few seconds...
              </p>
              <div className="mt-2 h-1 w-full max-w-[300px] overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-1/2 animate-[shimmer_1s_ease-in-out_infinite] bg-white/50" />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleGitHubClick}
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-6 sm:px-8 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 border border-white/20 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Star us on GitHub
          </button>
          <button
            onClick={handleShareOnX}
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-6 sm:px-8 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 border border-white/20 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share us on X
          </button>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTopProfiles}
            className="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-6 sm:px-8 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 border border-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            View Top Profiles
          </button>
        </div>
      </WavyBackground>

      {topUsers.length > 0 && (
        <div id="top-profiles" className="text-center w-full mt-12">
          <p className="text-2xl md:text-4xl text-white/80">
            Top GitHub Profiles
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
            {topUsers.map((user) => (
              <div
                key={user.username}
                onClick={() => router.push(`/${user.username}`)}
                className="group relative overflow-hidden rounded-lg bg-white/10 p-6 transition-all duration-300 hover:scale-105 hover:bg-white/20 w-full max-w-[300px] mx-auto cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatarUrl}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="rounded-full object-cover transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center items-start min-w-0">
                    <span className="text-lg font-semibold text-white truncate w-full">
                      {user.username}
                    </span>
                    <span className="text-sm text-white/60 truncate w-full">
                      {user.name}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                      Contributions
                    </span>
                    <span>{user.totalContributions}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      Stars
                    </span>
                    <span>{user.totalStars}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z" />
                      </svg>
                      Commits
                    </span>
                    <span>{user.totalCommits}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                      </svg>
                      Pull Requests
                    </span>
                    <span>{user.totalPullRequestsClosed}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        <path
                          fillRule="evenodd"
                          d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                        />
                      </svg>
                      Issues
                    </span>
                    <span>{user.totalIssuesClosed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
