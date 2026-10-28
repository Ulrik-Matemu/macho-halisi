import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { PublicAccommodationSummary } from "@/lib/public/types";
import { ACCOMMODATION_TYPE_LABELS, SERVICE_TIER_LABELS } from "@/lib/accommodations/types";

interface AccommodationCardProps {
  accommodation: PublicAccommodationSummary;
  /** Set true for above-the-fold cards. */
  priority?: boolean;
}

/**
 * Card primitive for the accommodations grid — mirrors ItineraryCard's DNA
 * (cover image, eyebrow, serif title, meta footer with an arrow) so the two
 * catalogs read as one system.
 */
export default function AccommodationCard({ accommodation, priority = false }: AccommodationCardProps) {
  const cover = accommodation.heroImage ?? accommodation.images[0];

  return (
    <Link
      href={`/accommodations/${accommodation.slug}`}
      className="group flex flex-col rounded border border-white/10 bg-white/[0.02] overflow-hidden hover:border-safari-ochre hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/2] bg-black/60 overflow-hidden shrink-0">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || accommodation.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : accommodation.areaImage ? (
          <>
            <Image
              src={accommodation.areaImage.url}
              alt={accommodation.areaImage.alt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded text-[9px] font-sans tracking-[0.18em] uppercase bg-black/60 backdrop-blur-md text-safari-cream/90">
              Area photo · {accommodation.areaImage.place}
            </span>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c160f] to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-sans tracking-wider uppercase font-semibold bg-black/70 backdrop-blur-md border border-white/15 text-safari-sand">
          {ACCOMMODATION_TYPE_LABELS[accommodation.type]}
        </span>

      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-safari-gold uppercase block mb-1">
            {SERVICE_TIER_LABELS[accommodation.serviceTier]}
          </span>
          <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-safari-champagne transition-colors tracking-wide">
            {accommodation.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-white/55 mt-2 font-sans leading-relaxed">
            <MapPin className="w-3 h-3 text-safari-ochre shrink-0" />
            {accommodation.locationText}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-end text-xs">
          <span className="flex items-center gap-1.5 text-safari-gold shrink-0">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
