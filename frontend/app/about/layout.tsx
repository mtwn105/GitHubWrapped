import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About GitHub Wrapped",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
