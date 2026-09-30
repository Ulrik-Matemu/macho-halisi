export type RangeKey = "24h" | "7d" | "30d" | "90d";

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "24h", label: "24 hours" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

export interface OverviewMetrics {
  visitors: number;
  pageviews: number;
  sessions: number;
  bounceRate: number;
  avgSessionSeconds: number;
  pagesPerSession: number;
  enquiries: number;
  conversionRate: number;
}

export interface AnalyticsOverview {
  status: "ok";
  range: RangeKey;
  current: OverviewMetrics;
  previous: OverviewMetrics;
}

export interface TimeseriesPoint {
  bucket: string;
  pageviews: number;
  visitors: number;
  enquiries: number;
}

export type BreakdownDimension =
  | "page"
  | "entry"
  | "exit"
  | "referrer"
  | "utm_source"
  | "utm_campaign"
  | "country"
  | "city"
  | "device"
  | "browser"
  | "os"
  | "event";

export interface BreakdownRow {
  label: string;
  value: number;
  secondary: number | null;
}

export interface RealtimeSnapshot {
  activeVisitors: number;
  windowMinutes: number;
  pages: { label: string; value: number }[];
}
