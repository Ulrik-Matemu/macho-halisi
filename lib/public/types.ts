import {
  ItineraryDay,
  ItineraryImage,
  ItineraryDestinationItem,
  AvailabilityStatus,
  ItineraryStatus,
  AvailabilityPeriod,
} from "@/lib/itineraries/types";

// Shapes returned by the backend's unauthenticated /public/* routes (see
// macho-halisi-backend src/routes/public/public.serializers.ts). These are
// deliberately their own types rather than the dashboard's
// ItinerarySummary/ItineraryDetail: the public API never returns
// authorId/editorId or the author/editor relations (staff identities), so
// those dashboard types don't actually describe this payload — they'd
// require faking values for fields that are genuinely absent. Leaf shapes
// that are identical (days, gallery images, destination links) are reused
// from lib/itineraries/types.ts rather than redefined here.

export interface PublicItineraryCoverImage {
  id: string;
  url: string;
  altText: string | null;
}

export interface PublicItinerarySummary {
  id: string;
  title: string;
  slug: string;
  overview: string | null;
  nights: number | null;
  startingPrice: number | string | null;
  priceOnRequest: boolean;
  availabilityStatus: AvailabilityStatus;
  publishedAt: string | null;
  updatedAt: string;
  images: PublicItineraryCoverImage[];
  destinations: ItineraryDestinationItem[];
  // Full period list, same as PublicItineraryDetail — cards compute a
  // single "current or next" line from this via
  // getCurrentOrUpcomingPeriod() in lib/public/api.ts rather than the
  // backend precomputing and trimming it server-side.
  availabilityPeriods: AvailabilityPeriod[];
}

export interface PublicItineraryDetail {
  id: string;
  title: string;
  slug: string;
  status: ItineraryStatus;
  overview: string | null;
  nights: number | null;
  startingPrice: number | string | null;
  priceOnRequest: boolean;
  inclusions: string[];
  exclusions: string[];
  travelInfo: string | null;
  routeMapUrl: string | null;
  availabilityStatus: AvailabilityStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  days: ItineraryDay[];
  images: ItineraryImage[];
  destinations: ItineraryDestinationItem[];
  // Full period list — the detail page renders all of them, unlike cards
  // (see PublicItinerarySummary.availabilityPeriods above).
  availabilityPeriods: AvailabilityPeriod[];
}

export interface PublicPaginatedItineraries {
  status: "ok";
  data: PublicItinerarySummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
