import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { LODGE_HUBS } from "@/data/campsLodgeHubs";
import { getStaysForDestination } from "@/data/campsLodges";
import LodgeCard from "./LodgeCard";
import OwnLodgeCard from "./OwnLodgeCard";
import { getPublishedAccommodations } from "@/lib/public/api";
import type { PublicAccommodationSummary as PublishedLodge } from "@/lib/public/types";

// Destinations that show Our Lodges (Kudu Lodge & Campsite and Oasis
// Residence, both in Karatu and managed in the database) alongside the
// hardcoded camps and lodges.
const DESTINATIONS_WITH_OWN_LODGE = new Set(["manyara", "ngorongoro"]);
const OWN_LODGE_NAME = /kudu|oasis residence/i;

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

  // Our lodges take the first places where they apply, and count toward the
  // row, so the hardcoded stays make way for them. They are skipped quietly
  // if the API is unreachable or a lodge isn't published. A hardcoded entry
  // for the same property (Oasis Residence has one) is dropped so it never
  // appears twice.
  let ownLodges: PublishedLodge[] = [];
  if (DESTINATIONS_WITH_OWN_LODGE.has(destinationSlug)) {
    const { data } = await getPublishedAccommodations({ limit: 50 });
    ownLodges = data.filter((a) => OWN_LODGE_NAME.test(a.name));
  }
  const shownOwn = ownLodges.map((a) => a.name.toLowerCase());
  const stays = ranked
    .filter((l) => !shownOwn.some((n) => n === l.name.toLowerCase()))
    .slice(0, Math.max(0, baseCount - ownLodges.length));

  if (stays.length === 0 && ownLodges.length === 0) return null;

  const hubSource = stays[0] ?? ranked[0];
  const area = hubSource ? LODGE_HUBS[hubSource.hub].area : undefined;

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
            href={area ? `/camps-lodges?area=${encodeURIComponent(area)}` : "/camps-lodges"}
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
          {ownLodges.map((lodge) => (
            <OwnLodgeCard key={lodge.id} accommodation={lodge} />
          ))}
          {stays.map((lodge) => (
            <LodgeCard key={lodge.slug} lodge={lodge} compact />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
