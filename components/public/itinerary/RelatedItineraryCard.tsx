import Image from "next/image";
import Link from "next/link";
import type { PublicItinerarySummary } from "@/lib/public/types";
import { formatStartingPrice } from "@/lib/public/api";

interface RelatedItineraryCardProps {
  itinerary: PublicItinerarySummary;
}

/**
 * "You may also like" card at the bottom of the itinerary detail page —
 * cream palette, distinct from both components/public/ItineraryCard.tsx
 * (dark grid card, /itineraries) and ItineraryStackCard.tsx (homepage
 * sticky stack). Same underlying data, a third visual treatment for a
 * third context — not worth unifying into one shared component when each
 * lives on a different background and layout.
 */
export default function RelatedItineraryCard({ itinerary }: RelatedItineraryCardProps) {
  const cover = itinerary.images[0];
  const destinationName = itinerary.destinations[0]?.destination.name;
  const price = formatStartingPrice(itinerary.startingPrice);

  return (
    <Link href={`/itineraries/${itinerary.slug}`} className="group block">
      <div className="relative aspect-[4/3] rounded overflow-hidden bg-[#E7DFD1] mb-4">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || itinerary.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E7DFD1] to-[#D8CDB8]" />
        )}
      </div>

      {destinationName && (
        <div className="font-sans font-light text-[10.5px] tracking-[0.3em] text-[#8A6A33] uppercase mb-2.5">
          {destinationName}
        </div>
      )}

      <div className="font-serif-luxury font-light text-2xl tracking-[0.04em] text-[#1E1913] mb-2 group-hover:text-[#8A6A33] transition-colors">
        {itinerary.title}
      </div>

      <div className="font-sans font-light text-xs tracking-[0.16em] text-[#1E1913]/70 uppercase">
        {itinerary.nights !== null && `${itinerary.nights + 1}D / ${itinerary.nights}N · `}
        {itinerary.priceOnRequest ? "On Request" : price ? `From $${price}` : ""}
      </div>
    </Link>
  );
}
