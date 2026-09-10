export type ItineraryStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type AvailabilityStatus = "AVAILABLE" | "LIMITED" | "FULLY_BOOKED";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface ItineraryDay {
  id?: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  accommodation: string | null;
  activities: string[];
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
  availabilityStatus: AvailabilityStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  days: ItineraryDay[];
  images: ItineraryImage[];
  destinations: ItineraryDestinationItem[];
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
