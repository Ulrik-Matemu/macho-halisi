/**
 * Client-supplied trust content. Everything here is a placeholder awaiting
 * real material from the client — TrustBand renders each block ONLY when its
 * array is non-empty, so nothing fabricated ever reaches the public site.
 *
 * Website feedback (Oct 2026) asked for: guest reviews, guide profiles,
 * vehicle photos, licences and memberships.
 */

export interface GuestReview {
  quote: string;
  name: string;
  /** e.g. "Boston, USA · Aug 2026" */
  origin: string;
  /** Optional link to the review on TripAdvisor / Google etc. */
  sourceUrl?: string;
}

export interface GuideProfile {
  name: string;
  /** e.g. "Senior driver-guide · 12 years" */
  role: string;
  bio: string;
  photo: { url: string; alt: string };
}

export interface VehiclePhoto {
  url: string;
  alt: string;
}

// TODO(client): real guest reviews (with permission to publish).
export const guestReviews: GuestReview[] = [];

// TODO(client): guide names, roles, short bios and portrait photos.
export const guideProfiles: GuideProfile[] = [];

// TODO(client): vehicle photos (exterior, interior, pop-up roof).
export const vehiclePhotos: VehiclePhoto[] = [];

// Licence number and memberships live in SITE.licences (lib/site.ts):
// TODO(client): Tanzania Tourism Licence number, TATO membership.

/** Facts already supplied by the client (About Us text). */
export const trustFacts = [
  { value: "17+", label: "Years guiding in Tanzania" },
  { value: "20", label: "Custom-built safari vehicles" },
  { value: "100%", label: "Tanzanian owned & led" },
  { value: "24h", label: "Reply time on every enquiry" },
];

export const safetyPoints = [
  "Tour operator insurance and passenger liability coverage",
  "Reliable, well-maintained vehicles and trusted partners",
  "Flying Doctors emergency evacuation support at minimal extra cost",
];
