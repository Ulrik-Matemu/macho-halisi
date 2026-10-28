import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { CampLodge } from "@/data/campsLodges";
import LodgeCover from "./LodgeCover";

interface LodgeCardProps {
  lodge: CampLodge;
  priority?: boolean;
  /** Tighter copy for the destination pages' "Where to stay" row. */
  compact?: boolean;
}

/** Cream-skin card, a sibling of DestinationCard, for camps, lodges and hotels. */
export default function LodgeCard({ lodge, priority = false, compact = false }: LodgeCardProps) {
  return (
    <Link
      href={`/camps-lodges/${lodge.slug}`}
      className="group flex flex-col h-full rounded overflow-hidden border border-safari-bark/10 bg-white hover:border-safari-gold hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/2] overflow-hidden shrink-0 bg-safari-bark">
        <LodgeCover
          lodge={lodge}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-sans tracking-[0.2em] uppercase font-medium bg-black/55 backdrop-blur-md text-safari-cream">
          {lodge.kind}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-sans tracking-[0.2em] uppercase font-medium bg-safari-gold/90 text-safari-bark">
          {lodge.tier}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-safari-russet uppercase mb-1.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{lodge.location}</span>
          </span>
          <h3 className="font-serif-luxury text-xl font-normal text-safari-bark group-hover:text-safari-russet transition-colors tracking-wide">
            {lodge.name}
          </h3>
          <p className={`text-xs text-safari-bark/78 mt-2 font-sans leading-relaxed ${compact ? "line-clamp-3" : "line-clamp-3"}`}>
            {lodge.summary}
          </p>
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
