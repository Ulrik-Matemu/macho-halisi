import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy for the whole site. Next.js injects small inline
// bootstrap scripts, and a nonce-based policy would force every page to
// render dynamically, so scripts allow 'unsafe-inline'. Everything else is
// pinned: no third-party scripts, no framing, no plugins, and network/image
// access limited to what the site actually uses (Mapbox for the maps,
// Unsplash/Cloudinary for imagery). 'unsafe-eval' and ws: are dev-only
// (React's debugging tools and hot reload).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://api.mapbox.com https://*.tiles.mapbox.com",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self' https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://nominatim.openstreetmap.org${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Legacy equivalent of frame-ancestors, for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  images: {
    // Optimised variants are re-used for 30 days instead of the default
    // few hours — the photography is static, so repeat visitors and the
    // CDN rarely need to regenerate AVIF/WebP.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
      // Site photography/video in /public isn't content-hashed, so a week
      // with background revalidation — repeat visits skip the download but
      // a replaced photo still reaches visitors within days.
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
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

