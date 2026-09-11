export type ItineraryStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type AvailabilityStatus = "AVAILABLE" | "LIMITED" | "FULLY_BOOKED";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
  blurb?: string | null;
  createdAt?: string;
}

export interface ItineraryDay {
  id?: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  accommodation: string | null;
  activities: string[];
  // This day's own map pin, falling back to its destination's coordinates
  // (see getItineraryMapPins in lib/public/api.ts) when unset.
  latitude?: number | null;
  longitude?: number | null;
  // References one of the itinerary's own ItineraryImage records.
  heroImageId?: string | null;
  heroImage?: ItineraryImage | null;
  // "Signature moment" flag — gives this day distinct visual treatment.
  highlight?: boolean;
}

export interface ItineraryImage {
  id: string;
  url: string;
  cloudinaryPublicId?: string | null;
  sortOrder: number;
  altText?: string | null;
  createdAt?: string;
}

export interface ItineraryDestinationItem {
  destinationId?: string;
  destination: Destination;
}

/**
 * Seasonal / date-based availability detail — distinct from
 * Itinerary.availabilityStatus, which remains the single, manually set
 * badge shown on cards and the detail-page sidebar. Periods are
 * supplementary calendar detail (e.g. "Jun 1 - Oct 31: Available - peak
 * migration season") managed as their own resource via dedicated
 * POST/PATCH/DELETE endpoints, not part of the itinerary's autosave PUT.
 */
export interface AvailabilityPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: AvailabilityStatus;
  note?: string | null;
}

export interface UserSummary {
  id: string;
  email: string;
  role: string;
}

export interface ItinerarySummary {
  id: string;
  title: string;
  slug: string;
  status: ItineraryStatus;
  nights: number | null;
  startingPrice: number | string | null;
  priceOnRequest: boolean;
  availabilityStatus: AvailabilityStatus;
  publishedAt: string | null;
  updatedAt: string;
}

export interface ItineraryDetail {
  id: string;
  title: string;
  slug: string;
  status: ItineraryStatus;
  authorId: string;
  editorId: string | null;
  overview: string | null;
  nights: number | null;
  startingPrice: number | string | null;
  priceOnRequest: boolean;
  inclusions: string[];
  exclusions: string[];
  travelInfo: string | null;
  routeMapUrl: string | null;
  showRouteMap: boolean;
  availabilityStatus: AvailabilityStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  days: ItineraryDay[];
  images: ItineraryImage[];
  destinations: ItineraryDestinationItem[];
  availabilityPeriods?: AvailabilityPeriod[];
  author?: UserSummary;
  editor?: UserSummary;
}

export interface PaginatedItineraries {
  status: "ok";
  data: ItinerarySummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
