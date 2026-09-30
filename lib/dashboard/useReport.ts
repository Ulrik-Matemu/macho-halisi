"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ReportState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
}

/**
 * Fetches one dashboard report endpoint (the backend's `{ status: "ok", ... }`
 * envelope), refetching when `url` changes and optionally polling. Keeps the
 * last good data on screen while a refresh is in flight or fails, so charts
 * don't flash empty on every poll.
 */
export function useReport<T>(url: string | null, pollMs?: number): ReportState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [nonce, setNonce] = useState(0);
  const lastUrl = useRef<string | null>(null);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const load = async () => {
      if (lastUrl.current !== url) {
        setLoading(true);
        lastUrl.current = url;
      }
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.status === "ok") {
          setData(json as T);
          setError(null);
        } else {
          setError(json.message || `Request failed (HTTP ${res.status})`);
        }
      } catch {
        if (!cancelled) setError("Network error while connecting to server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const timer = pollMs ? setInterval(load, pollMs) : null;
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [url, pollMs, nonce]);

  return { data, error, loading, reload };
}
