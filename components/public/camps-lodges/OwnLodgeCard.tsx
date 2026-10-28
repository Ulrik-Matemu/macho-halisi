import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { PublicAccommodationSummary } from "@/lib/public/types";
import { ACCOMMODATION_TYPE_LABELS, SERVICE_TIER_LABELS } from "@/lib/accommodations/types";
import { areaImageFor } from "@/lib/accommodations/areaImage";

/**
 * A database-managed accommodation (our own Kudu Lodge & Campsite) shown in
 * the same cream card style as the hardcoded camps and lodges, so the two
 * sit side by side in a destination's "Where to stay" row.
 */
export default function OwnLodgeCard({ accommodation }: { accommodation: PublicAccommodationSummary }) {
  const own = accommodation.heroImage ?? accommodation.images[0];
  const area = own ? undefined : areaImageFor(accommodation);
  const cover = own ? { url: own.url, alt: own.altText || accommodation.name } : area ? { url: area.url, alt: area.alt } : undefined;

  return (
    <Link
      href={`/accommodations/${accommodation.slug}`}
      className="group flex flex-col h-full rounded overflow-hidden border border-safari-gold/60 bg-white hover:border-safari-gold hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/2] overflow-hidden shrink-0 bg-safari-bark">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#2a1c10] via-[#1e1209] to-[#3b2a17]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-sans tracking-[0.2em] uppercase font-medium bg-black/55 backdrop-blur-md text-safari-cream">
          {ACCOMMODATION_TYPE_LABELS[accommodation.type]}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-sans tracking-[0.2em] uppercase font-medium bg-safari-gold/90 text-safari-bark">
          {SERVICE_TIER_LABELS[accommodation.serviceTier]}
        </span>
        {area && (
          <span className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded text-[9px] font-sans tracking-[0.18em] uppercase bg-black/60 backdrop-blur-md text-safari-cream/90">
            Area photo · {area.place}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-safari-russet uppercase mb-1.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{accommodation.locationText}</span>
          </span>
          <h3 className="font-serif-luxury text-xl font-normal text-safari-bark group-hover:text-safari-russet transition-colors tracking-wide">
            {accommodation.name}
          </h3>
          <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-safari-gold mt-2">Our own lodge</p>
        </div>
        <div className="mt-4 flex items-center justify-end text-xs">
          <span className="flex items-center gap-1.5 text-safari-russet shrink-0">
            <span>View stay</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
