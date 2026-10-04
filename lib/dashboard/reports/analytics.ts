import type { AnalyticsOverview, BreakdownDimension, BreakdownRow, RangeKey, TimeseriesPoint } from "@/lib/analytics/types";
import { countryName, formatDuration, formatNumber, formatPercent } from "@/lib/dashboard/format";
import type { Section } from "@/lib/dashboard/export/types";
import { SHARE_TYPES, TREND_TYPES, type ChartType } from "@/lib/dashboard/useChartType";
import { applyChartChoice, getJson, pctChange, periodText, type ReportDefinition } from "./common";

const TOP_N = 8;

interface Breakdown {
  id: string;
  chartId: string;
  label: string;
  dimension: BreakdownDimension;
  measure: string;
  defaultOn: boolean;
  /** Ranked lists stay bars; small part-of-whole sets may also be pies. */
  types?: ChartType[];
  text?: (l: string) => string;
}

const BREAKDOWNS: Breakdown[] = [
  { id: "pages", chartId: "analytics.pages", label: "Top pages", dimension: "page", measure: "Views", defaultOn: true },
  { id: "sources", chartId: "analytics.sources", label: "Referrers", dimension: "referrer", measure: "Sessions", defaultOn: true },
  { id: "countries", chartId: "analytics.countries", label: "Countries", dimension: "country", measure: "Visitors", defaultOn: true, text: (l) => (l === "Unknown" ? l : countryName(l)) },
  { id: "devices", chartId: "analytics.devices", label: "Devices", dimension: "device", measure: "Visitors", defaultOn: true, types: SHARE_TYPES, text: (l) => l.charAt(0).toUpperCase() + l.slice(1) },
  { id: "entry", chartId: "analytics.pages", label: "Entry pages", dimension: "entry", measure: "Sessions", defaultOn: false },
  { id: "campaigns", chartId: "analytics.sources", label: "UTM sources", dimension: "utm_source", measure: "Sessions", defaultOn: false },
  { id: "cities", chartId: "analytics.cities", label: "Cities", dimension: "city", measure: "Visitors", defaultOn: false },
  { id: "browsers", chartId: "analytics.browsers", label: "Browsers", dimension: "browser", measure: "Visitors", defaultOn: false, types: SHARE_TYPES },
  { id: "os", chartId: "analytics.os", label: "Operating systems", dimension: "os", measure: "Visitors", defaultOn: false, types: SHARE_TYPES },
];

function bucketLabel(iso: string, range: RangeKey): string {
  const d = new Date(iso);
  return range === "24h"
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function analyticsReport(range: RangeKey, generatedBy?: string): ReportDefinition {
  return {
    title: "Analytics report",
    description: "Traffic, sources and audience for the selected range.",
    orientationHint: "portrait",
    options: [
      { id: "kpis", label: "Key figures", kind: "section", defaultOn: true },
      { id: "traffic", label: "Traffic over time", kind: "chart", chartId: "analytics.traffic", defaultChartType: "line", chartTypes: TREND_TYPES, defaultOn: true },
      ...BREAKDOWNS.map((b) => ({
        id: b.id,
        label: b.label,
        kind: "chart" as const,
        chartId: b.types ? b.chartId : undefined,
        defaultChartType: "bar" as const,
        chartTypes: b.types ?? (["bar"] as ChartType[]),
        defaultOn: b.defaultOn,
      })),
      { id: "funnel", label: "Enquiry funnel", kind: "chart", defaultChartType: "bar", chartTypes: ["bar"], defaultOn: true },
    ],
    async build({ include, chartTypes }) {
      const q = `range=${range}`;
      const breakdown = (dim: BreakdownDimension, limit = TOP_N) =>
        getJson<{ data: BreakdownRow[] }>(`/api/analytics/breakdown?${q}&dimension=${dim}&limit=${limit}`).then((r) => r.data);

      const wanted = BREAKDOWNS.filter((b) => include.has(b.id));
      const [overview, series, breakdowns, events] = await Promise.all([
        include.has("kpis") ? getJson<AnalyticsOverview>(`/api/analytics/overview?${q}`) : null,
        include.has("traffic") ? getJson<{ data: TimeseriesPoint[] }>(`/api/analytics/timeseries?${q}`).then((r) => r.data) : null,
        Promise.all(wanted.map((b) => breakdown(b.dimension))),
        include.has("funnel") ? breakdown("event", 50) : null,
      ]);

      const sections: Section[] = [];
      if (overview) {
        const c = overview.current;
        const p = overview.previous;
        sections.push({
          kind: "kpis",
          id: "kpis",
          items: [
            { label: "Unique visitors", value: formatNumber(c.visitors), change: pctChange(c.visitors, p?.visitors) },
            { label: "Pageviews", value: formatNumber(c.pageviews), change: pctChange(c.pageviews, p?.pageviews) },
            { label: "Sessions", value: formatNumber(c.sessions), change: pctChange(c.sessions, p?.sessions) },
            { label: "Bounce rate", value: formatPercent(c.bounceRate, 0), change: pctChange(c.bounceRate, p?.bounceRate) },
            { label: "Avg. session", value: formatDuration(c.avgSessionSeconds), change: pctChange(c.avgSessionSeconds, p?.avgSessionSeconds) },
            { label: "Pages / session", value: c.pagesPerSession.toFixed(1), change: pctChange(c.pagesPerSession, p?.pagesPerSession) },
            { label: "Enquiries", value: formatNumber(c.enquiries), change: pctChange(c.enquiries, p?.enquiries) },
            { label: "Enquiry conversion", value: formatPercent(c.conversionRate), change: pctChange(c.conversionRate, p?.conversionRate) },
          ],
        });
      }
      if (series) {
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "traffic",
              title: "Traffic",
              subtitle: range === "24h" ? "Unique visitors and pageviews per hour" : "Unique visitors and pageviews per day",
              chartType: "line",
              format: "int",
              data: {
                kind: "trend",
                x: series.map((p) => p.bucket),
                xLabels: series.map((p) => bucketLabel(p.bucket, range)),
                series: [
                  { label: "Unique visitors", values: series.map((p) => p.visitors) },
                  { label: "Pageviews", values: series.map((p) => p.pageviews) },
                ],
              },
            },
            chartTypes.traffic
          )
        );
      }
      wanted.forEach((b, i) => {
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: b.id,
              title: b.label,
              subtitle: `Top ${TOP_N} by ${b.measure.toLowerCase()}`,
              chartType: "bar",
              format: "int",
              half: true,
              data: { kind: "category", rows: breakdowns[i].map((r) => ({ label: b.text ? b.text(r.label) : r.label, value: r.value })) },
            },
            chartTypes[b.id]
          )
        );
      });
      if (events) {
        const sessions = (name: string) => events.find((r) => r.label === name)?.secondary ?? 0;
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "funnel",
              title: "Enquiry funnel",
              subtitle: "Sessions reaching each stage of the enquiry forms",
              chartType: "bar",
              format: "int",
              half: true,
              data: {
                kind: "category",
                rows: [
                  { label: "Opened an enquiry form", value: sessions("enquiry_open") },
                  { label: "Progressed past step 1", value: sessions("enquiry_step") },
                  { label: "Submitted", value: sessions("enquiry_submit") },
                ],
              },
            },
            chartTypes.funnel
          )
        );
      }

      return {
        slug: "analytics",
        title: "Website Analytics Report",
        subtitle: "Public site traffic",
        period: periodText(range),
        generatedBy,
        generatedAt: new Date(),
        orientation: "auto",
        sections,
      };
    },
  };
}
