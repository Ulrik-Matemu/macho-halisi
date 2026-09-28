"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Destination, DestinationCategory } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

interface DestinationsExplorerProps {
  destinations: Destination[];
}

const CATEGORY_FILTERS: { value: DestinationCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "national-park", label: "National Parks" },
  { value: "conservation-area", label: "Conservation Areas" },
  { value: "game-reserve", label: "Game Reserves" },
  { value: "mountain", label: "Mountains" },
  { value: "island", label: "Islands" },
  { value: "natural-wonder", label: "Natural Wonders" },
  { value: "historic-site", label: "Historic Sites" },
];

/**
 * Client-side category chips + free-text search over the static
 * destinations array — same in-memory .filter() idiom already used for
 * the nav mega-menu search (components/FullscreenNavMenu.tsx), applied
 * here to a much smaller, fully static dataset.
 */
export default function DestinationsExplorer({ destinations }: DestinationsExplorerProps) {
  const [category, setCategory] = useState<DestinationCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesCategory = category === "all" || d.category === category;
      const matchesQuery =
        q.length === 0 ||
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [destinations, category, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E1913]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-3 rounded border border-[#1E1913]/15 bg-white font-sans font-light text-sm text-[#1E1913] placeholder:text-[#1E1913]/40 focus:outline-none focus:border-[#C9A46A] transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setCategory(f.value)}
              aria-pressed={category === f.value}
              className={`px-4 py-2 rounded-full font-sans font-light text-xs tracking-[0.08em] uppercase transition-colors cursor-pointer ${
                category === f.value
                  ? "bg-[#1E1913] text-[#F6F2EA]"
                  : "bg-[#1E1913]/[0.05] text-[#1E1913]/70 hover:bg-[#1E1913]/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[#1E1913]/15 rounded-xl">
          <p className="text-sm text-[#1E1913]/50 font-sans">
            No destinations match &quot;{query}&quot;. Try another search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((destination, idx) => (
            <DestinationCard key={destination.slug} destination={destination} priority={idx < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
