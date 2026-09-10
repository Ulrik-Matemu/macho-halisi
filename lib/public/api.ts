import { getExpressApiUrl } from "@/lib/auth/constants";
import type { PublicItineraryDetail, PublicPaginatedItineraries } from "./types";

// Tag used to invalidate every public itinerary fetch at once — see
// revalidateTag(ITINERARIES_TAG) in the dashboard's publish/archive/delete
// route handlers, which is what makes a publish show up on the public site
// without waiting out the full revalidate window below.
export const ITINERARIES_TAG = "itineraries";

const EMPTY_RESULT: PublicPaginatedItineraries = {
  status: "ok",
  data: [],
  pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
};

async function publicFetch<T>(path: string): Promise<T | null> {
  const url = `${getExpressApiUrl()}${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: [ITINERARIES_TAG] },
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`Public API request failed: ${path} -> HTTP ${res.status}`);
      }
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    // The backend being unreachable should degrade the marketing site to an
    // empty state, not crash the page — this is public, unauthenticated
    // content with no user-specific consequence to a soft failure here.
    console.error(`Public API request errored: ${path}`, err);
    return null;
  }
}

export async function getPublishedItineraries(
  params: { page?: number; limit?: number } = {}
): Promise<PublicPaginatedItineraries> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();

  const data = await publicFetch<PublicPaginatedItineraries>(
    `/public/itineraries${qs ? `?${qs}` : ""}`
  );

  return data ?? { ...EMPTY_RESULT, pagination: { ...EMPTY_RESULT.pagination, limit: params.limit ?? 12 } };
}

export async function getItineraryBySlug(slug: string): Promise<PublicItineraryDetail | null> {
  const data = await publicFetch<{ status: "ok"; itinerary: PublicItineraryDetail }>(
    `/public/itineraries/${encodeURIComponent(slug)}`
  );
  return data?.itinerary ?? null;
}

/**
 * Prisma serializes `Decimal` fields (startingPrice) as a string over JSON,
 * so this normalizes either representation into a formatted display value.
 * Returns null when there is no price to show (priceOnRequest, or unset).
 */
export function formatStartingPrice(value: number | string | null): string | null {
  if (value === null || value === undefined) return null;
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) return null;
  return numeric.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
