import type { Metadata } from "next";
import { YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Support GitHub Wrapped ${YEAR}`,
  description: `Help keep GitHub Wrapped running! Your support helps cover hosting costs, API expenses, and development time to bring you the best GitHub year-in-review experience.`,
  openGraph: {
    title: `Support GitHub Wrapped ${YEAR}`,
    description: `Help keep GitHub Wrapped running! Your support makes a difference.`,
    images: [
      {
        url: "https://githubwrapped.xyz/github-wrapped-og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Support GitHub Wrapped ${YEAR}`,
    description: `Help keep GitHub Wrapped running! Your support makes a difference.`,
    images: ["https://githubwrapped.xyz/github-wrapped-og.png"],
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

