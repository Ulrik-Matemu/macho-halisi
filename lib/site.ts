/** The public site's canonical URL, used by sitemap.ts, robots.ts, and Open Graph metadata. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
