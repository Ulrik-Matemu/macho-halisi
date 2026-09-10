import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Moon, DollarSign } from "lucide-react";
import type { PublicItinerarySummary } from "@/lib/public/types";
import { formatStartingPrice } from "@/lib/public/api";

interface ItineraryCardProps {
  itinerary: PublicItinerarySummary;
  /** Set true for above-the-fold cards (e.g. the first row on the homepage). */
  priority?: boolean;
}

/**
 * The site's one reusable card primitive. Its text-block DNA (eyebrow /
 * serif title / clamped body / "Explore" footer with an arrow) is lifted
 * directly from the search-result card in FullscreenNavMenu.tsx — the
 * closest thing this codebase has to an established design system — with
 * a cover image added on top, since itineraries (unlike nav menu entries)
 * always have photography.
 */
export default function ItineraryCard({ itinerary, priority = false }: ItineraryCardProps) {
  const cover = itinerary.images[0];
  const destinationName = itinerary.destinations[0]?.destination.name;
  const price = formatStartingPrice(itinerary.startingPrice);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group flex flex-col rounded border border-white/10 bg-white/[0.02] overflow-hidden hover:border-[#c68642] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/2] bg-black/60 overflow-hidden shrink-0">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || itinerary.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c160f] to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

        {itinerary.availabilityStatus !== "AVAILABLE" && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-black/70 backdrop-blur-md border border-white/15 text-[#f1c27d]">
            {itinerary.availabilityStatus === "LIMITED" ? "Limited Availability" : "Fully Booked"}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {destinationName && (
            <span className="text-[10px] tracking-[0.25em] text-[#e0ac69] uppercase block mb-1">
              {destinationName}
            </span>
          )}
          <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#ffdbac] transition-colors tracking-wide">
            {itinerary.title}
          </h3>
          {itinerary.overview && (
            <p className="text-xs text-white/60 line-clamp-2 mt-2 font-sans leading-relaxed">
              {itinerary.overview}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-white/50 font-mono">
            {itinerary.nights !== null && (
              <span className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-[#c68642]" />
                {itinerary.nights} night{itinerary.nights === 1 ? "" : "s"}
              </span>
            )}
            {itinerary.priceOnRequest ? (
              <span className="text-[#f1c27d]">On Request</span>
            ) : price ? (
              <span className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-[#c68642]" />
                {price}
              </span>
            ) : null}
          </div>
          <span className="flex items-center gap-1.5 text-[#e0ac69] shrink-0">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
