export type UptimeTarget = "SITE" | "PAGE" | "API" | "DATABASE";

export interface UptimeLatest {
  target: UptimeTarget;
  url: string;
  ok: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  error: string | null;
  checkedAt: string;
}

export interface UptimeIncident {
  target: UptimeTarget;
  url: string;
  startedAt: string;
  lastFailureAt: string;
  resolvedAt: string | null;
  failedChecks: number;
  lastError: string | null;
  durationMs: number;
  ongoing: boolean;
}

export interface UptimeReport {
  lastCheckAt: string | null;
  stale: boolean;
  staleAfterMinutes: number;
  granularity: "hour" | "day";
  targets: { target: UptimeTarget; uptime24h: number | null; uptime7d: number | null; uptime30d: number | null }[];
  latest: UptimeLatest[];
  latency: { bucket: string; target: UptimeTarget; avg_ms: number | null; checks: number }[];
  daily: { day: string; target: UptimeTarget; pct: number; checks: number }[];
  incidents: UptimeIncident[];
}

export interface PerfSummary {
  requests: number;
  requestsPerMinute: number;
  errorRate: number;
  clientErrorRate: number;
  avgMs: number;
  maxMs: number;
  p95UpperMs: number | null;
}

export interface PerformanceReport {
  granularity: "hour" | "day";
  totals: PerfSummary;
  routes: (PerfSummary & { route: string; method: string })[];
  series: { bucket: string; count: number; errors: number; avg_ms: number | null }[];
}

export type VitalRating = "good" | "needs-improvement" | "poor";

export interface WebVitalsReport {
  thresholds: Record<string, [number, number]>;
  overall: { name: string; p75: number; samples: number; rating: VitalRating | null }[];
  pages: { path: string; samples: number; metrics: Record<string, { p75: number; rating: VitalRating | null }> }[];
}

export interface ErrorsReport {
  clientErrors: {
    message: string;
    occurrences: number;
    sessions: number;
    lastSeen: string;
    samplePath: string;
    sampleMeta: Record<string, unknown> | null;
  }[];
  serverErrors: { at: string; method: string; route: string; status: number; message: string }[];
}

export interface SystemReport {
  process: {
    uptimeSeconds: number;
    nodeVersion: string;
    environment: string;
    commit: string | null;
    memory: { rssBytes: number; heapUsedBytes: number; heapTotalBytes: number };
  };
  database: { connected: boolean; latencyMs: number; sizeBytes: number };
  counts: Record<string, number>;
}
