"use client";

import ItineraryMap from "./ItineraryMap";
import type { ItineraryMapPin } from "@/lib/public/api";

interface ItineraryJourneyOverviewMapProps {
  pins: ItineraryMapPin[];
}

/**
 * "The journey" — a full-width map of the entire route shown once, right
 * after the overview and before the day-by-day section, so a visitor sees
 * the whole trip's geography at a glance before reading it day by day.
 * Static camera (fits all pins); clicking a pin scrolls to that day's
 * entry further down the page. Renders nothing when ItineraryMap itself
 * has nothing to draw (no token, or fewer than 2 usable pins).
 */
export default function ItineraryJourneyOverviewMap({ pins }: ItineraryJourneyOverviewMapProps) {
  if (pins.length < 2) return null;

  const scrollToDay = (dayNumber: number) => {
    document.getElementById(`day-${dayNumber}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
      <div className="mb-10">
        <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-4">
          The journey
        </div>
        <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-[#1E1913] uppercase">
          Where you&apos;ll go
        </h2>
      </div>
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded overflow-hidden border border-[#1E1913]/[0.12]">
        <ItineraryMap pins={pins} onPinClick={scrollToDay} className="absolute inset-0" />
      </div>
    </section>
  );
}
