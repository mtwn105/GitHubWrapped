import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import { ToasterProvider } from "@/components/ui/toaster";
import { OpenPanelComponent } from "@openpanel/nextjs";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "GitHub Wrapped 2024",
    template: "%s | GitHub Wrapped",
  },
  description:
    "Your Year in Code 2024 - View your GitHub contributions, stats, and coding journey for 2024.",
  keywords: [
    "github",
    "developer",
    "coding",
    "contributions",
    "stats",
    "wrapped",
    "2024",
  ],
  authors: [{ name: "Amit Wani" }],
  creator: "Amit Wani",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GitHub Wrapped 2024",
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
    creator: "@mtwn105",
    site: "@mtwn105",
    images: [
      {
        url: "https://githubwrapped.xyz/github-wrapped-og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistMono.className} antialiased`}>
        <ToasterProvider>
          <OpenPanelComponent
            clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENTID!}
            trackScreenViews={true}
            trackAttributes={true}
          />
          {children}
          <Footer />
        </ToasterProvider>
      </body>
    </html>
  );
}
