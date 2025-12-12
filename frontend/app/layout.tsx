import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import { ToasterProvider } from "@/components/ui/toaster";
import DonateButton from "@/components/donate-button";
import Script from "next/script";
import { YEAR } from "@/lib/constants";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://githubwrapped.xyz"),
  title: {
    default: `GitHub Wrapped ${YEAR}`,
    template: "%s | GitHub Wrapped",
  },
  description: `Your Year in Code ${YEAR} - View your GitHub contributions, stats, and coding journey for ${YEAR}.`,
  keywords: [
    "github",
    "developer",
    "coding",
    "contributions",
    "stats",
    "wrapped",
    YEAR,
  ],
  authors: [{ name: "Amit Wani" }],
  creator: "Amit Wani",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `GitHub Wrapped ${YEAR}`,
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
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {umamiUrl && umamiWebsiteId && (
          <Script
            defer
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiWebsiteId}
          />
        )}
      </head>
      <body className={`${geistMono.className} antialiased`}>
        <ToasterProvider>
          {children}
          <DonateButton />
          <Footer />
        </ToasterProvider>
      </body>
    </html>
  );
}
