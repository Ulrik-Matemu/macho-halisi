"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CampLodge } from "@/data/campsLodges";
import { LODGE_AREAS, LODGE_HUBS, type LodgeArea } from "@/data/campsLodgeHubs";
import LodgeCard from "./LodgeCard";

interface LodgesExplorerProps {
  lodges: CampLodge[];
  initialArea?: LodgeArea | "all";
}

/** Area chips + free-text search over the static camps & lodges list. */
export default function LodgesExplorer({ lodges, initialArea = "all" }: LodgesExplorerProps) {
  const [area, setArea] = useState<LodgeArea | "all">(initialArea);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lodges.filter((l) => {
      const hub = LODGE_HUBS[l.hub];
      const matchesArea = area === "all" || hub.area === area;
      const matchesQuery =
        q.length === 0 ||
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.kind.toLowerCase().includes(q) ||
        hub.label.toLowerCase().includes(q);
      return matchesArea && matchesQuery;
    });
  }, [lodges, area, query]);

  const chips: { value: LodgeArea | "all"; label: string }[] = [
    { value: "all", label: "All" },
    ...LODGE_AREAS.map((a) => ({ value: a, label: a })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:gap-6 mb-10">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-safari-bark/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search camps, lodges, hotels or places..."
            className="w-full pl-10 pr-4 py-3 rounded border border-safari-bark/15 bg-white font-sans font-light text-sm text-safari-bark placeholder:text-safari-bark/40 focus:outline-none focus:border-safari-gold transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              aria-pressed={area === chip.value}
              onClick={() => setArea(chip.value)}
              className={`px-4 py-2 rounded font-sans text-xs tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                area === chip.value
                  ? "bg-safari-bark text-safari-cream"
                  : "bg-white border border-safari-bark/15 text-safari-bark/78 hover:border-safari-gold"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-safari-bark/78 py-16 text-center">
          No camps or lodges match &quot;{query}&quot;. Try another search or area.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lodge, i) => (
            <LodgeCard key={lodge.slug} lodge={lodge} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
