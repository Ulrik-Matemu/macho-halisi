import { ipAddress } from "@vercel/functions";

/** The visitor's IP as seen by Vercel's edge (x-forwarded-for locally). */
export function clientIp(request: Request): string | null {
  return ipAddress(request) ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

/**
 * Headers every server-side call to the Express API carries. The API only
 * answers requests bearing ORIGIN_SECRET (see the backend's
 * requireOriginSecret middleware), and rate-limits on X-Client-IP — which
 * it trusts only alongside that secret — because every request arrives
 * from Vercel's shared IP. Omit `request` for calls with no visitor behind
 * them (build-time and ISR fetches).
 */
export function backendHeaders(request?: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  const secret = process.env.ORIGIN_SECRET;
  if (secret) headers["X-Origin-Secret"] = secret;
  const ip = request ? clientIp(request) : null;
  if (ip) headers["X-Client-IP"] = ip;
  return headers;
}
