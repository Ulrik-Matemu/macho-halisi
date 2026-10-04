"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Download, Radio, RefreshCw } from "lucide-react";
import AdminOnly from "@/components/dashboard/AdminOnly";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import TrendChart from "@/components/dashboard/charts/TrendChart";
import CategoryChart from "@/components/dashboard/charts/CategoryChart";
import ChartTypeToggle from "@/components/dashboard/charts/ChartTypeToggle";
import { BarList, KpiTile, Panel, Segmented } from "@/components/dashboard/charts/primitives";
import { useReport } from "@/lib/dashboard/useReport";
import { useAuth } from "@/lib/dashboard/auth-context";
import { analyticsReport } from "@/lib/dashboard/reports/analytics";
import ExportDialog from "@/components/dashboard/export/ExportDialog";
import { SHARE_TYPES, TREND_TYPES, useChartType, type ChartType } from "@/lib/dashboard/useChartType";
import {
  RANGE_OPTIONS,
  type AnalyticsOverview,
  type BreakdownDimension,
  type BreakdownRow,
  type RangeKey,
  type RealtimeSnapshot,
  type TimeseriesPoint,
} from "@/lib/analytics/types";
import {
  countryFlag,
  countryName,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/dashboard/format";

// Mapbox is heavy — load it only when the page actually renders the map.
const VisitorMap = dynamic(() => import("@/components/dashboard/charts/VisitorMap"), { ssr: false });

const REALTIME_POLL_MS = 30_000;

const capitalize = (l: string) => l.charAt(0).toUpperCase() + l.slice(1);

function bucketLabel(iso: string, range: RangeKey): string {
  const d = new Date(iso);
  return range === "24h"
    ? d.toLocaleTimeString("en-US", { hour: "numeric" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function useBreakdown(range: RangeKey, dimension: BreakdownDimension, limit = 10) {
  return useReport<{ data: BreakdownRow[] }>(`/api/analytics/breakdown?range=${range}&dimension=${dimension}&limit=${limit}`);
}

/** Panel with its own tab set, each tab one breakdown dimension. */
function BreakdownPanel({
  chartId,
  chartTypes,
  title,
  range,
  tabs,
  renderLabel = (l) => l,
  textLabel = (l) => l,
  valueHeader,
  secondaryHeader,
}: {
  /** Key under which this panel's chart type is remembered (and read by exports). */
  chartId: string;
  /** Offer a chart-type switch; omitted for ranked lists, which stay bars. */
  chartTypes?: ChartType[];
  title: string;
  range: RangeKey;
  tabs: { key: BreakdownDimension; label: string }[];
  renderLabel?: (label: string) => React.ReactNode;
  textLabel?: (label: string) => string;
  valueHeader?: (dim: BreakdownDimension) => string;
  secondaryHeader?: (dim: BreakdownDimension) => string | undefined;
}) {
  const [dim, setDim] = useState<BreakdownDimension>(tabs[0].key);
  const [chosen, setChartType] = useChartType(chartId, "bar", chartTypes);
  const chartType = chartTypes ? chosen : "bar";
  const { data, loading, error } = useBreakdown(range, dim);

  return (
    <Panel
      title={title}
      actions={
        tabs.length > 1 ? (
          <Segmented label={`${title} view`} options={tabs} value={dim} onChange={setDim} />
        ) : chartTypes ? (
          <ChartTypeToggle label={`${title} chart type`} options={chartTypes} value={chartType} onChange={setChartType} />
        ) : undefined
      }
    >
      {error && <InlineMessage tone="error">{error}</InlineMessage>}
      {loading && !data ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <CategoryChart
          type={chartType}
          ariaLabel={`${title}: ${tabs.find((t) => t.key === dim)?.label ?? ""} by ${valueHeader?.(dim)?.toLowerCase() ?? "count"}.`}
          valueHeader={valueHeader?.(dim)}
          secondaryHeader={secondaryHeader?.(dim)}
          rows={(data?.data ?? []).map((r) => ({
            key: r.label,
            label: renderLabel(r.label),
            text: textLabel(r.label),
            value: r.value,
            secondary: r.secondary !== null && secondaryHeader?.(dim) ? formatNumber(r.secondary) : undefined,
          }))}
        />
      )}
    </Panel>
  );
}

function Geography({ range }: { range: RangeKey }) {
  const countries = useBreakdown(range, "country", 50);
  const cities = useBreakdown(range, "city", 10);
  const countryRows = countries.data?.data ?? [];

  return (
    <Panel title="Geography" subtitle="Unique visitors by location, from Vercel's edge geolocation.">
      {(countries.error || cities.error) && <InlineMessage tone="error">{countries.error || cities.error}</InlineMessage>}
      <VisitorMap countries={countryRows.map((r) => ({ code: r.label, visitors: r.value }))} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
            Countries
          </h3>
          {countries.loading && !countries.data ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <BarList
              valueHeader="Visitors"
              rows={countryRows.slice(0, 10).map((r) => ({
                key: r.label,
                label: (
                  <>
                    <span aria-hidden="true" className="mr-2">
                      {countryFlag(r.label)}
                    </span>
                    {r.label === "Unknown" ? "Unknown" : countryName(r.label)}
                  </>
                ),
                value: r.value,
              }))}
            />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
            Cities
          </h3>
          {cities.loading && !cities.data ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <BarList
              valueHeader="Visitors"
              empty="No city data yet — it's only available on the deployed site."
              rows={(cities.data?.data ?? []).map((r) => ({ key: r.label, label: r.label, value: r.value }))}
            />
          )}
        </div>
      </div>
    </Panel>
  );
}

function EnquiryFunnel({ range, enquiries }: { range: RangeKey; enquiries?: number }) {
  const { data, loading } = useBreakdown(range, "event", 50);
  const rows = data?.data ?? [];
  const sessionsFor = (name: string) => rows.find((r) => r.label === name)?.secondary ?? 0;
  const opens = sessionsFor("enquiry_open");
  const steps = sessionsFor("enquiry_step");
  const submits = sessionsFor("enquiry_submit");
  const pct = (n: number) => (opens ? ` · ${formatPercent(n / opens, 0)}` : "");

  return (
    <Panel title="Enquiry funnel" subtitle="Sessions reaching each stage of the enquiry forms.">
      {loading && !data ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <BarList
          valueHeader="Sessions"
          empty="No enquiry form activity yet."
          rows={
            opens || submits
              ? [
                  { key: "open", label: "Opened an enquiry form", value: opens },
                  { key: "step", label: `Progressed past step 1${pct(steps)}`, value: steps },
                  { key: "submit", label: `Submitted${pct(submits)}`, value: submits },
                ]
              : []
          }
        />
      )}
      {enquiries !== undefined && (
        <p className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
          {formatNumber(enquiries)} enquir{enquiries === 1 ? "y" : "ies"} stored in this period (includes visitors with Do Not Track enabled).
        </p>
      )}
    </Panel>
  );
}

function Realtime() {
  const { data } = useReport<RealtimeSnapshot & { status: "ok" }>("/api/analytics/realtime", REALTIME_POLL_MS);
  return (
    <Panel
      title="Right now"
      subtitle={`Sessions active in the last ${data?.windowMinutes ?? 5} minutes. Refreshes every 30s.`}
      actions={
        <span className="inline-flex items-center gap-1.5 text-sm dash-code" style={{ color: "var(--dash-text)" }}>
          <Radio className="w-4 h-4" style={{ color: "var(--dash-status-published)" }} aria-hidden="true" />
          {data ? formatNumber(data.activeVisitors) : "—"}
          <span className="sr-only">active visitors</span>
        </span>
      }
    >
      <BarList valueHeader="Visitors" empty="Nobody on the site right now." rows={(data?.pages ?? []).map((p) => ({ key: p.label, label: p.label, value: p.value }))} />
    </Panel>
  );
}

function AnalyticsDashboard() {
  const [range, setRange] = useState<RangeKey>("7d");
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const overview = useReport<AnalyticsOverview>(`/api/analytics/overview?range=${range}`);
  const series = useReport<{ data: TimeseriesPoint[] }>(`/api/analytics/timeseries?range=${range}`);

  const cur = overview.data?.current;
  const prev = overview.data?.previous;
  const points = series.data?.data ?? [];
  const [trafficChart, setTrafficChart] = useChartType("analytics.traffic", "line", TREND_TYPES);

  const reloadAll = () => {
    overview.reload();
    series.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Cookieless traffic analytics for the public site. Dashboard visits are never counted."
        actions={
          <>
            <Segmented label="Time range" options={RANGE_OPTIONS} value={range} onChange={setRange} />
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={reloadAll}>
              Refresh
            </Button>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => setExporting(true)}>
              Export
            </Button>
          </>
        }
      />

      {overview.error && <InlineMessage tone="error">{overview.error}</InlineMessage>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {!cur ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[92px] w-full rounded-xl" />)
        ) : (
          <>
            <KpiTile label="Unique visitors" value={formatNumber(cur.visitors)} current={cur.visitors} previous={prev?.visitors} />
            <KpiTile label="Pageviews" value={formatNumber(cur.pageviews)} current={cur.pageviews} previous={prev?.pageviews} />
            <KpiTile label="Sessions" value={formatNumber(cur.sessions)} current={cur.sessions} previous={prev?.sessions} />
            <KpiTile label="Bounce rate" value={formatPercent(cur.bounceRate, 0)} current={cur.bounceRate} previous={prev?.bounceRate} invert />
            <KpiTile label="Avg. session" value={formatDuration(cur.avgSessionSeconds)} current={cur.avgSessionSeconds} previous={prev?.avgSessionSeconds} />
            <KpiTile label="Pages / session" value={cur.pagesPerSession.toFixed(1)} current={cur.pagesPerSession} previous={prev?.pagesPerSession} />
            <KpiTile label="Enquiries" value={formatNumber(cur.enquiries)} current={cur.enquiries} previous={prev?.enquiries} />
            <KpiTile label="Enquiry conversion" value={formatPercent(cur.conversionRate)} current={cur.conversionRate} previous={prev?.conversionRate} />
          </>
        )}
      </div>

      <Panel
        title="Traffic"
        subtitle={range === "24h" ? "Per hour" : "Per day"}
        actions={<ChartTypeToggle label="Traffic chart type" options={TREND_TYPES} value={trafficChart} onChange={setTrafficChart} />}
      >
        {series.error && <InlineMessage tone="error">{series.error}</InlineMessage>}
        {series.loading && !series.data ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <TrendChart
            type={trafficChart}
            ariaLabel={`Unique visitors and pageviews ${range === "24h" ? "per hour over the last 24 hours" : `per day over the last ${range}`}.`}
            x={points.map((p) => p.bucket)}
            formatX={(x) => bucketLabel(x, range)}
            series={[
              { key: "visitors", label: "Unique visitors", color: "var(--dash-chart-1)", values: points.map((p) => p.visitors) },
              { key: "pageviews", label: "Pageviews", color: "var(--dash-chart-2)", values: points.map((p) => p.pageviews) },
            ]}
          />
        )}
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BreakdownPanel
          chartId="analytics.pages"
          title="Pages"
          range={range}
          tabs={[
            { key: "page", label: "Top" },
            { key: "entry", label: "Entry" },
            { key: "exit", label: "Exit" },
          ]}
          valueHeader={(d) => (d === "page" ? "Views" : "Sessions")}
          secondaryHeader={(d) => (d === "page" ? "Visitors" : undefined)}
        />
        <BreakdownPanel
          chartId="analytics.sources"
          title="Sources"
          range={range}
          tabs={[
            { key: "referrer", label: "Referrers" },
            { key: "utm_source", label: "UTM source" },
            { key: "utm_campaign", label: "Campaign" },
          ]}
          valueHeader={() => "Sessions"}
        />
      </div>

      <Geography range={range} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BreakdownPanel
          chartId="analytics.devices"
          chartTypes={SHARE_TYPES}
          title="Devices"
          range={range}
          tabs={[{ key: "device", label: "Devices" }]}
          valueHeader={() => "Visitors"}
          renderLabel={capitalize}
          textLabel={capitalize}
        />
        <BreakdownPanel chartId="analytics.browsers" chartTypes={SHARE_TYPES} title="Browsers" range={range} tabs={[{ key: "browser", label: "Browsers" }]} valueHeader={() => "Visitors"} />
        <BreakdownPanel chartId="analytics.os" chartTypes={SHARE_TYPES} title="Operating systems" range={range} tabs={[{ key: "os", label: "OS" }]} valueHeader={() => "Visitors"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <EnquiryFunnel range={range} enquiries={cur?.enquiries} />
        <BreakdownPanel
          chartId="analytics.events"
          title="Events"
          range={range}
          tabs={[{ key: "event", label: "Events" }]}
          valueHeader={() => "Count"}
          secondaryHeader={() => "Sessions"}
          renderLabel={(l) => <span className="dash-code">{l}</span>}
        />
        <Realtime />
      </div>
      {exporting && <ExportDialog report={analyticsReport(range, user?.email)} onClose={() => setExporting(false)} />}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminOnly>
      <AnalyticsDashboard />
    </AdminOnly>
  );
}
