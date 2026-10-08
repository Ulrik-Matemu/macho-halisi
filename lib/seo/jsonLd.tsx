import { getSiteUrl, SITE } from "@/lib/site";
import type { PublicAccommodationDetail, PublicItineraryDetail } from "@/lib/public/types";
import type { AccommodationType } from "@/lib/accommodations/types";
import type { AvailabilityStatus } from "@/lib/itineraries/types";
import { clip } from "./text";

/**
 * schema.org JSON-LD builders. The organization is described once (in the
 * root layout) under a stable @id; every other block points at it by
 * reference instead of repeating it, which is how search engines and AI
 * crawlers tie trips, lodges and FAQs back to one business.
 */
type Json = Record<string, unknown>;

export const orgId = () => `${getSiteUrl()}/#organization`;
export const orgRef = () => ({ "@id": orgId() });
const abs = (path: string) => (path.startsWith("http") ? path : `${getSiteUrl()}${path}`);

/** Renders one or more JSON-LD blocks. `<` is escaped so text can't close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organization(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": orgId(),
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: "Macho Halisi Safaris",
    description: SITE.description,
    slogan: "Your eyes on Tanzania",
    url: getSiteUrl(),
    logo: abs(SITE.logoPath),
    image: abs(SITE.logoPath),
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: { "@type": "Country", name: "Tanzania" },
    founder: { "@type": "Person", name: SITE.founder },
    foundingLocation: { "@type": "Place", name: SITE.foundingLocation },
    knowsAbout: [
      "Tanzania safaris",
      "Great Wildebeest Migration",
      "Serengeti National Park",
      "Ngorongoro Crater",
      "Tarangire National Park",
      "Mount Kilimanjaro climbs",
      "Zanzibar beach holidays",
      "Ruaha and Nyerere (Selous) safaris",
      "Walking safaris",
      "Hot-air balloon safaris",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: SITE.phone,
      email: SITE.email,
      availableLanguage: ["English", "Swahili"],
    },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function website(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    url: getSiteUrl(),
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en",
    publisher: orgRef(),
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. "/destinations/serengeti". */
  path: string;
}

export function breadcrumbs(items: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** A collection page's contents, in display order. */
export function itemList(name: string, items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
  };
}

export function faqPage(faqs: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

const AVAILABILITY: Record<AvailabilityStatus, string> = {
  AVAILABLE: "https://schema.org/InStock",
  LIMITED: "https://schema.org/LimitedAvailability",
  FULLY_BOOKED: "https://schema.org/SoldOut",
};

const toNumber = (v: number | string | null) => {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
};

export function itineraryTrip(it: PublicItineraryDetail): Json {
  const url = abs(`/itineraries/${it.slug}`);
  const images = [it.heroImage, ...it.images].filter(Boolean).map((img) => img!.url);
  const price = it.priceOnRequest ? null : toNumber(it.startingPrice);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: it.title,
    url,
    description: it.overview ? clip(it.overview, 500) : undefined,
    image: [...new Set(images)].slice(0, 6),
    touristType: ["Wildlife safari", "Private safari"],
    provider: orgRef(),
    ...(it.nights !== null ? { duration: `P${it.nights + 1}D` } : {}),
    ...(it.destinations.length
      ? {
          subjectOf: it.destinations.map((d) => ({ "@type": "TouristDestination", name: d.destination.name })),
        }
      : {}),
    ...(it.days.length
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: it.days.length,
            itemListElement: it.days.map((d) => ({
              "@type": "ListItem",
              position: d.dayNumber,
              name: `Day ${d.dayNumber}${d.title ? `: ${d.title}` : ""}`,
              ...(d.description ? { description: clip(d.description, 300) } : {}),
            })),
          },
        }
      : {}),
    ...(price !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            price,
            priceCurrency: "USD",
            availability: AVAILABILITY[it.availabilityStatus],
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price,
              priceCurrency: "USD",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "person" },
            },
            seller: orgRef(),
          },
        }
      : {}),
  };
}

const LODGING_TYPE: Record<AccommodationType, string> = {
  HOTEL: "Hotel",
  RESORT: "Resort",
  HOSTEL: "Hostel",
  GUESTHOUSE: "BedAndBreakfast",
  LODGE: "LodgingBusiness",
  TENTED_CAMP: "LodgingBusiness",
  CAMP: "LodgingBusiness",
  VILLA: "LodgingBusiness",
};

export function lodging(acc: PublicAccommodationDetail): Json {
  const url = abs(`/accommodations/${acc.slug}`);
  const images = [acc.heroImage, ...acc.images].filter(Boolean).map((img) => img!.url);
  const nightly = acc.priceOnRequest ? null : toNumber(acc.pricePerNight);
  return {
    "@context": "https://schema.org",
    "@type": LODGING_TYPE[acc.type],
    "@id": `${url}#lodging`,
    name: acc.name,
    url,
    description: acc.description ? clip(acc.description, 500) : undefined,
    image: [...new Set(images)].slice(0, 6),
    address: { "@type": "PostalAddress", addressLocality: acc.locationText, addressCountry: "TZ" },
    ...(acc.latitude !== null && acc.longitude !== null
      ? { geo: { "@type": "GeoCoordinates", latitude: acc.latitude, longitude: acc.longitude } }
      : {}),
    ...(acc.starRating ? { starRating: { "@type": "Rating", ratingValue: acc.starRating } } : {}),
    ...(acc.amenities.length
      ? { amenityFeature: acc.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })) }
      : {}),
    ...(nightly !== null ? { priceRange: `From US$${nightly.toLocaleString("en-US")} per night` } : {}),
    ...(acc.destination ? { containedInPlace: { "@type": "TouristDestination", name: acc.destination.name } } : {}),
  };
}
