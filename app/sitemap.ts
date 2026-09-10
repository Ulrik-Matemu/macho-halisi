import type { MetadataRoute } from "next";
import { getPublishedItineraries } from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { data: itineraries } = await getPublishedItineraries({ limit: 100 });

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/itineraries`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...itineraries.map((itinerary) => ({
      url: `${siteUrl}/itineraries/${itinerary.slug}`,
      lastModified: new Date(itinerary.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
