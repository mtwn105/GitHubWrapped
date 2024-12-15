// import { Metadata } from "next";

import Navbar from "@/components/navbar";

// export const metadata: Metadata = {
//   title: "GitHub Wrapped",
//   description: "Your GitHub stats wrapped in a present",
// };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
