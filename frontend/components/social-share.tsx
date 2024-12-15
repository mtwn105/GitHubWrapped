"use client";

import { Share2Icon } from "lucide-react";

export default function SocialShare({ username }: { username: string }) {
  return (
    <div className="fixed bottom-8 left-8 flex gap-4 z-50">
      <button
        onClick={async () => {
          // Tweet with the image
          window.open(
            `https://x.com/intent/tweet?text=Check out my GitHub Wrapped for 2024! %23GitHubWrapped&url=https://githubwrapped.xyz/${username}`,
            "_blank"
          );
        }}
        className="fixed left-8 bottom-8 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all duration-300 z-50"
      >
        <Share2Icon className="w-4 h-4 mr-2 inline-block" />
        Share
      </button>
    </div>
  );
}
