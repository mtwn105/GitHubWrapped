import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://githubwrapped.xyz"),
  title: "About GitHub Wrapped",
  description:
    "Your Year in Code 2024 - View your GitHub contributions, stats, and coding journey for 2024.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
