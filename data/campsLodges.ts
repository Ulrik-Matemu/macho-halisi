import { campsLodgeEntries } from "@/data/camps-lodges";
import { LODGE_HUBS, type LodgeHubId } from "@/data/campsLodgeHubs";
import { getDestinationBySlug } from "@/data/destinations";

export type LodgeKind = "Lodge" | "Tented Camp" | "Hotel" | "Resort" | "Boutique Hotel" | "Eco-lodge" | "Beach Lodge";
export type LodgeTier = "Mid-range" | "Premium" | "Luxury";

export interface LodgeImage {
  url: string;
  alt: string;
}

/**
 * A hand-curated camp, lodge or hotel recommended for a region. These live
 * in the front end (not the accommodations database) and are shown on the
 * /camps-lodges pages and in each destination's "Where to stay" section.
 */
export interface CampLodge {
  slug: string;
  name: string;
  kind: LodgeKind;
  tier: LodgeTier;
  hub: LodgeHubId;
  /** Human-readable setting, e.g. "Karatu, near the Ngorongoro Crater". */
  location: string;
  tagline: string;
  /** One-sentence summary used on cards. */
  summary: string;
  description: string[];
  highlights: { title: string; description: string }[];
  features: string[];
  idealFor: string[];
  /** Extra destination slugs this property is especially convenient for. */
  destinations: string[];
  /** Photos are optional; a property with none gets a text-led cover. */
  images: LodgeImage[];
  /** Larger, well-known properties that rank first wherever they are listed. */
  featured: boolean;
  /**
   * Set only for properties with no photo of their own: a photo of the area
   * they serve, shown with an "Area photo" label so it never passes for the
   * property itself.
   */
  areaCover?: { url: string; alt: string; place: string };
}

/**
 * Gives every property without photos an area photo, drawn from the
 * destinations its hub serves (local files first) and rotated so neighbouring
 * properties don't all share one picture.
 */
function withAreaCovers(entries: CampLodge[]): CampLodge[] {
  const used = new Map<string, number>();
  return entries.map((lodge) => {
    if (lodge.images.length > 0) return lodge;
    const hub = LODGE_HUBS[lodge.hub];
    const pool: { url: string; place: string }[] = [];
    for (const slug of hub.coverFrom ?? hub.destinations) {
      const dest = getDestinationBySlug(slug);
      if (!dest) continue;
      for (const url of [dest.heroImage, ...dest.gallery.map((g) => g.url)]) {
        if (url) pool.push({ url, place: dest.name });
      }
    }
    const local = pool.filter((p) => p.url.startsWith("/"));
    const choices = local.length > 0 ? local : pool;
    if (choices.length === 0) return lodge;
    const n = used.get(lodge.hub) ?? 0;
    used.set(lodge.hub, n + 1);
    const pick = choices[n % choices.length];
    return {
      ...lodge,
      areaCover: { url: pick.url, place: pick.place, alt: `The ${pick.place} area, near ${lodge.name}` },
    };
  });
}

export const campsLodges: CampLodge[] = withAreaCovers(campsLodgeEntries);

export function getCampLodgeBySlug(slug: string): CampLodge | undefined {
  return campsLodges.find((l) => l.slug === slug);
}

export function getAllCampLodgeSlugs(): string[] {
  return campsLodges.map((l) => l.slug);
}

/**
 * Stays recommended for a destination, closest first: properties in the
 * hub whose lead destination this is (the in-park and nearest-town stays),
 * then ones that list it directly, then other hubs that cover it. Within a
 * tier, featured properties come first, then ones with photos, then
 * data-file order (written best-first).
 */
export function getStaysForDestination(destinationSlug: string, limit = 4): CampLodge[] {
  const rank = (lodge: CampLodge): number | null => {
    const hub = LODGE_HUBS[lodge.hub];
    if (hub.destinations[0] === destinationSlug) return 0;
    if (lodge.destinations.includes(destinationSlug)) return 1;
    if (hub.destinations.includes(destinationSlug)) return 2;
    return null;
  };

  return campsLodges
    .map((lodge, index) => ({ lodge, index, tier: rank(lodge) }))
    .filter((e): e is { lodge: CampLodge; index: number; tier: number } => e.tier !== null)
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        Number(b.lodge.featured) - Number(a.lodge.featured) ||
        Number(a.lodge.images.length === 0) - Number(b.lodge.images.length === 0) ||
        a.index - b.index
    )
    .slice(0, limit)
    .map((e) => e.lodge);
}

export function getOtherStaysInHub(lodge: CampLodge, limit = 3): CampLodge[] {
  return campsLodges.filter((l) => l.hub === lodge.hub && l.slug !== lodge.slug).slice(0, limit);
}

/** Destinations whose pages recommend this property (direct or via its hub). */
export function getDestinationSlugsForLodge(lodge: CampLodge): string[] {
  const viaHub = LODGE_HUBS[lodge.hub].destinations;
  return [...new Set([...lodge.destinations, ...viaHub])];
}
