import type { ChartType } from "@/lib/dashboard/useChartType";
import type { ReportSpec, Section } from "@/lib/dashboard/export/types";
import type { RangeKey } from "@/lib/analytics/types";

/** What a chart can become in an export: any on-screen type, or just its table. */
export type ExportChartChoice = ChartType | "table";

export interface ReportOption {
  id: string;
  label: string;
  /** "chart" options get a type picker; "section" options are on/off only. */
  kind: "chart" | "section";
  defaultOn: boolean;
  /** useChartType key, so the export defaults to what's on screen. */
  chartId?: string;
  defaultChartType?: ChartType;
  /** Types that suit this data; "Table only" is always offered as well. */
  chartTypes?: ChartType[];
}

export interface ReportChoices {
  include: Set<string>;
  chartTypes: Record<string, ExportChartChoice>;
  columns: Set<string>;
}

/**
 * Everything the export dialog needs: the toggles it shows, and a build
 * step that fetches fresh data and returns the report spec for those
 * choices.
 */
export interface ReportDefinition {
  title: string;
  description: string;
  options: ReportOption[];
  columns?: { key: string; label: string; defaultOn: boolean }[];
  orientationHint?: ReportSpec["orientation"];
  build: (choices: ReportChoices) => Promise<ReportSpec>;
}

export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== "ok") throw new Error(json.message || `Request failed (HTTP ${res.status})`);
  return json as T;
}

const RANGE_MS: Record<RangeKey, number> = { "24h": 864e5, "7d": 7 * 864e5, "30d": 30 * 864e5, "90d": 90 * 864e5 };
const RANGE_TEXT: Record<RangeKey, string> = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };

export function periodText(range: RangeKey, now = new Date()): string {
  const from = new Date(now.getTime() - RANGE_MS[range]);
  const d = (x: Date) => x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${RANGE_TEXT[range]}  ·  ${d(from)} – ${d(now)}`;
}

/**
 * Turns a chart section into what the user picked: the same chart in
 * another type, or a plain table of its data.
 */
export function applyChartChoice(section: Extract<Section, { kind: "chart" }>, choice: ExportChartChoice | undefined): Section {
  if (!choice || choice !== "table") return { ...section, chartType: choice ?? section.chartType };
  const { data } = section;
  if (data.kind === "category") {
    return {
      kind: "table",
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      half: section.half,
      columns: [{ header: "Item", width: 3 }, { header: "Value", format: section.format }],
      rows: data.rows.map((r) => [r.label, r.value]),
    };
  }
  return {
    kind: "table",
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    columns: [{ header: "Period", width: 2 }, ...data.series.map((s) => ({ header: s.label, format: section.format }))],
    rows: data.x.map((_, i) => [data.xLabels[i], ...data.series.map((s) => s.values[i])]),
  };
}

/** Reports use British dates throughout, matching the letterhead. */
export const gbDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const pctChange = (cur: number, prev: number | undefined): string | undefined => {
  if (prev === undefined) return undefined;
  if (prev === 0) return cur === 0 ? "±0%" : "new";
  const c = (cur - prev) / prev;
  return `${c > 0 ? "+" : ""}${(c * 100).toFixed(0)}% vs prev.`;
};
