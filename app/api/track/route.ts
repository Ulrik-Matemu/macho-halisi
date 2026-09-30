import { NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";
import { getVisitorContext } from "@/lib/analytics/server";

// Public analytics beacon endpoint. Enriches the browser's events with geo,
// device and a daily visitor hash, then forwards them to the backend with
// the shared ingest secret. Always answers 204 — the tracker is
// fire-and-forget and must never surface an error to a visitor.

const EVENT_TYPES = new Set(["PAGEVIEW", "EVENT", "WEB_VITAL", "JS_ERROR", "PAGE_LEAVE"]);
const MAX_EVENTS = 20;

const noContent = () => new NextResponse(null, { status: 204 });

function str(value: unknown, max: number): string | null {
  return typeof value === "string" && value.length > 0 ? value.slice(0, max) : null;
}

function refHost(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.ANALYTICS_INGEST_SECRET;
  if (!secret) return noContent();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noContent();
  }

  const { sessionId, events } = (body ?? {}) as { sessionId?: unknown; events?: unknown };
  const sid = str(sessionId, 64);
  if (!sid || sid.length < 8 || !Array.isArray(events) || events.length === 0) return noContent();

  const visitor = getVisitorContext(request);
  if (visitor.isBot) return noContent();

  const enriched = events
    .slice(0, MAX_EVENTS)
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object" && EVENT_TYPES.has((e as { type?: string }).type ?? ""))
    .map((e) => {
      const path = str(e.path, 500);
      if (!path || !path.startsWith("/") || path.startsWith("/dashboard")) return null;
      const referrer = str(e.referrer, 1000);
      const value = typeof e.value === "number" && Number.isFinite(e.value) ? e.value : null;
      const metadata =
        e.metadata && typeof e.metadata === "object" && !Array.isArray(e.metadata) && JSON.stringify(e.metadata).length <= 2000
          ? e.metadata
          : null;
      return {
        type: e.type,
        name: str(e.name, 300),
        path,
        referrer,
        referrerHost: refHost(referrer),
        utmSource: str(e.utmSource, 100),
        utmMedium: str(e.utmMedium, 100),
        utmCampaign: str(e.utmCampaign, 100),
        country: visitor.country,
        region: visitor.region,
        city: visitor.city,
        device: visitor.device,
        browser: visitor.browser,
        os: visitor.os,
        visitorHash: visitor.visitorHash,
        sessionId: sid,
        value,
        metadata,
      };
    })
    .filter(Boolean);

  if (enriched.length === 0) return noContent();

  try {
    const res = await fetch(`${getExpressApiUrl()}/analytics/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Ingest-Secret": secret },
      body: JSON.stringify({ events: enriched }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 429) {
      console.error(`Analytics ingest failed: HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Analytics ingest unreachable:", err);
  }

  return noContent();
}
