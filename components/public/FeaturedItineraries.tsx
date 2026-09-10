import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { getPublishedItineraries } from "@/lib/public/api";
import ItineraryCard from "./ItineraryCard";

const FEATURED_COUNT = 6;

/**
 * Homepage section rendered directly below the Hero. Server component —
 * fetches PUBLISHED itineraries at request/build time via the backend's
 * public API (see lib/public/api.ts), no client-side loading state needed.
 * Renders nothing at all when there is nothing published yet, rather than
 * showing an empty section shell on the live marketing site.
 */
export default async function FeaturedItineraries() {
  const { data: itineraries } = await getPublishedItineraries({ limit: FEATURED_COUNT });

  if (itineraries.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 bg-[#080808] py-16 sm:py-24 lg:py-28">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#e0ac69] uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-[#c68642]" />
              <span>Bespoke Journeys</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              Featured Safari Itineraries
            </h2>
          </div>

          <Link
            href="/itineraries"
            className="group inline-flex items-center gap-2 text-xs font-serif-luxury tracking-[0.22em] uppercase text-white/70 hover:text-[#ffdbac] transition-colors shrink-0"
          >
            <span>View All Journeys</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary, idx) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} priority={idx < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
