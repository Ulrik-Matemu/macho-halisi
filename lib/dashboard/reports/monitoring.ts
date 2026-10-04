import type { RangeKey } from "@/lib/analytics/types";
import type { ErrorsReport, PerformanceReport, SystemReport, UptimeReport, UptimeTarget, WebVitalsReport } from "@/lib/monitoring/types";
import { formatBytes, formatDuration, formatMs, formatPercent } from "@/lib/dashboard/format";
import type { Section } from "@/lib/dashboard/export/types";
import { TREND_TYPES } from "@/lib/dashboard/useChartType";
import { applyChartChoice, gbDateTime, getJson, periodText, rangeName, type ReportDefinition } from "./common";

const TARGET_LABEL: Record<UptimeTarget, string> = { SITE: "Website", PAGE: "Key pages", API: "Backend API", DATABASE: "Database" };
const TARGET_ORDER: UptimeTarget[] = ["SITE", "PAGE", "API", "DATABASE"];
const VITAL_TEXT = { good: "Good", "needs-improvement": "Needs work", poor: "Poor" } as const;

function bucketLabel(iso: string, granularity: "hour" | "day") {
  const d = new Date(iso);
  return granularity === "hour"
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function monitoringReport(range: RangeKey, generatedBy?: string): ReportDefinition {
  return {
    title: "Monitoring report",
    description: "Uptime, performance and health of the site and API.",
    options: [
      { id: "status", label: "Status summary", kind: "section", defaultOn: true },
      { id: "uptime", label: "Uptime by target", kind: "section", defaultOn: true },
      { id: "response", label: "Response time", kind: "chart", chartId: "monitoring.response", defaultChartType: "line", chartTypes: TREND_TYPES, defaultOn: true },
      { id: "incidents", label: "Incidents (30 days)", kind: "section", defaultOn: true },
      { id: "api", label: "API performance figures", kind: "section", defaultOn: true },
      { id: "latency", label: "API latency", kind: "chart", chartId: "monitoring.latency", defaultChartType: "line", chartTypes: TREND_TYPES, defaultOn: false },
      { id: "routes", label: "Busiest API routes", kind: "section", defaultOn: true },
      { id: "vitals", label: "Core Web Vitals", kind: "section", defaultOn: true },
      { id: "errors", label: "Browser & server errors", kind: "section", defaultOn: false },
      { id: "system", label: "System health", kind: "section", defaultOn: true },
    ],
    async build({ include, chartTypes }) {
      const q = `range=${range}`;
      const needUptime = ["status", "uptime", "response", "incidents"].some((id) => include.has(id));
      const needPerf = ["api", "latency", "routes"].some((id) => include.has(id));
      const [uptime, perf, vitals, errors, system] = await Promise.all([
        needUptime ? getJson<UptimeReport>(`/api/monitoring/uptime?${q}`) : null,
        needPerf ? getJson<PerformanceReport>(`/api/monitoring/performance?${q}`) : null,
        include.has("vitals") ? getJson<WebVitalsReport>(`/api/monitoring/web-vitals?${q}`) : null,
        include.has("errors") ? getJson<ErrorsReport>(`/api/monitoring/errors?${q}`) : null,
        include.has("system") ? getJson<SystemReport>("/api/monitoring/system") : null,
      ]);

      const sections: Section[] = [];

      if (uptime && include.has("status")) {
        const down = uptime.latest.filter((l) => !l.ok);
        const state = !uptime.lastCheckAt
          ? "No uptime checks recorded yet"
          : down.length === 0
            ? "All systems operational"
            : down.some((d) => d.target === "SITE" || d.target === "API")
              ? "Outage detected"
              : "Partially degraded";
        sections.push({
          kind: "kpis",
          id: "status",
          items: [
            { label: "Overall status", value: state },
            { label: "Last check", value: uptime.lastCheckAt ? gbDateTime(uptime.lastCheckAt) : "—" },
            { label: "Open incidents", value: String(uptime.incidents.filter((i) => i.ongoing).length) },
            { label: "Failing checks", value: String(down.length) },
          ],
        });
      }
      if (uptime && include.has("uptime")) {
        const targets = TARGET_ORDER.filter((t) => uptime.latest.some((l) => l.target === t));
        sections.push({
          kind: "table",
          id: "uptime",
          title: "Uptime by target",
          columns: [{ header: "Target", width: 1.6 }, { header: "Now" }, { header: "24 hours", format: "pct2" }, { header: "7 days", format: "pct2" }, { header: "30 days", format: "pct2" }],
          rows: targets.map((t) => {
            const pct = uptime.targets.find((x) => x.target === t);
            const ok = uptime.latest.filter((l) => l.target === t).every((l) => l.ok);
            return [TARGET_LABEL[t], ok ? "Up" : "Down", pct?.uptime24h ?? null, pct?.uptime7d ?? null, pct?.uptime30d ?? null];
          }),
          empty: "No uptime checks recorded yet.",
        });
      }
      if (uptime && include.has("response")) {
        const buckets = [...new Set(uptime.latency.map((l) => l.bucket))].sort();
        const valuesFor = (t: UptimeTarget) => buckets.map((b) => uptime.latency.find((l) => l.bucket === b && l.target === t)?.avg_ms ?? null);
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "response",
              title: "Response time",
              subtitle: "Average latency measured by the uptime monitor",
              chartType: "line",
              format: "ms",
              data: {
                kind: "trend",
                x: buckets,
                xLabels: buckets.map((b) => bucketLabel(b, uptime.granularity)),
                series: [
                  { label: "Website", values: valuesFor("SITE") },
                  { label: "Backend API", values: valuesFor("API") },
                ],
              },
            },
            chartTypes.response
          )
        );
      }
      if (uptime && include.has("incidents")) {
        sections.push({
          kind: "table",
          id: "incidents",
          title: "Incidents",
          subtitle: "Consecutive failed checks in the last 30 days",
          columns: [{ header: "Target" }, { header: "Started", format: "datetime", width: 1.4 }, { header: "Duration" }, { header: "Failed checks", format: "int" }, { header: "Last error", width: 2 }, { header: "State" }],
          rows: uptime.incidents.map((i) => [TARGET_LABEL[i.target], i.startedAt, formatDuration(i.durationMs / 1000), i.failedChecks, i.lastError ?? "failed", i.ongoing ? "Ongoing" : "Resolved"]),
          empty: "No incidents in the last 30 days.",
        });
      }
      if (perf && include.has("api")) {
        const t = perf.totals;
        sections.push({
          kind: "kpis",
          id: "api",
          title: "API performance",
          items: [
            { label: "Requests / min", value: t.requestsPerMinute.toFixed(2) },
            { label: "Server error rate", value: formatPercent(t.errorRate, 2) },
            { label: "Avg latency", value: formatMs(t.avgMs) },
            { label: "p95 latency", value: t.p95UpperMs === null ? "> 1s" : `≤ ${formatMs(t.p95UpperMs)}` },
          ],
        });
      }
      if (perf && include.has("latency")) {
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "latency",
              title: "API latency",
              subtitle: "Average latency of every backend request",
              chartType: "line",
              format: "ms",
              data: {
                kind: "trend",
                x: perf.series.map((s) => s.bucket),
                xLabels: perf.series.map((s) => bucketLabel(s.bucket, perf.granularity)),
                series: [{ label: "Average latency", values: perf.series.map((s) => s.avg_ms) }],
              },
            },
            chartTypes.latency
          )
        );
      }
      if (perf && include.has("routes")) {
        sections.push({
          kind: "table",
          id: "routes",
          title: "Busiest API routes",
          subtitle: "Top 12 by request volume",
          columns: [
            { header: "Route", width: 3 },
            { header: "Requests", format: "int" },
            { header: "5xx", format: "pct" },
            { header: "4xx", format: "pct" },
            { header: "Avg", format: "ms" },
            { header: "p95" },
            { header: "Max", format: "ms" },
          ],
          rows: perf.routes.slice(0, 12).map((r) => [`${r.method} ${r.route}`, r.requests, r.errorRate, r.clientErrorRate, r.avgMs, r.p95UpperMs === null ? "> 1s" : `≤ ${formatMs(r.p95UpperMs)}`, r.maxMs]),
          empty: "No API traffic recorded in this period.",
        });
      }
      if (vitals && include.has("vitals")) {
        const order = ["LCP", "INP", "CLS", "FCP", "TTFB"];
        sections.push({
          kind: "table",
          id: "vitals",
          title: "Core Web Vitals",
          subtitle: "75th percentile from real visitors",
          half: true,
          columns: [{ header: "Metric" }, { header: "p75", width: 1 }, { header: "Rating" }, { header: "Samples", format: "int" }],
          rows: order
            .map((name) => vitals.overall.find((o) => o.name === name))
            .filter((v): v is NonNullable<typeof v> => Boolean(v))
            .map((v) => [v.name, v.name === "CLS" ? v.p75.toFixed(3) : formatMs(v.p75), v.rating ? VITAL_TEXT[v.rating] : "—", v.samples]),
          empty: "No Web Vitals samples in this period.",
        });
      }
      if (system && include.has("system")) {
        sections.push({
          kind: "keyValue",
          id: "system",
          title: "System health",
          half: true,
          items: [
            ["Database", system.database.connected ? "Connected" : "Unreachable"],
            ["DB query latency", formatMs(system.database.latencyMs)],
            ["DB size", formatBytes(system.database.sizeBytes)],
            ["API uptime", formatDuration(system.process.uptimeSeconds)],
            ["Memory (RSS)", formatBytes(system.process.memory.rssBytes)],
            ["Environment", system.process.environment],
            ["Deployed commit", system.process.commit?.slice(0, 12) ?? "—"],
          ],
        });
      }
      if (errors && include.has("errors")) {
        sections.push({
          kind: "table",
          id: "clientErrors",
          title: "Browser errors",
          columns: [{ header: "Message", width: 4 }, { header: "Count", format: "int" }, { header: "Sessions", format: "int" }, { header: "Last seen", format: "datetime", width: 1.5 }],
          rows: errors.clientErrors.slice(0, 10).map((e) => [e.message, e.occurrences, e.sessions, e.lastSeen]),
          empty: "No browser errors in this period.",
        });
        sections.push({
          kind: "table",
          id: "serverErrors",
          title: "Server errors",
          subtitle: "Recent 5xx responses since the last restart",
          columns: [{ header: "At", format: "datetime", width: 1.5 }, { header: "Status", format: "int" }, { header: "Route", width: 2 }, { header: "Message", width: 3 }],
          rows: errors.serverErrors.slice(0, 10).map((e) => [e.at, e.status, `${e.method} ${e.route}`, e.message]),
          empty: "No server errors since the last restart.",
        });
      }

      return {
        nameParts: ["Monitoring Report", rangeName(range)],
        title: "System Monitoring Report",
        subtitle: "Site and API health",
        period: periodText(range),
        generatedBy,
        generatedAt: new Date(),
        orientation: "auto",
        sections,
      };
    },
  };
}
