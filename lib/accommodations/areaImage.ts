import { getDestinationBySlug } from "@/data/destinations";
import { guideForDestination } from "@/lib/seo/links";
import type { PublicAccommodationSummary } from "@/lib/public/types";

export interface AreaImage {
  url: string;
  alt: string;
  place: string;
}

// Place names that appear in a property's free-text location, mapped to the
// destination guide whose photo best represents the area.
const LOCATION_KEYWORDS: [RegExp, string][] = [
  [/karatu|ngorongoro|crater/i, "ngorongoro"],
  [/serengeti|seronera|grumeti|ndutu/i, "serengeti"],
  [/tarangire/i, "tarangire"],
  [/manyara|mto wa mbu/i, "manyara"],
  [/arusha|meru/i, "arusha"],
  [/kilimanjaro|moshi|marangu/i, "kilimanjaro"],
  [/zanzibar|stone town|nungwi|kendwa|paje/i, "zanzibar"],
  [/pemba/i, "pemba"],
  [/mafia/i, "mafia"],
  [/ruaha|iringa/i, "ruaha"],
  [/selous|nyerere|rufiji/i, "nyerere"],
  [/mikumi|morogoro/i, "mikumi"],
  [/katavi/i, "katavi"],
  [/mahale|gombe|kigoma|tanganyika/i, "mahale"],
  [/mwanza|victoria|rubondo/i, "lake-victoria"],
];

/**
 * A photo of the area a property serves, for accommodations that have no
 * images of their own yet, so a catalogue card never renders empty.
 */
export function areaImageFor(
  accommodation: Pick<PublicAccommodationSummary, "name" | "locationText" | "destination">
): AreaImage | undefined {
  const guide =
    (accommodation.destination ? guideForDestination(accommodation.destination) : undefined) ??
    (() => {
      const hit = LOCATION_KEYWORDS.find(([re]) => re.test(accommodation.locationText));
      return hit ? getDestinationBySlug(hit[1]) : undefined;
    })();
  if (!guide) return undefined;
  return {
    url: guide.heroImage,
    place: guide.name,
    alt: `The ${guide.name} area, near ${accommodation.name}`,
  };
}
