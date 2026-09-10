import type { Metadata } from "next";
import { Source_Serif_4, Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
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
  title: "Macho Halisi | Luxury Tanzanian Safaris & Wilderness Journeys",
  description:
    "Experience Tanzania through authentic eyes. Bespoke luxury wildlife safaris across the Serengeti, Ngorongoro Crater, Mount Kilimanjaro, and Zanzibar.",
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
      <body className="min-h-full flex flex-col bg-[#080808] text-[#F5F5F0]">
        {children}
      </body>
    </html>
  );
}
