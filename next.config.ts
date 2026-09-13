import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
  async headers() {
    return [
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

