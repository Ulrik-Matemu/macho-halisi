"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ChartType = "line" | "dotted" | "bar" | "pie";
/** Anything drawn over time: every type except pie. */
export type TrendType = Exclude<ChartType, "pie">;

export const CHART_TYPES: { key: ChartType; label: string }[] = [
  { key: "line", label: "Line" },
  { key: "dotted", label: "Dotted line" },
  { key: "bar", label: "Bar" },
  { key: "pie", label: "Pie" },
];

/** Over time: a pie of days or averaged latencies means nothing, so no pie. */
export const TREND_TYPES: TrendType[] = ["line", "dotted", "bar"];
/** Few parts of a whole (devices, browsers, statuses): bar or pie. */
export const SHARE_TYPES: ChartType[] = ["bar", "pie"];

const KEY_PREFIX = "mh-dash-chart:";
const CHANGE_EVENT = "mh-dash-chart-change";
// Fallback when storage is unavailable, so the toggle still works this visit.
const memory = new Map<string, ChartType>();

function isChartType(v: unknown): v is ChartType {
  return v === "line" || v === "dotted" || v === "bar" || v === "pie";
}

/** Reads a stored chart choice; storage can be missing or throw (private mode). */
export function readChartType<T extends ChartType>(id: string, fallback: T, allowed?: readonly T[]): T {
  const ok = (v: unknown): v is T => isChartType(v) && (!allowed || (allowed as readonly ChartType[]).includes(v));
  try {
    const v = window.localStorage.getItem(KEY_PREFIX + id);
    if (ok(v)) return v;
  } catch {
    // fall through to the in-memory choice
  }
  const m = memory.get(id);
  return ok(m) ? m : fallback;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Per-viewer chart type for one chart, remembered in localStorage. The
 * server snapshot is the default so SSR and first paint agree; the stored
 * choice takes over once hydrated.
 */
export function useChartType<T extends ChartType>(id: string, fallback: T, allowed?: readonly T[]): [T, (t: T) => void] {
  const type = useSyncExternalStore(
    subscribe,
    () => readChartType(id, fallback, allowed),
    () => fallback
  );

  const setType = useCallback(
    (t: T) => {
      memory.set(id, t);
      try {
        window.localStorage.setItem(KEY_PREFIX + id, t);
      } catch {
        // Not persisted across visits; the in-memory copy still applies.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [id]
  );

  return [type, setType];
}
