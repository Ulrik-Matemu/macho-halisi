import { Suspense } from "react";
import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import FeaturedItineraries, { FeaturedItinerariesSkeleton } from "@/components/public/FeaturedItineraries";
import SmoothScroll from "@/components/public/SmoothScroll";
import { getSiteUrl } from "@/lib/site";

const TITLE = "Macho Halisi | Luxury Tanzanian Safaris & Wilderness Journeys";
const DESCRIPTION =
  "Bespoke, locally-owned and guided safaris across the Serengeti, Ngorongoro Crater, Kilimanjaro, and Zanzibar. Plan a journey through Tanzania with native safari specialists.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    type: "website",
    url: getSiteUrl(),
    siteName: "Macho Halisi",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    // No `images` here — app/opengraph-image.tsx's file convention injects
    // the OG image automatically (with a content hash Next manages), and a
    // hardcoded path here would fight that.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Server component: SiteChrome (client) owns the Navbar/menu/modal
// interaction state, and receives this page's server-rendered content as
// children. FeaturedItineraries fetches published itineraries with an
// `await`, which requires a server component and could not run inside the
// old "use client" version of this file.
//
// FeaturedItineraries is wrapped in Suspense so a slow/cold backend delays
// only that section — Hero (and its poster/LQIP) still paints immediately,
// with FeaturedItinerariesSkeleton filling the space until data resolves.
export default function Home() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <Hero />
      <Suspense fallback={<FeaturedItinerariesSkeleton />}>
        <FeaturedItineraries />
      </Suspense>
    </SiteChrome>
  );
}
