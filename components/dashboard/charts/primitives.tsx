"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

/** Card surface shared by every analytics/monitoring panel. */
export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl p-5 space-y-4 min-w-0 ${className}`}
      style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <h2 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

/**
 * Headline number with change vs the previous period. Direction is carried
 * by an arrow icon and a +/− sign as well as color, never color alone.
 * `invert` flips which direction counts as good (e.g. bounce rate).
 */
export function KpiTile({
  label,
  value,
  current,
  previous,
  invert = false,
}: {
  label: string;
  value: string;
  current?: number;
  previous?: number;
  invert?: boolean;
}) {
  let delta: React.ReactNode = null;
  if (current !== undefined && previous !== undefined) {
    const change = previous === 0 ? (current === 0 ? 0 : null) : (current - previous) / previous;
    const up = change !== null && change > 0.0005;
    const down = change !== null && change < -0.0005;
    const good = invert ? down : up;
    const bad = invert ? up : down;
    const Icon = up ? ArrowUpRight : down ? ArrowDownRight : Minus;
    delta = (
      <span
        className="inline-flex items-center gap-0.5 text-xs dash-code"
        style={{ color: good ? "var(--dash-status-published)" : bad ? "var(--dash-status-danger)" : "var(--dash-text-subtle)" }}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {change === null ? "new" : `${change > 0 ? "+" : ""}${(change * 100).toFixed(0)}%`}
        <span className="sr-only"> vs previous period</span>
      </span>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-2 min-w-0" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
      <p className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
        {label}
      </p>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span className="text-2xl font-semibold tabular-nums" style={{ color: "var(--dash-text)" }}>
          {value}
        </span>
        {delta}
      </div>
    </div>
  );
}

export interface BarListRow {
  label: React.ReactNode;
  key: string;
  value: number;
  /** Optional right-hand supporting figure, e.g. unique visitors. */
  secondary?: string;
}

/**
 * Ranked horizontal bars — one series, so no legend; the panel title names
 * the measure. Bars are ≤ 24px, grow from one baseline, and labels/values
 * sit in text tokens beside the mark rather than being tinted by it.
 */
export function BarList({
  rows,
  formatValue = (v) => v.toLocaleString("en-US"),
  valueHeader,
  secondaryHeader,
  empty = "No data for this period yet.",
}: {
  rows: BarListRow[];
  formatValue?: (v: number) => string;
  valueHeader?: string;
  secondaryHeader?: string;
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "var(--dash-text-subtle)" }}>
        {empty}
      </p>
    );
  }
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-1.5">
      {(valueHeader || secondaryHeader) && (
        <div className="flex justify-end gap-4 dash-label" style={{ color: "var(--dash-text-subtle)" }}>
          {secondaryHeader && <span className="w-16 text-right">{secondaryHeader}</span>}
          {valueHeader && <span className="w-16 text-right">{valueHeader}</span>}
        </div>
      )}
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-4 text-sm">
            <div className="relative flex-1 min-w-0 h-7">
              <div
                aria-hidden="true"
                className="absolute inset-y-0.5 left-0 rounded-r"
                style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: "color-mix(in srgb, var(--dash-chart-1) 22%, transparent)" }}
              />
              <div className="relative h-full flex items-center px-2 truncate" style={{ color: "var(--dash-text)" }}>
                <span className="truncate">{r.label}</span>
              </div>
            </div>
            {r.secondary !== undefined && (
              <span className="w-16 text-right dash-code text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                {r.secondary}
              </span>
            )}
            <span className="w-16 text-right dash-code tabular-nums" style={{ color: "var(--dash-text-muted)" }}>
              {formatValue(r.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Segmented control for picking one option — used for time ranges and tabs. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md p-0.5" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className="dash-focusable px-3 py-1.5 text-xs rounded transition-colors cursor-pointer"
            style={{
              background: active ? "var(--dash-surface-3)" : "transparent",
              color: active ? "var(--dash-text)" : "var(--dash-text-muted)",
              fontWeight: active ? 500 : 400,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export type HealthLevel = "good" | "warning" | "critical" | "unknown";

export const HEALTH_COLOR: Record<HealthLevel, string> = {
  good: "var(--dash-status-published)",
  warning: "var(--dash-status-draft)",
  critical: "var(--dash-status-danger)",
  unknown: "var(--dash-surface-3)",
};

/**
 * Row of per-period segments (e.g. 90 days of uptime). Each segment has a
 * native tooltip; the caller should render a text summary beside it so the
 * state never depends on color alone.
 */
export function StatusStrip({
  segments,
  label,
}: {
  segments: { key: string; level: HealthLevel; title: string }[];
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className="flex gap-[2px] h-8 items-stretch">
      {segments.map((s) => (
        <div key={s.key} title={s.title} className="flex-1 min-w-[2px] rounded-sm" style={{ background: HEALTH_COLOR[s.level] }} />
      ))}
    </div>
  );
}
