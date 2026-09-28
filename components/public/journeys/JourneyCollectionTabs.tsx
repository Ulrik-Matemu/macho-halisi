import Link from "next/link";
import { journeyCollections } from "@/data/journeys";

/** The design's collection switcher — each tab is its own prerendered page. */
export default function JourneyCollectionTabs({ activeSlug }: { activeSlug: string }) {
  return (
    <nav
      aria-label="Journey collections"
      className="max-w-[1340px] mx-auto px-6 sm:px-16 pt-28 sm:pt-32 flex flex-wrap gap-x-[26px] gap-y-2"
    >
      {journeyCollections.map((c) => {
        const active = c.slug === activeSlug;
        return (
          <Link
            key={c.slug}
            href={`/journeys/${c.slug}`}
            aria-current={active ? "page" : undefined}
            className={`py-1.5 font-sans font-light text-[10.5px] tracking-[0.26em] uppercase border-b transition-colors duration-300 ${
              active
                ? "text-[#1E1913] border-[#8A6A33]"
                : "text-[#1E1913]/55 border-transparent hover:text-[#1E1913]"
            }`}
          >
            {c.tab}
          </Link>
        );
      })}
    </nav>
  );
}
