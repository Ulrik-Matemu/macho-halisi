// Best-effort per-IP rate limiting for the website's own public API routes,
// applied in proxy.ts. Counters live in memory, so each server instance
// counts separately and they reset on cold start — it trims scripted bursts
// before they cost a backend call or a Cloudflare verification, while the
// hard limits live in the Express API (keyed on the same visitor IP) and in
// the Vercel Firewall rules.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
}

/** Counts one hit; returns seconds until reset when over the limit, else null. */
export function hit(key: string, limit: number, windowMs: number): number | null {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  bucket.count += 1;
  return bucket.count > limit ? Math.ceil((bucket.resetAt - now) / 1000) : null;
}
