import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { LODGE_HUBS } from "@/data/campsLodgeHubs";
import { getStaysForDestination } from "@/data/campsLodges";
import LodgeCard from "./LodgeCard";
import OwnLodgeCard from "./OwnLodgeCard";
import { getPublishedAccommodations } from "@/lib/public/api";

// Destinations that show our own lodge (Kudu Lodge & Campsite, in Karatu,
// managed in the database) alongside the hardcoded camps and lodges.
const DESTINATIONS_WITH_OWN_LODGE = new Set(["manyara", "ngorongoro"]);

/**
 * "Where to stay" section for a destination page: the best-fit camps,
 * lodges and hotels nearby (in the park or in the closest base town).
 */
export default async function DestinationStays({ destinationSlug, destinationName }: { destinationSlug: string; destinationName: string }) {
  const ranked = getStaysForDestination(destinationSlug, 12);
  // Four by default. Where several larger featured properties serve the
  // destination (the Arusha area), show them all plus the closest local stays.
  const featuredCount = ranked.filter((l) => l.featured).length;
  const baseCount = featuredCount >= 4 ? Math.min(8, Math.max(featuredCount + 2, 6)) : 4;

  // Our own lodge takes the first place where it applies, and counts toward
  // the row, so the hardcoded stays make way for it. It is skipped quietly
  // if the API is unreachable or the lodge isn't published.
  let ownLodge = null;
  if (DESTINATIONS_WITH_OWN_LODGE.has(destinationSlug)) {
    const { data } = await getPublishedAccommodations({ limit: 50 });
    ownLodge = data.find((a) => /kudu/i.test(a.name)) ?? null;
  }
  const stays = ranked.slice(0, ownLodge ? baseCount - 1 : baseCount);

  if (stays.length === 0 && !ownLodge) return null;

  const area = LODGE_HUBS[(stays[0] ?? ranked[0]).hub].area;

  return (
    <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
      <ScrollReveal>
        <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
          Camps &amp; Lodges
        </div>
        <div className="flex items-end justify-between gap-8 flex-wrap mb-4">
          <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase">
            Where to stay
          </h2>
          <Link
            href={`/camps-lodges?area=${encodeURIComponent(area)}`}
            className="font-sans text-xs tracking-[0.2em] uppercase text-safari-russet hover:underline"
          >
            More in this area →
          </Link>
        </div>
        <p className="max-w-2xl font-sans font-light text-[15px] leading-[1.8] text-safari-bark/78 mb-10">
          Our favourite camps, lodges and hotels for visiting {destinationName} — some inside or beside it, others in the
          nearest base town, chosen for comfort, setting and how easily they fit your route.
        </p>
      </ScrollReveal>
      <ScrollReveal delayMs={100} size="lift">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${baseCount === 6 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {ownLodge && <OwnLodgeCard accommodation={ownLodge} />}
          {stays.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} compact />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
