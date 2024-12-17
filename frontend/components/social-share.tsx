"use client";

import { useOpenPanel } from "@openpanel/nextjs";

export default function SocialShare({ username }: { username: string }) {
  const op = useOpenPanel();

  return (
    <div className="fixed bottom-8 left-8 flex gap-4 z-50">
      <button
        id="twitter-share-button"
        onClick={async () => {
          op.track("share_on_x", { location: "wrapped_page", username });
          // Tweet with the image
          window.open(
            `https://x.com/intent/tweet?text=Check out my GitHub Wrapped for 2024! %23GitHubWrapped&url=https://githubwrapped.xyz/${username}`,
            "_blank"
          );
        }}
        className="fixed left-8 bottom-8 bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all duration-300 z-50 flex items-center text-sm md:text-base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </button>
    </div>
  );
}
