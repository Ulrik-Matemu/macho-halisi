import type { Metadata } from "next";
import { Compass } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ItineraryCard from "@/components/public/ItineraryCard";
import { getPublishedItineraries } from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safari Itineraries | Macho Halisi",
  description:
    "Browse Macho Halisi's published luxury Tanzanian safari itineraries — bespoke journeys across the Serengeti, Ngorongoro Crater, Kilimanjaro, and Zanzibar.",
  alternates: { canonical: `${getSiteUrl()}/itineraries` },
};

const PAGE_SIZE = 24;

export default async function ItinerariesIndexPage() {
  const { data: itineraries, pagination } = await getPublishedItineraries({ limit: PAGE_SIZE });

  return (
    <SiteChrome>
      <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-28">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-10 sm:mb-14 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#e0ac69] uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-[#c68642]" />
              <span>Safari Expeditions</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              All Safari Itineraries
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-sans mt-3 max-w-2xl leading-relaxed">
              {pagination.total > 0
                ? `${pagination.total} bespoke ${pagination.total === 1 ? "journey" : "journeys"} across Tanzania, curated by native safari specialists.`
                : "Our safari specialists are currently curating new journeys — check back soon."}
            </p>
          </div>

          {itineraries.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d]">
              <Compass className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-sm text-white/50 font-sans">
                No published itineraries yet. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary, idx) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} priority={idx < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
