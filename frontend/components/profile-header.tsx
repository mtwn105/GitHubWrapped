"use client";

import Image from "next/image";
import { User } from "@/types/stats";
import { Users, UserPlus, BookMarked } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";

export default function ProfileHeader({
  user,
  username,
}: {
  user: User;
  username: string;
}) {
  const op = useOpenPanel();

  // Add JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name || username,
    alternateName: username,
    description: user.bio,
    image: user.avatarUrl,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${username}`,
    sameAs: [`https://github.com/${username}`],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        onClick={() => {
          op.track("profile_header_github_click");
          window.open(`https://github.com/${username}`, "_blank");
        }}
        className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-4 md:p-6 mb-6 md:mb-8 hover:scale-105 transition-all duration-300 hover:cursor-pointer hover:bg-white/10"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Image
            src={user.avatarUrl}
            alt={user.username || ""}
            width={96}
            height={96}
            className="rounded-full md:w-[120px] md:h-[120px]"
          />
          <div className="text-center md:text-left w-full">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {user.name || username}
            </h1>
            {user.bio && (
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                {user.bio}
              </p>
            )}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-sm md:text-base">
                  {user.followers}
                </span>
                <span className="text-muted-foreground text-sm md:text-base">
                  Followers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="font-semibold text-sm md:text-base">
                  {user.following}
                </span>
                <span className="text-muted-foreground text-sm md:text-base">
                  Following
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                <span className="font-semibold text-sm md:text-base">
                  {user.publicRepos}
                </span>
                <span className="text-muted-foreground text-sm md:text-base">
                  Repos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
