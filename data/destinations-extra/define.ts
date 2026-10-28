import type {
  Destination,
  DestinationBestTimeEntry,
  DestinationCategory,
} from "@/data/destinations";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
export type Month = (typeof MONTHS)[number];

const CATEGORY_LABELS: Record<DestinationCategory, string> = {
  "national-park": "National Park",
  "conservation-area": "Conservation Area",
  "game-reserve": "Game Reserve",
  mountain: "Mountain",
  lake: "Lake & Water Body",
  "historic-site": "Historic Site",
  "natural-wonder": "Natural Wonder",
  island: "Island",
};

/**
 * Compact authoring shape for the destinations added after the original
 * hand-built guides. Expanded into a full Destination by `defineDestination`
 * so every entry still satisfies the same page contract.
 *
 * Images live at /media/destinations/<slug>/hero.jpg and gallery-N.jpg;
 * `imageAlts[0]` describes the hero and the rest the gallery, in order.
 */
export interface DestinationSpec {
  slug: string;
  name: string;
  category: DestinationCategory;
  region: string;
  tagline: string;
  lead: string;
  body: string[];
  facts: [label: string, value: string][];
  highlights: [title: string, description: string][];
  wildlife?: string[];
  activitiesHeading?: string;
  activities: string[];
  season: {
    peak: Month[];
    good: Month[];
    peakNote: string;
    goodNote: string;
    lowNote: string;
  };
  location: [lat: number, lng: number, zoom: number];
  faqs: [question: string, answer: string][];
  seo: string;
  related: string[];
  imageAlts: string[];
}

export function defineDestination(spec: DestinationSpec): Destination {
  const dir = `/media/destinations/${spec.slug}`;
  const [heroAlt, ...galleryAlts] = spec.imageAlts;

  const bestTimeToVisit: DestinationBestTimeEntry[] = MONTHS.map((month) => {
    if (spec.season.peak.includes(month)) return { month, note: spec.season.peakNote, rating: "peak" };
    if (spec.season.good.includes(month)) return { month, note: spec.season.goodNote, rating: "good" };
    return { month, note: spec.season.lowNote, rating: "low" };
  });

  return {
    slug: spec.slug,
    name: spec.name,
    category: spec.category,
    categoryLabel: CATEGORY_LABELS[spec.category],
    region: spec.region,
    tagline: spec.tagline,
    heroImage: `${dir}/hero.jpg`,
    heroImageAlt: heroAlt,
    gallery: galleryAlts.map((alt, i) => ({ url: `${dir}/gallery-${i + 1}.jpg`, alt })),
    leadParagraph: spec.lead,
    bodyParagraphs: spec.body,
    quickFacts: spec.facts.map(([label, value]) => ({ label, value })),
    highlights: spec.highlights.map(([title, description]) => ({ title, description })),
    wildlife: spec.wildlife,
    activitiesHeading: spec.activitiesHeading ?? "Activities",
    activities: spec.activities,
    bestTimeToVisit,
    location: { lat: spec.location[0], lng: spec.location[1], zoom: spec.location[2] },
    faqs: spec.faqs.map(([question, answer]) => ({ question, answer })),
    seoDescription: spec.seo,
    relatedSlugs: spec.related,
  };
}
