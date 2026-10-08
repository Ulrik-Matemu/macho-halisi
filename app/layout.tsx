import type { Metadata } from "next";
import { Source_Serif_4, Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl, SITE } from "@/lib/site";
import { JsonLd, organization, website } from "@/lib/seo/jsonLd";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-luxury",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Private Tanzania Safaris by Local Guides | Macho Halisi",
  description:
    "Experience Tanzania through authentic eyes. Bespoke luxury wildlife safaris across the Serengeti, Ngorongoro Crater, Mount Kilimanjaro, and Zanzibar.",
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: getSiteUrl() }],
  publisher: SITE.legalName,
  category: "travel",
  keywords: [
    "Tanzania safari",
    "Serengeti safari",
    "Great Migration safari",
    "Ngorongoro Crater tour",
    "Kilimanjaro climb",
    "Zanzibar holiday",
    "private safari Tanzania",
    "Tanzania tour operator",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Plain-text site summary for AI assistants (llms.txt convention). Set
            here rather than via metadata.alternates, which pages replace
            wholesale when they set their canonical. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Macho Halisi summary for AI assistants" />
      </head>
      <body className="min-h-full flex flex-col bg-safari-night text-[#F5F5F0]">
        {/* The business, described once for every page; other JSON-LD blocks reference it by @id. */}
        <JsonLd data={[organization(), website()]} />
        {children}
      </body>
    </html>
  );
}
