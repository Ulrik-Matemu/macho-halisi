"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleHelp, RefreshCw, XCircle } from "lucide-react";
import AdminOnly from "@/components/dashboard/AdminOnly";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import LineChart from "@/components/dashboard/charts/LineChart";
import { HEALTH_COLOR, KpiTile, Panel, Segmented, StatusStrip, type HealthLevel } from "@/components/dashboard/charts/primitives";
import { useReport } from "@/lib/dashboard/useReport";
import { RANGE_OPTIONS, type RangeKey } from "@/lib/analytics/types";
import type {
  ErrorsReport,
  PerformanceReport,
  SystemReport,
  UptimeReport,
  UptimeTarget,
  VitalRating,
  WebVitalsReport,
} from "@/lib/monitoring/types";
import {
  formatBytes,
  formatDateTime,
  formatDuration,
  formatMs,
  formatNumber,
  formatPercent,
  formatRelative,
} from "@/lib/dashboard/format";

const REFRESH_MS = 60_000;
const DAY_MS = 24 * 60 * 60 * 1000;

const TARGET_LABEL: Record<UptimeTarget, string> = {
  SITE: "Website",
  PAGE: "Key pages",
  API: "Backend API",
  DATABASE: "Database",
};
const TARGET_ORDER: UptimeTarget[] = ["SITE", "PAGE", "API", "DATABASE"];

const HEALTH_ICON: Record<HealthLevel, typeof CheckCircle2> = {
  good: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
  unknown: CircleHelp,
};

/** Status is always icon + text + color, never color alone. */
function HealthLabel({ level, children }: { level: HealthLevel; children: React.ReactNode }) {
  const Icon = HEALTH_ICON[level];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: level === "unknown" ? "var(--dash-text-subtle)" : HEALTH_COLOR[level] }}>
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span style={{ color: "var(--dash-text)" }}>{children}</span>
    </span>
  );
}

function uptimeLevel(pct: number | null | undefined): HealthLevel {
  if (pct === null || pct === undefined) return "unknown";
  if (pct >= 0.999) return "good";
  if (pct >= 0.99) return "warning";
  return "critical";
}

const VITAL_LEVEL: Record<VitalRating, HealthLevel> = { good: "good", "needs-improvement": "warning", poor: "critical" };
const VITAL_TEXT: Record<VitalRating, string> = { good: "Good", "needs-improvement": "Needs work", poor: "Poor" };
const VITAL_INFO: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  INP: "Interaction to Next Paint",
  CLS: "Cumulative Layout Shift",
  FCP: "First Contentful Paint",
  TTFB: "Time to First Byte",
};
const formatVital = (name: string, v: number) => (name === "CLS" ? v.toFixed(3) : formatMs(v));

function bucketLabel(iso: string, granularity: "hour" | "day") {
  const d = new Date(iso);
  return granularity === "hour"
    ? d.toLocaleTimeString("en-US", { hour: "numeric" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusBanner({ uptime }: { uptime: UptimeReport }) {
  const down = uptime.latest.filter((l) => !l.ok);
  let level: HealthLevel;
  let title: string;
  let detail: string;

  if (!uptime.lastCheckAt) {
    level = "unknown";
    title = "No uptime checks recorded yet";
    detail = "Enable the Uptime workflow in GitHub Actions (see .github/workflows/uptime.yml) to start monitoring.";
  } else if (down.length > 0) {
    const critical = down.some((d) => d.target === "SITE" || d.target === "API");
    level = critical ? "critical" : "warning";
    title = critical ? "Outage detected" : "Partially degraded";
    detail = down.map((d) => `${TARGET_LABEL[d.target]} (${d.error ?? (d.statusCode ? `HTTP ${d.statusCode}` : "failed")})`).join(" · ");
  } else {
    level = "good";
    title = "All systems operational";
    detail = `Last checked ${formatRelative(uptime.lastCheckAt)}.`;
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl p-5 flex items-start gap-4"
        style={{ background: "var(--dash-surface-1)", border: `1px solid ${level === "unknown" ? "var(--dash-border)" : `color-mix(in srgb, ${HEALTH_COLOR[level]} 40%, transparent)`}` }}
      >
        <HealthLabel level={level}>
          <span className="dash-title">{title}</span>
        </HealthLabel>
        <p className="text-sm ml-auto text-right" style={{ color: "var(--dash-text-muted)" }}>
          {detail}
        </p>
      </div>
      {uptime.stale && uptime.lastCheckAt && (
        <InlineMessage tone="error">
          Monitor silent: no uptime check has arrived for over {uptime.staleAfterMinutes} minutes (last {formatRelative(uptime.lastCheckAt)}). The GitHub Actions
          workflow may be disabled, paused after 60 days of repo inactivity, or failing to reach the API.
        </InlineMessage>
      )}
    </div>
  );
}

function UptimeTargets({ uptime }: { uptime: UptimeReport }) {
  const [now] = useState(() => Date.now());
  const targets = TARGET_ORDER.filter((t) => uptime.latest.some((l) => l.target === t));

  if (targets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {targets.map((target) => {
        const latest = uptime.latest.filter((l) => l.target === target);
        const pct = uptime.targets.find((t) => t.target === target);
        const allOk = latest.every((l) => l.ok);
        const days = Array.from({ length: 90 }, (_, i) => {
          const day = new Date(now - (89 - i) * DAY_MS);
          const key = day.toISOString().slice(0, 10);
          const row = uptime.daily.find((d) => d.target === target && d.day.slice(0, 10) === key);
          return {
            key,
            level: uptimeLevel(row?.pct),
            title: row ? `${key}: ${formatPercent(row.pct, 2)} up (${row.checks} checks)` : `${key}: no data`,
          };
        });

        return (
          <Panel
            key={target}
            title={TARGET_LABEL[target]}
            actions={<HealthLabel level={allOk ? "good" : "critical"}>{allOk ? "Up" : "Down"}</HealthLabel>}
          >
            <ul className="space-y-1 text-sm">
              {latest.map((l) => (
                <li key={l.url} className="flex items-center justify-between gap-3">
                  <span className="dash-code truncate text-xs" style={{ color: "var(--dash-text-muted)" }}>
                    {l.url}
                  </span>
                  <span className="dash-code text-xs shrink-0" style={{ color: l.ok ? "var(--dash-text-subtle)" : "var(--dash-status-danger)" }}>
                    {l.ok ? formatMs(l.latencyMs) : l.error ?? `HTTP ${l.statusCode ?? "—"}`}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              {[
                ["24 hours", pct?.uptime24h],
                ["7 days", pct?.uptime7d],
                ["30 days", pct?.uptime30d],
              ].map(([label, v]) => (
                <div key={label as string}>
                  <dt className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
                    {label}
                  </dt>
                  <dd className="dash-code" style={{ color: "var(--dash-text)" }}>
                    {formatPercent(v as number | null, 2)}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="space-y-1">
              <StatusStrip segments={days} label={`${TARGET_LABEL[target]} daily uptime for the last 90 days`} />
              <div className="flex justify-between text-[11px]" style={{ color: "var(--dash-text-subtle)" }}>
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

function ResponseTimes({ uptime }: { uptime: UptimeReport }) {
  const buckets = [...new Set(uptime.latency.map((l) => l.bucket))].sort();
  const valuesFor = (t: UptimeTarget) => buckets.map((b) => uptime.latency.find((l) => l.bucket === b && l.target === t)?.avg_ms ?? null);

  return (
    <Panel title="Response time" subtitle="Average latency measured by the uptime monitor from GitHub's runners.">
      {buckets.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: "var(--dash-text-subtle)" }}>
          No checks in this period.
        </p>
      ) : (
        <LineChart
          ariaLabel="Average response time of the website and backend API over the selected period."
          x={buckets}
          formatX={(x) => bucketLabel(x, uptime.granularity)}
          formatY={(y) => formatMs(y)}
          series={[
            { key: "site", label: "Website", color: "var(--dash-chart-1)", values: valuesFor("SITE") },
            { key: "api", label: "Backend API", color: "var(--dash-chart-2)", values: valuesFor("API") },
          ]}
        />
      )}
    </Panel>
  );
}

function Incidents({ uptime }: { uptime: UptimeReport }) {
  return (
    <Panel title="Incidents" subtitle="Consecutive failed checks in the last 30 days.">
      {uptime.incidents.length === 0 ? (
        <HealthLabel level="good">No incidents in the last 30 days</HealthLabel>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--dash-border)" }}>
          {uptime.incidents.map((i) => (
            <li key={`${i.url}-${i.startedAt}`} className="py-3 flex flex-wrap items-start justify-between gap-2" style={{ borderColor: "var(--dash-border)" }}>
              <div className="space-y-0.5 min-w-0">
                <HealthLabel level={i.ongoing ? "critical" : "warning"}>
                  {TARGET_LABEL[i.target]} {i.ongoing ? "down (ongoing)" : "was down"}
                </HealthLabel>
                <p className="text-xs dash-code truncate" style={{ color: "var(--dash-text-subtle)" }}>
                  {i.url} · {i.lastError ?? "failed"} · {i.failedChecks} failed check{i.failedChecks === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-xs text-right" style={{ color: "var(--dash-text-muted)" }}>
                <div>{formatDateTime(i.startedAt)}</div>
                <div>{i.ongoing ? "for " : "lasted "}{formatDuration(i.durationMs / 1000)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function ApiPerformance({ perf }: { perf: PerformanceReport }) {
  const t = perf.totals;
  return (
    <Panel title="API performance" subtitle="Every backend request, aggregated per minute. p95 is an upper bound from a latency histogram.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="Requests / min" value={t.requestsPerMinute.toFixed(2)} />
        <KpiTile label="Server error rate" value={formatPercent(t.errorRate, 2)} />
        <KpiTile label="Avg latency" value={formatMs(t.avgMs)} />
        <KpiTile label="p95 latency" value={t.p95UpperMs === null ? "> 1s" : `≤ ${formatMs(t.p95UpperMs)}`} />
      </div>
      {perf.series.length > 0 && (
        <LineChart
          ariaLabel="Average API latency over the selected period."
          x={perf.series.map((s) => s.bucket)}
          formatX={(x) => bucketLabel(x, perf.granularity)}
          formatY={(y) => formatMs(y)}
          height={180}
          series={[{ key: "avg", label: "Average latency", color: "var(--dash-chart-2)", values: perf.series.map((s) => s.avg_ms) }]}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[640px]">
          <caption className="sr-only">API routes by request volume</caption>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
              {["Route", "Requests", "5xx", "4xx", "Avg", "p95", "Max"].map((h, i) => (
                <th key={h} scope="col" className={`dash-label py-2 px-2 ${i ? "text-right" : ""}`} style={{ color: "var(--dash-text-subtle)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {perf.routes.slice(0, 20).map((r) => (
              <tr key={`${r.method} ${r.route}`} style={{ borderBottom: "1px solid var(--dash-border)" }}>
                <td className="py-2 px-2 dash-code text-xs" style={{ color: "var(--dash-text)" }}>
                  <span style={{ color: "var(--dash-text-subtle)" }}>{r.method}</span> {r.route}
                </td>
                <td className="py-2 px-2 text-right dash-code tabular-nums">{formatNumber(r.requests)}</td>
                <td className="py-2 px-2 text-right dash-code tabular-nums" style={{ color: r.errorRate > 0 ? "var(--dash-status-danger)" : undefined }}>
                  {formatPercent(r.errorRate, 1)}
                </td>
                <td className="py-2 px-2 text-right dash-code tabular-nums" style={{ color: "var(--dash-text-muted)" }}>
                  {formatPercent(r.clientErrorRate, 1)}
                </td>
                <td className="py-2 px-2 text-right dash-code tabular-nums">{formatMs(r.avgMs)}</td>
                <td className="py-2 px-2 text-right dash-code tabular-nums">{r.p95UpperMs === null ? "> 1s" : `≤ ${formatMs(r.p95UpperMs)}`}</td>
                <td className="py-2 px-2 text-right dash-code tabular-nums">{formatMs(r.maxMs)}</td>
              </tr>
            ))}
            {perf.routes.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm" style={{ color: "var(--dash-text-subtle)" }}>
                  No API traffic recorded in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function WebVitals({ vitals }: { vitals: WebVitalsReport }) {
  const order = ["LCP", "INP", "CLS", "FCP", "TTFB"];
  return (
    <Panel title="Core Web Vitals" subtitle="75th percentile from real visitors' browsers (Google's ranking threshold).">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {order.map((name) => {
          const v = vitals.overall.find((o) => o.name === name);
          return (
            <div key={name} className="rounded-lg p-3 space-y-1" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
              <p className="dash-label" style={{ color: "var(--dash-text-subtle)" }} title={VITAL_INFO[name]}>
                {name}
              </p>
              <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--dash-text)" }}>
                {v ? formatVital(name, v.p75) : "—"}
              </p>
              {v?.rating ? (
                <HealthLabel level={VITAL_LEVEL[v.rating]}>
                  <span className="text-xs">{VITAL_TEXT[v.rating]}</span>
                </HealthLabel>
              ) : (
                <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                  No samples
                </span>
              )}
              {v && (
                <p className="text-[11px]" style={{ color: "var(--dash-text-subtle)" }}>
                  {formatNumber(v.samples)} samples
                </p>
              )}
            </div>
          );
        })}
      </div>
      {vitals.pages.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[520px]">
            <caption className="sr-only">Core Web Vitals by page, slowest LCP first</caption>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
                {["Page", "LCP", "INP", "CLS"].map((h, i) => (
                  <th key={h} scope="col" className={`dash-label py-2 px-2 ${i ? "text-right" : ""}`} style={{ color: "var(--dash-text-subtle)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vitals.pages.map((p) => (
                <tr key={p.path} style={{ borderBottom: "1px solid var(--dash-border)" }}>
                  <td className="py-2 px-2 dash-code text-xs truncate max-w-[280px]">{p.path}</td>
                  {["LCP", "INP", "CLS"].map((m) => {
                    const v = p.metrics[m];
                    return (
                      <td key={m} className="py-2 px-2 text-right">
                        {v?.rating ? (
                          <span className="inline-flex items-center gap-1.5 justify-end dash-code text-xs">
                            <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: HEALTH_COLOR[VITAL_LEVEL[v.rating]] }} />
                            {formatVital(m, v.p75)}
                            <span className="sr-only">({VITAL_TEXT[v.rating]})</span>
                          </span>
                        ) : (
                          <span style={{ color: "var(--dash-text-subtle)" }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Errors({ errors }: { errors: ErrorsReport }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Panel title="Browser errors" subtitle="Uncaught JavaScript errors on the public site, grouped by message.">
        {errors.clientErrors.length === 0 ? (
          <HealthLabel level="good">No browser errors in this period</HealthLabel>
        ) : (
          <ul className="space-y-3">
            {errors.clientErrors.map((e) => (
              <li key={e.message} className="space-y-1">
                <p className="dash-code text-xs break-words" style={{ color: "var(--dash-text)" }}>
                  {e.message}
                </p>
                <p className="text-[11px]" style={{ color: "var(--dash-text-subtle)" }}>
                  {formatNumber(e.occurrences)}× · {formatNumber(e.sessions)} session{e.sessions === 1 ? "" : "s"} · last {formatRelative(e.lastSeen)} on{" "}
                  <span className="dash-code">{e.samplePath}</span>
                  {typeof e.sampleMeta?.source === "string" && <> · {String(e.sampleMeta.source)}</>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Server errors" subtitle="Recent 5xx responses from the API (kept in memory since the last restart).">
        {errors.serverErrors.length === 0 ? (
          <HealthLabel level="good">No server errors since the last restart</HealthLabel>
        ) : (
          <ul className="space-y-3">
            {errors.serverErrors.map((e, i) => (
              <li key={`${e.at}-${i}`} className="space-y-1">
                <p className="dash-code text-xs" style={{ color: "var(--dash-text)" }}>
                  <span style={{ color: "var(--dash-status-danger)" }}>{e.status}</span> {e.method} {e.route}
                </p>
                <p className="text-[11px] break-words" style={{ color: "var(--dash-text-subtle)" }}>
                  {formatDateTime(e.at)} · {e.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function System({ system }: { system: SystemReport }) {
  const rows: [string, React.ReactNode][] = [
    ["Database", <HealthLabel key="db" level={system.database.connected ? "good" : "critical"}>{system.database.connected ? "Connected" : "Unreachable"}</HealthLabel>],
    ["DB query latency", formatMs(system.database.latencyMs)],
    ["DB size", formatBytes(system.database.sizeBytes)],
    ["API uptime", formatDuration(system.process.uptimeSeconds)],
    ["Memory (RSS)", formatBytes(system.process.memory.rssBytes)],
    ["Heap used", `${formatBytes(system.process.memory.heapUsedBytes)} / ${formatBytes(system.process.memory.heapTotalBytes)}`],
    ["Node.js", system.process.nodeVersion],
    ["Environment", system.process.environment],
    ["Deployed commit", system.process.commit ?? "—"],
  ];
  const counts: [string, number][] = [
    ["Itineraries", system.counts.itineraries],
    ["Accommodations", system.counts.accommodations],
    ["Destinations", system.counts.destinations],
    ["Enquiries", system.counts.enquiries],
    ["New enquiries", system.counts.newEnquiries],
    ["Staff users", system.counts.users],
    ["Analytics events", system.counts.analyticsEvents],
  ];
  return (
    <Panel title="System" subtitle="Live backend process and database health.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <dl className="space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <dt style={{ color: "var(--dash-text-subtle)" }}>{k}</dt>
              <dd className="dash-code text-right" style={{ color: "var(--dash-text)" }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <dl className="space-y-2 text-sm">
          {counts.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <dt style={{ color: "var(--dash-text-subtle)" }}>{k}</dt>
              <dd className="dash-code tabular-nums" style={{ color: "var(--dash-text)" }}>
                {formatNumber(v ?? 0)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}

function MonitoringDashboard() {
  const [range, setRange] = useState<RangeKey>("24h");
  const uptime = useReport<UptimeReport & { status: "ok" }>(`/api/monitoring/uptime?range=${range}`, REFRESH_MS);
  const perf = useReport<PerformanceReport & { status: "ok" }>(`/api/monitoring/performance?range=${range}`, REFRESH_MS);
  const vitals = useReport<WebVitalsReport & { status: "ok" }>(`/api/monitoring/web-vitals?range=${range}`, REFRESH_MS);
  const errors = useReport<ErrorsReport & { status: "ok" }>(`/api/monitoring/errors?range=${range}`, REFRESH_MS);
  const system = useReport<SystemReport & { status: "ok" }>("/api/monitoring/system", REFRESH_MS);

  const firstError = uptime.error || perf.error || vitals.error || errors.error || system.error;
  const reloadAll = () => [uptime, perf, vitals, errors, system].forEach((r) => r.reload());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring"
        description="Uptime, performance and health of the site and API. Refreshes every minute."
        actions={
          <>
            <Segmented label="Time range" options={RANGE_OPTIONS} value={range} onChange={setRange} />
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={reloadAll}>
              Refresh
            </Button>
          </>
        }
      />

      {firstError && <InlineMessage tone="error">{firstError}</InlineMessage>}

      {uptime.data ? (
        <>
          <StatusBanner uptime={uptime.data} />
          <UptimeTargets uptime={uptime.data} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ResponseTimes uptime={uptime.data} />
            <Incidents uptime={uptime.data} />
          </div>
        </>
      ) : (
        uptime.loading && <Skeleton className="h-24 w-full rounded-xl" />
      )}

      {perf.data ? <ApiPerformance perf={perf.data} /> : perf.loading && <Skeleton className="h-64 w-full rounded-xl" />}
      {vitals.data ? <WebVitals vitals={vitals.data} /> : vitals.loading && <Skeleton className="h-40 w-full rounded-xl" />}
      {errors.data ? <Errors errors={errors.data} /> : errors.loading && <Skeleton className="h-40 w-full rounded-xl" />}
      {system.data ? <System system={system.data} /> : system.loading && <Skeleton className="h-40 w-full rounded-xl" />}
    </div>
  );
}

export default function MonitoringPage() {
  return (
    <AdminOnly>
      <MonitoringDashboard />
    </AdminOnly>
  );
}
