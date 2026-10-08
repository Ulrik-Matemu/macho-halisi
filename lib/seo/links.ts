import { destinations, getDestinationBySlug, type Destination } from "@/data/destinations";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/national park|conservation area|archipelago|mount|\(.*?\)/g, "")
    .replace(/[^a-z]+/g, " ")
    .trim();

/**
 * The editorial /destinations page for a backend destination (itinerary
 * stops, lodge locations). The CMS and the editorial guides are separate
 * catalogues, so match on slug first, then on the core place name
 * ("Serengeti" ↔ "Serengeti National Park"). Returns undefined when there
 * is no guide to link to.
 */
export function guideForDestination(dest: { name: string; slug?: string }): Destination | undefined {
  if (dest.slug) {
    const bySlug = getDestinationBySlug(dest.slug);
    if (bySlug) return bySlug;
  }
  const key = norm(dest.name);
  if (!key) return undefined;
  return destinations.find((d) => norm(d.name) === key || norm(d.slug) === key);
}
