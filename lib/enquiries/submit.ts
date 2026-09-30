import { getAttribution, getSessionId, isTrackingEnabled } from "@/lib/analytics/track";

/**
 * Attribution sent alongside a public enquiry: which form, which page, and
 * the analytics session (so the dashboard can show the pages viewed before
 * enquiring). Session/UTM are omitted when tracking is disabled (DNT).
 */
export function enquiryAttribution(source: "modal" | "studio") {
  const base = { source, pagePath: typeof window !== "undefined" ? window.location.pathname : null };
  if (!isTrackingEnabled()) return base;
  const attr = getAttribution();
  return {
    ...base,
    sessionId: getSessionId(),
    referrerHost: attr?.referrerHost ?? null,
    utmSource: attr?.utmSource ?? null,
  };
}

/** Short, guest-facing reference for an enquiry id, e.g. "MH-3F9A2C1B". */
export function formatEnquiryRef(id: string): string {
  return `MH-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
