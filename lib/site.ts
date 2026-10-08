const PRODUCTION_URL = "https://machohalisi.com";

/**
 * The public site's canonical URL, used by sitemap.ts, robots.ts, JSON-LD,
 * llms.txt and Open Graph metadata. Never falls back to localhost in a
 * production build: a missing env var there would otherwise canonicalise
 * every page to http://localhost:3000 and quietly de-index the site.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") {
    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    return vercel ? `https://${vercel}` : PRODUCTION_URL;
  }
  return "http://localhost:3000";
}

/**
 * Company facts shared by structured data, the footer, llms.txt and the
 * contact buttons, so they can't drift apart.
 */
export const SITE = {
  name: "Macho Halisi",
  // As written in the booking terms (data/legalData.ts); the logo reads
  // "Macho Halisi Ltd" — TODO(client): confirm the registered name.
  legalName: "Macho Halisi Safaris Ltd",
  tagline: "Tanzania Safari & Tour Operator",
  description:
    "Macho Halisi (\"true eyes\" in Swahili) is a 100% Tanzanian-owned safari company, founded by Dawson Minja and crafting bespoke journeys for more than 14 years. Native Tanzanian guides plan and lead private safaris across the Serengeti, Ngorongoro Crater, Tarangire, Lake Manyara, Ruaha, Nyerere, Mount Kilimanjaro and Zanzibar.",
  founder: "Dawson Minja",
  foundingLocation: "Karatu, Tanzania",
  phone: "+255 754 474 792",
  phoneE164: "+255754474792",
  whatsapp: "255754474792",
  email: "info@machohalisi.com",
  address: { locality: "Karatu", region: "Arusha", country: "TZ", countryName: "Tanzania" },
  /** Typical reply time promised to guests. */
  replyPromise: "within 24 hours",
  logoPath: "/media/macho-halisi-logo-2.jpg",
  // TODO(client): add the real profile URLs (Instagram, Facebook, YouTube,
  // TripAdvisor, SafariBookings, Google Business Profile). They feed the
  // footer icons and schema.org `sameAs`; nothing renders until they exist.
  sameAs: [] as string[],
  // TODO(client): Tanzania Tourism Licence number and memberships (e.g. TATO).
  licences: [] as string[],
};

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${SITE.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
