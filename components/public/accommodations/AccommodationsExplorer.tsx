"use client";

import React, { useMemo, useState } from "react";
import { Hotel } from "lucide-react";
import type { PublicAccommodationSummary } from "@/lib/public/types";
import {
  AccommodationType,
  ServiceTier,
  ACCOMMODATION_TYPE_LABELS,
  SERVICE_TIER_LABELS,
} from "@/lib/accommodations/types";
import AccommodationCard from "./AccommodationCard";

interface AccommodationsExplorerProps {
  accommodations: PublicAccommodationSummary[];
}

type TypeFilter = AccommodationType | "ALL";
type TierFilter = ServiceTier | "ALL";

export default function AccommodationsExplorer({ accommodations }: AccommodationsExplorerProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [tierFilter, setTierFilter] = useState<TierFilter>("ALL");

  // Only show filter chips for values that actually appear in the catalog.
  const availableTypes = useMemo(() => {
    const set = new Set(accommodations.map((a) => a.type));
    return (Object.keys(ACCOMMODATION_TYPE_LABELS) as AccommodationType[]).filter((t) => set.has(t));
  }, [accommodations]);

  const availableTiers = useMemo(() => {
    const set = new Set(accommodations.map((a) => a.serviceTier));
    return (Object.keys(SERVICE_TIER_LABELS) as ServiceTier[]).filter((t) => set.has(t));
  }, [accommodations]);

  const filtered = useMemo(
    () =>
      accommodations.filter(
        (a) => (typeFilter === "ALL" || a.type === typeFilter) && (tierFilter === "ALL" || a.serviceTier === tierFilter)
      ),
    [accommodations, typeFilter, tierFilter]
  );

  const chipClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-colors shrink-0 border ${
      active
        ? "bg-safari-ochre text-safari-night border-safari-ochre"
        : "bg-white/[0.03] text-white/60 border-white/10 hover:border-safari-ochre/60 hover:text-white"
    }`;

  return (
    <div className="space-y-8">
      {(availableTypes.length > 1 || availableTiers.length > 1) && (
        <div className="space-y-4">
          {availableTypes.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by type">
              <button type="button" onClick={() => setTypeFilter("ALL")} className={chipClass(typeFilter === "ALL")} aria-pressed={typeFilter === "ALL"}>
                All types
              </button>
              {availableTypes.map((t) => (
                <button key={t} type="button" onClick={() => setTypeFilter(t)} className={chipClass(typeFilter === t)} aria-pressed={typeFilter === t}>
                  {ACCOMMODATION_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          )}
          {availableTiers.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by tier">
              <button type="button" onClick={() => setTierFilter("ALL")} className={chipClass(tierFilter === "ALL")} aria-pressed={tierFilter === "ALL"}>
                All tiers
              </button>
              {availableTiers.map((t) => (
                <button key={t} type="button" onClick={() => setTierFilter(t)} className={chipClass(tierFilter === t)} aria-pressed={tierFilter === t}>
                  {SERVICE_TIER_LABELS[t]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d]">
          <Hotel className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-sm text-white/50 font-sans">No accommodations match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((accommodation, idx) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} priority={idx < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
