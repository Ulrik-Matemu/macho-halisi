import type {
  Destination,
  DestinationChapter,
  DestinationGalleryImage,
} from "@/data/destinations";

export interface DestinationPageData {
  regionChapters: DestinationChapter[];
  travelChapters: DestinationChapter[];
  pullQuote: string;
  diptych: [DestinationGalleryImage, DestinationGalleryImage, string];
}

/**
 * Cycles through the gallery so a chapter list never runs out of images,
 * even for destinations with fewer gallery photos than chapters.
 */
function galleryImage(destination: Destination, index: number): DestinationGalleryImage {
  const { gallery, heroImage, heroImageAlt } = destination;
  if (gallery.length === 0) return { url: heroImage, alt: heroImageAlt };
  return gallery[index % gallery.length];
}

/**
 * Derives the "in three parts" region chapters from prose already on file
 * (lead paragraph + body paragraphs) for destinations that don't have
 * bespoke chapters authored. Keeps every destination page fully populated
 * without hand-writing scrollytelling copy for all ~29 entries.
 */
function deriveRegionChapters(destination: Destination): DestinationChapter[] {
  const texts = [
    destination.leadParagraph,
    destination.bodyParagraphs[0],
    destination.bodyParagraphs[1] ?? destination.highlights[0]?.description,
  ].filter((text): text is string => Boolean(text));

  return texts.slice(0, 3).map((text, idx) => ({
    title: idx === 0 ? "First impressions" : idx === 1 ? "What defines it" : "Further in",
    text,
    image: galleryImage(destination, idx),
  }));
}

/**
 * Derives the "how it is travelled" chapters from quick facts, since those
 * already carry the getting-there / altitude / airstrip information most
 * destinations need for a generic travel-logistics chapter set.
 */
function deriveTravelChapters(destination: Destination): DestinationChapter[] {
  const gettingThere = destination.quickFacts.find((f) => /getting there/i.test(f.label));
  const airstrip = destination.quickFacts.find((f) => /airstrip/i.test(f.label));
  const altitude = destination.quickFacts.find((f) => /altitude/i.test(f.label));

  const chapters: DestinationChapter[] = [
    {
      title: "Where you sleep",
      text: `Camps and lodges in ${destination.region} range from mobile tented options to permanent lodges — the right choice depends on when you travel and which part of ${destination.name} you want as your base.`,
      image: galleryImage(destination, 0),
    },
  ];

  if (gettingThere) {
    chapters.push({
      title: "Getting there",
      text: `${gettingThere.value}. A private guide plans each day around the ground conditions and what is currently moving, not a fixed itinerary.`,
      image: galleryImage(destination, 1),
    });
  }

  chapters.push({
    title: "Getting around",
    text: airstrip
      ? `Light aircraft connect the main airstrips — ${airstrip.value} — cutting hours of driving down to a short hop between sectors.`
      : altitude
        ? `${destination.name} sits at ${altitude.value}, and your guide moves you between vantage points by private vehicle through the day.`
        : `A private vehicle and guide move you through ${destination.name} at your own pace, day by day.`,
    image: galleryImage(destination, 2),
  });

  return chapters;
}

function deriveDiptych(destination: Destination): [DestinationGalleryImage, DestinationGalleryImage, string] {
  const left = galleryImage(destination, 1);
  const right = galleryImage(destination, 2);
  return [left, right, `${destination.categoryLabel} · ${destination.region}`];
}

/**
 * Single entry point the destination page reads from — resolves each
 * design-added field to its authored value when present, or a derived
 * fallback computed from data already on the destination, so the page
 * never has to special-case "has design content" vs. "doesn't".
 */
export function getDestinationPageData(destination: Destination): DestinationPageData {
  return {
    regionChapters:
      destination.regionChapters && destination.regionChapters.length > 0
        ? destination.regionChapters
        : deriveRegionChapters(destination),
    travelChapters:
      destination.travelChapters && destination.travelChapters.length > 0
        ? destination.travelChapters
        : deriveTravelChapters(destination),
    pullQuote: destination.pullQuote ?? destination.tagline,
    diptych: destination.diptych ?? deriveDiptych(destination),
  };
}

/**
 * Splits a wildlife entry like "Lion (highest density in East Africa)"
 * into a name and a right-aligned descriptor for the wildlife row layout.
 * Entries without a trailing parenthetical render as a single string.
 */
export function parseWildlifeEntry(entry: string): { name: string; descriptor: string | null } {
  const match = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(entry);
  if (!match) return { name: entry, descriptor: null };
  return { name: match[1], descriptor: match[2] };
}
