import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. 'unsafe-inline' scripts are needed by Next's
// inline bootstrap and the JSON-LD blocks without per-request nonces (which
// would force every page to render dynamically and lose ISR); the policy
// still pins every script, frame and fetch to known origins. Mapbox needs
// blob: workers; Turnstile runs in a challenges.cloudflare.com iframe.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.mapbox.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://nominatim.openstreetmap.org https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  // Report-only while it beds in: violations show in the browser console
  // without breaking anything. Switch the key to "Content-Security-Policy"
  // once the main pages and the dashboard run clean.
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves allowlisted qualities; 85 is used by the itinerary
    // cards (visibly cleaner than the default 75 on large cover photos).
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // /public files aren't content-hashed like /_next/static, so no
  // immutable caching — but the hero videos/posters are stable enough
  // (deploy-cadence changes, not per-request) to cache for a day with
  // revalidation, instead of the framework's default of re-fetching on
  // every repeat visit.
  // Permanent (308) so search engines pass link equity to the target;
  // a page-level redirect() would only send a temporary 307.
  async redirects() {
    return [
      { source: "/journeys", destination: "/itineraries", permanent: true },
      { source: "/journeys/signature-itineraries", destination: "/itineraries", permanent: true },
      { source: "/impact", destination: "/about#impact", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Keep the admin area and the API out of search results.
      { source: "/dashboard/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/media/hero-vids/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

