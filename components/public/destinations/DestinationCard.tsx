import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/data/destinations";

interface DestinationCardProps {
  destination: Destination;
  priority?: boolean;
}

/**
 * Cream-skin sibling of ItineraryCard (components/public/ItineraryCard.tsx)
 * — same eyebrow / serif-title / footer-arrow DNA, restyled for the
 * destination pages' light palette (#F6F2EA / #1E1913 / gold accents)
 * instead of the dark homepage skin the itinerary card uses.
 */
export default function DestinationCard({ destination, priority = false }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group flex flex-col rounded overflow-hidden border border-[#1E1913]/10 bg-white hover:border-[#C9A46A] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/2] overflow-hidden shrink-0">
        <Image
          src={destination.heroImage}
          alt={destination.heroImageAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-sans tracking-[0.2em] uppercase font-medium bg-black/55 backdrop-blur-md text-[#F6F2EA]">
          {destination.categoryLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#8A6A33] uppercase block mb-1.5">
            {destination.region}
          </span>
          <h3 className="font-serif-luxury text-xl font-normal text-[#1E1913] group-hover:text-[#8A6A33] transition-colors tracking-wide">
            {destination.name}
          </h3>
          <p className="text-xs text-[#1E1913]/62 line-clamp-2 mt-2 font-sans leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-end text-xs">
          <span className="flex items-center gap-1.5 text-[#8A6A33] shrink-0">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
