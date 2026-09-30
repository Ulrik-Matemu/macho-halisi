import { ItineraryStatus, Destination, UserSummary, GalleryImageStatus } from "@/lib/itineraries/types";

// Accommodations reuse the itinerary publishing lifecycle (see the backend
// Accommodation model, which uses ItineraryStatus), so the status union is
// imported rather than redefined.
export type { ItineraryStatus } from "@/lib/itineraries/types";

export type AccommodationType =
  | "HOTEL"
  | "LODGE"
  | "TENTED_CAMP"
  | "CAMP"
  | "HOSTEL"
  | "GUESTHOUSE"
  | "VILLA"
  | "RESORT";

export type ServiceTier = "BUDGET" | "MID_RANGE" | "PREMIUM" | "LUXURY";

export const ACCOMMODATION_TYPE_LABELS: Record<AccommodationType, string> = {
  HOTEL: "Hotel",
  LODGE: "Lodge",
  TENTED_CAMP: "Tented Camp",
  CAMP: "Camp",
  HOSTEL: "Hostel",
  GUESTHOUSE: "Guesthouse",
  VILLA: "Villa",
  RESORT: "Resort",
};

export const SERVICE_TIER_LABELS: Record<ServiceTier, string> = {
  BUDGET: "Budget",
  MID_RANGE: "Mid-range",
  PREMIUM: "Premium",
  LUXURY: "Luxury",
};

export type { GalleryImageStatus } from "@/lib/itineraries/types";

export interface AccommodationImage {
  id: string;
  url: string;
  cloudinaryPublicId?: string | null;
  sortOrder: number;
  altText?: string | null;
  createdAt?: string;
  // See ItineraryImage — same review-gate staging model.
  status?: GalleryImageStatus;
  pendingSortOrder?: number | null;
  pendingAltText?: string | null;
}

export function effectiveSortOrder(img: AccommodationImage): number {
  return img.pendingSortOrder ?? img.sortOrder;
}
export function effectiveAltText(img: AccommodationImage): string {
  return img.pendingAltText ?? img.altText ?? "";
}
export function hasPendingImageChange(img: AccommodationImage): boolean {
  return Boolean(img.status && img.status !== "LIVE") || img.pendingSortOrder != null || img.pendingAltText != null;
}

export interface AccommodationSummary {
  id: string;
  name: string;
  slug: string;
  status: ItineraryStatus;
  type: AccommodationType;
  serviceTier: ServiceTier;
  starRating: number | null;
  locationText: string;
  pricePerNight: number | string | null;
  priceOnRequest: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface AccommodationDetail {
  id: string;
  name: string;
  slug: string;
  status: ItineraryStatus;
  authorId?: string;
  editorId?: string | null;
  type: AccommodationType;
  serviceTier: ServiceTier;
  starRating: number | null;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  amenities: string[];
  pricePerNight: number | string | null;
  priceOnRequest: boolean;
  destinationId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: AccommodationImage[];
  heroImageId?: string | null;
  heroImage?: AccommodationImage | null;
  destination: Destination | null;
  author?: UserSummary;
  editor?: UserSummary;
}

export interface PaginatedAccommodations {
  status: "ok";
  data: AccommodationSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
