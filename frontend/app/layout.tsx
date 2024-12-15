import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import { ToasterProvider } from "@/components/ui/toaster";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GitHub Wrapped 2024",
  description: "Your Year in Code 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.className} antialiased`}>
        <ToasterProvider>{children}</ToasterProvider>
        <Footer />
      </body>
    </html>
  );
}
