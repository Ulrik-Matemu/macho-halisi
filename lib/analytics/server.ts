import { createHash } from "node:crypto";
import { geolocation, ipAddress } from "@vercel/functions";

// Server-side enrichment for analytics and enquiries: geo from Vercel's
// edge headers (null in local dev), a coarse UA breakdown, and a visitor
// hash that rotates daily. The raw IP is never stored — it is an input to
// that hash, and is passed to the backend only for enquiry rate limiting.

export interface VisitorContext {
  country: string | null;
  region: string | null;
  city: string | null;
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  visitorHash: string;
  isBot: boolean;
  /** For server-to-server rate limiting only — never stored or logged. */
  ip: string | null;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|preview|headless|lighthouse|pingdom|uptimerobot|curl|wget|python-requests|axios|node-fetch|go-http-client/i;

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function parseOs(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

function parseDevice(ua: string): VisitorContext["device"] {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile/i.test(ua)) return "mobile";
  return "desktop";
}

function dailySalt(): string {
  const secret = process.env.ANALYTICS_SALT || "macho-halisi-dev-salt";
  return `${secret}:${new Date().toISOString().slice(0, 10)}`;
}

export function getVisitorContext(request: Request): VisitorContext {
  const ua = request.headers.get("user-agent") ?? "";
  const geo = geolocation(request);
  const ip = ipAddress(request) ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const host = request.headers.get("host") ?? "";

  return {
    country: geo.country?.toUpperCase() ?? null,
    region: geo.countryRegion ?? null,
    city: geo.city ?? null,
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    os: parseOs(ua),
    visitorHash: createHash("sha256").update(`${dailySalt()}|${ip ?? "unknown"}|${ua}|${host}`).digest("hex").slice(0, 32),
    isBot: !ua || BOT_PATTERN.test(ua),
    ip,
  };
}
