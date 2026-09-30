"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { flush, trackEvent, trackPageview, trackRaw } from "@/lib/analytics/track";

type WebVitalMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

// Module-level so the reference never changes — useReportWebVitals would
// otherwise report duplicates on every re-render.
function reportWebVital(metric: WebVitalMetric) {
  trackRaw({
    type: "WEB_VITAL",
    name: metric.name,
    value: metric.value,
    path: window.location.pathname,
    metadata: { rating: metric.rating ?? null, navigationType: metric.navigationType ?? null },
  });
}

const MAX_ERRORS_PER_PAGE = 5;

/**
 * Public-site analytics: pageviews, engaged time, Core Web Vitals, JS
 * errors and outbound contact clicks. Mounted once in SiteChrome, so it
 * never runs on /dashboard. Renders nothing.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const pageStart = useRef<{ path: string; visibleSince: number | null; engagedMs: number } | null>(null);

  useReportWebVitals(reportWebVital);

  // Pageview + engaged time for the previous page on every route change.
  useEffect(() => {
    if (!pathname) return;

    const prev = pageStart.current;
    if (prev) {
      const engaged = prev.engagedMs + (prev.visibleSince ? Date.now() - prev.visibleSince : 0);
      trackRaw({ type: "PAGE_LEAVE", path: prev.path, value: engaged });
    }

    trackPageview(pathname);
    pageStart.current = { path: pathname, visibleSince: document.hidden ? null : Date.now(), engagedMs: 0 };
  }, [pathname]);

  // Pause engaged time while the tab is hidden; flush before the page goes.
  useEffect(() => {
    const onVisibility = () => {
      const page = pageStart.current;
      if (!page) return;
      if (document.hidden) {
        if (page.visibleSince) page.engagedMs += Date.now() - page.visibleSince;
        page.visibleSince = null;
        flush();
      } else {
        page.visibleSince = Date.now();
      }
    };
    const onPageHide = () => {
      const page = pageStart.current;
      if (page) {
        const engaged = page.engagedMs + (page.visibleSince ? Date.now() - page.visibleSince : 0);
        trackRaw({ type: "PAGE_LEAVE", path: page.path, value: engaged });
        pageStart.current = null;
      }
      flush();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  // Uncaught errors and rejections — deduplicated and capped so one broken
  // loop can't flood the table.
  useEffect(() => {
    const seen = new Set<string>();
    const report = (message: string, metadata: Record<string, string | number | null>) => {
      const key = `${window.location.pathname}|${message}`;
      if (seen.has(key) || seen.size >= MAX_ERRORS_PER_PAGE) return;
      seen.add(key);
      trackRaw({ type: "JS_ERROR", name: message.slice(0, 300), path: window.location.pathname, metadata });
    };

    const onError = (e: ErrorEvent) =>
      report(e.message || "Unknown error", {
        source: e.filename ? e.filename.slice(0, 300) : null,
        line: e.lineno ?? null,
        column: e.colno ?? null,
        stack: e.error?.stack ? String(e.error.stack).slice(0, 1000) : null,
      });
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      report(reason instanceof Error ? reason.message : String(reason ?? "Unhandled rejection"), {
        kind: "unhandledrejection",
        stack: reason instanceof Error && reason.stack ? reason.stack.slice(0, 1000) : null,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  // Outbound contact clicks (WhatsApp, email, phone) via one delegated listener.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (/wa\.me|whatsapp/i.test(href)) trackEvent("whatsapp_click");
      else if (href.startsWith("mailto:")) trackEvent("email_click");
      else if (href.startsWith("tel:")) trackEvent("phone_click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
