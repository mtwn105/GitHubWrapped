"use client";

import Image from "next/image";
import { User } from "@/types/stats";

export default function ProfileHeader({
  user,
  username,
}: {
  user: User;
  username: string;
}) {
  return (
    <div
      onClick={() => window.open(`https://github.com/${username}`, "_blank")}
      className="bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-6 mb-8 hover:scale-105 transition-all duration-300 hover:cursor-pointer hover:bg-white/10"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src={user.avatarUrl}
          alt={user.username || ""}
          width={120}
          height={120}
          className="rounded-full"
        />
        <div className="text-center md:text-left ">
          <h1 className="text-4xl font-bold mb-2">{user.name || username}</h1>
          {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{user.followers}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{user.following}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{user.publicRepos}</span>
              <span className="text-muted-foreground">Repositories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
