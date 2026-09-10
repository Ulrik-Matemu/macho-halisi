import { getExpressApiUrl } from "@/lib/auth/constants";
import type { AvailabilityPeriod, ItineraryDay } from "@/lib/itineraries/types";
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

/**
 * Picks the single period worth surfacing on a compact card: whichever one
 * covers `referenceDate`, or failing that the soonest upcoming one, or null
 * if every period is in the past. Periods arrive pre-sorted by startDate
 * from the backend (see availabilityPeriodsSelect in public.serializers.ts),
 * so this is a straightforward linear scan, not a sort.
 */
export function getCurrentOrUpcomingPeriod(
  periods: AvailabilityPeriod[] = [],
  referenceDate: Date = new Date()
): AvailabilityPeriod | null {
  const now = referenceDate.getTime();
  let upcoming: AvailabilityPeriod | null = null;

  for (const period of periods) {
    const start = new Date(period.startDate).getTime();
    const end = new Date(period.endDate).getTime();

    if (start <= now && now <= end) {
      return period;
    }
    if (start > now && !upcoming) {
      upcoming = period;
    }
  }

  return upcoming;
}

const AVAILABILITY_PERIOD_STATUS_LABEL: Record<AvailabilityPeriod["status"], string> = {
  AVAILABLE: "Available",
  LIMITED: "Limited",
  FULLY_BOOKED: "Fully Booked",
};

/**
 * Compact card label, e.g. "Available Jun 1 – Oct 31" — no year, unlike the
 * detail page's own full period list, which keeps its year-inclusive
 * format since it isn't fighting for space in a card.
 */
export function formatAvailabilityPeriodLabel(period: AvailabilityPeriod): string {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${AVAILABILITY_PERIOD_STATUS_LABEL[period.status]} ${formatDate(period.startDate)} – ${formatDate(period.endDate)}`;
}

/**
 * Hero stat, e.g. "Jun – Oct" — the month span covered by AVAILABLE
 * periods (earliest start through latest end). Returns null when there
 * are no AVAILABLE periods to summarize, so the hero stat is skipped
 * entirely rather than showing a misleading range built from LIMITED/
 * FULLY_BOOKED windows.
 */
export function formatBestMonths(periods: AvailabilityPeriod[] = []): string | null {
  const available = periods.filter((p) => p.status === "AVAILABLE");
  if (available.length === 0) return null;

  let earliest = available[0]!;
  let latest = available[0]!;
  for (const period of available) {
    if (new Date(period.startDate) < new Date(earliest.startDate)) earliest = period;
    if (new Date(period.endDate) > new Date(latest.endDate)) latest = period;
  }

  const monthOf = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short" });
  const startMonth = monthOf(earliest.startDate);
  const endMonth = monthOf(latest.endDate);
  return startMonth === endMonth ? startMonth : `${startMonth} – ${endMonth}`;
}

export interface AccommodationStay {
  name: string;
  nights: number;
}

/**
 * Derives an accommodation list from day.accommodation — there is no
 * dedicated accommodation model, so this collapses consecutive days that
 * share the same accommodation string into one { name, nights } entry.
 * Days with no accommodation set are skipped, not treated as a gap that
 * breaks a run (an itinerary can have a free/transit day between two
 * nights at the same camp without splitting the count).
 */
export function groupAccommodationNights(days: ItineraryDay[]): AccommodationStay[] {
  const stays: AccommodationStay[] = [];

  for (const day of days) {
    const name = day.accommodation?.trim();
    if (!name) continue;

    const last = stays[stays.length - 1];
    if (last && last.name === name) {
      last.nights += 1;
    } else {
      stays.push({ name, nights: 1 });
    }
  }

  return stays;
}
