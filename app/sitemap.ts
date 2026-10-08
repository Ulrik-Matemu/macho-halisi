import type { MetadataRoute } from "next";
import { getPublishedItineraries, getPublishedAccommodations } from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { journeyCollections } from "@/data/journeys";

// Static content changes only when the site is deployed, so its
// lastModified is the build time rather than "now" on every request — a
// constantly moving date teaches crawlers to ignore the field.
const BUILT_AT = new Date();

const STATIC_PAGES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/itineraries", changeFrequency: "daily", priority: 0.9 },
  { path: "/destinations", changeFrequency: "weekly", priority: 0.9 },
  { path: "/experiences", changeFrequency: "weekly", priority: 0.9 },
  { path: "/accommodations", changeFrequency: "weekly", priority: 0.8 },
  { path: "/when-to-travel", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-we-plan", changeFrequency: "monthly", priority: 0.7 },
  { path: "/travel-information", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/enquire", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  // Image entries must be absolute; local /media files get the site origin.
  // Next writes these into the XML verbatim, so the `&` in Unsplash/CDN
  // query strings must be escaped or the whole sitemap becomes invalid XML.
  const abs = (src: string) => (src.startsWith("http") ? src : `${siteUrl}${src}`).replace(/&/g, "&amp;");
  const [{ data: itineraries }, { data: accommodations }] = await Promise.all([
    getPublishedItineraries({ limit: 100 }),
    getPublishedAccommodations({ limit: 100 }),
  ]);

  return [
    ...STATIC_PAGES.map((p) => ({ url: `${siteUrl}${p.path}`, lastModified: BUILT_AT, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...itineraries.map((itinerary) => ({
      url: `${siteUrl}/itineraries/${itinerary.slug}`,
      lastModified: new Date(itinerary.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [itinerary.heroImage, ...itinerary.images].filter(Boolean).slice(0, 5).map((img) => abs(img!.url)),
    })),
    ...destinations.map((destination) => ({
      url: `${siteUrl}/destinations/${destination.slug}`,
      lastModified: BUILT_AT,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [destination.heroImage, ...destination.gallery.map((g) => g.url)].filter(Boolean).slice(0, 5).map(abs),
    })),
    ...experiences.map((experience) => ({
      url: `${siteUrl}/experiences/${experience.slug}`,
      lastModified: BUILT_AT,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: experience.heroImage ? [abs(experience.heroImage)] : undefined,
    })),
    ...journeyCollections.map((collection) => ({
      url: `${siteUrl}/journeys/${collection.slug}`,
      lastModified: BUILT_AT,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...accommodations.map((accommodation) => ({
      url: `${siteUrl}/accommodations/${accommodation.slug}`,
      lastModified: new Date(accommodation.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [accommodation.heroImage, ...accommodation.images].filter(Boolean).slice(0, 5).map((img) => abs(img!.url)),
    })),
  ];
}
