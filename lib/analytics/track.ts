/**
 * Browser side of the self-hosted analytics. Cookieless: the only state is
 * a random session id in sessionStorage (gone when the tab closes, rolled
 * over after 30 min idle). Events queue in memory and flush in small
 * batches to /api/track, which adds geo + a daily-rotating visitor hash
 * server-side and forwards to the backend.
 *
 * Every export is a safe no-op on the server, on /dashboard, on localhost
 * (unless NEXT_PUBLIC_ANALYTICS_DEV=1) and for Do-Not-Track visitors.
 */

export type ClientEventType = "PAGEVIEW" | "EVENT" | "WEB_VITAL" | "JS_ERROR" | "PAGE_LEAVE";

export interface ClientEvent {
  type: ClientEventType;
  path: string;
  name?: string;
  value?: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface Attribution {
  referrer: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

const SESSION_KEY = "mh_sid";
const SESSION_SEEN_KEY = "mh_sid_seen";
const ATTRIBUTION_KEY = "mh_attr";
const SESSION_IDLE_MS = 30 * 60 * 1000;
const FLUSH_INTERVAL_MS = 5000;
const MAX_BATCH = 10;
const ENDPOINT = "/api/track";

const queue: ClientEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isNewSession = false;

export function isTrackingEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/dashboard")) return false;
  if (navigator.doNotTrack === "1") return false;
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  if (isLocal && process.env.NEXT_PUBLIC_ANALYTICS_DEV !== "1") return false;
  return true;
}

function safeSession(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Current session id, rolling a new one after 30 min idle. Also exported
 * for the enquiry forms, so an enquiry can be tied back to the pages its
 * visitor viewed.
 */
export function getSessionId(): string {
  const store = safeSession();
  const now = Date.now();
  let sid = store?.getItem(SESSION_KEY) ?? null;
  const lastSeen = Number(store?.getItem(SESSION_SEEN_KEY) ?? 0);

  if (!sid || now - lastSeen > SESSION_IDLE_MS) {
    sid = randomId();
    isNewSession = true;
    store?.setItem(SESSION_KEY, sid);
    store?.setItem(ATTRIBUTION_KEY, JSON.stringify(captureAttribution()));
  }
  store?.setItem(SESSION_SEEN_KEY, String(now));
  return sid;
}

function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  let referrer: string | null = document.referrer || null;
  let referrerHost: string | null = null;
  if (referrer) {
    try {
      referrerHost = new URL(referrer).hostname.replace(/^www\./, "");
      // Internal navigation is not a traffic source.
      if (referrerHost === window.location.hostname.replace(/^www\./, "")) {
        referrer = null;
        referrerHost = null;
      }
    } catch {
      referrer = null;
    }
  }
  return {
    referrer,
    referrerHost,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

/** Where this session came from — captured once, at session start. */
export function getAttribution(): Attribution | null {
  const raw = safeSession()?.getItem(ATTRIBUTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

function send(events: ClientEvent[]) {
  const body = JSON.stringify({ sessionId: getSessionId(), events });
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
  } catch {
    // Fall through to fetch.
  }
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never surface an error to the visitor.
  });
}

export function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  while (queue.length) send(queue.splice(0, MAX_BATCH));
}

function enqueue(event: ClientEvent) {
  if (!isTrackingEnabled()) return;
  queue.push(event);
  if (queue.length >= MAX_BATCH) flush();
  else if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS);
}

/** Records a pageview. Referrer/UTM ride only on a session's first hit. */
export function trackPageview(path: string) {
  if (!isTrackingEnabled()) return;
  getSessionId();
  const event: ClientEvent = { type: "PAGEVIEW", path };
  if (isNewSession) {
    isNewSession = false;
    const attr = getAttribution();
    if (attr) {
      event.referrer = attr.referrer ?? undefined;
      event.utmSource = attr.utmSource ?? undefined;
      event.utmMedium = attr.utmMedium ?? undefined;
      event.utmCampaign = attr.utmCampaign ?? undefined;
    }
  }
  enqueue(event);
}

/** Records a named custom event, e.g. trackEvent("enquiry_open", { source: "navbar" }). */
export function trackEvent(name: string, metadata?: ClientEvent["metadata"]) {
  if (typeof window === "undefined") return;
  enqueue({ type: "EVENT", name, path: window.location.pathname, metadata });
}

export function trackRaw(event: ClientEvent) {
  enqueue(event);
}
