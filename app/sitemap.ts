import type { MetadataRoute } from "next";
import { getPublishedItineraries, getPublishedAccommodations } from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { journeyCollections } from "@/data/journeys";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [{ data: itineraries }, { data: accommodations }] = await Promise.all([
    getPublishedItineraries({ limit: 100 }),
    getPublishedAccommodations({ limit: 50 }),
  ]);

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
    {
      url: `${siteUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...destinations.map((destination) => ({
      url: `${siteUrl}/destinations/${destination.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...experiences.map((experience) => ({
      url: `${siteUrl}/experiences/${experience.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...journeyCollections.map((collection) => ({
      url: `${siteUrl}/journeys/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/accommodations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...accommodations.map((accommodation) => ({
      url: `${siteUrl}/accommodations/${accommodation.slug}`,
      lastModified: new Date(accommodation.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
