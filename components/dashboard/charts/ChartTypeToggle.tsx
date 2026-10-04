"use client";

import React from "react";
import { ChartColumn, ChartLine, ChartPie, ChartScatter, type LucideIcon } from "lucide-react";
import { CHART_TYPES, type ChartType } from "@/lib/dashboard/useChartType";

const ICON: Record<ChartType, LucideIcon> = {
  line: ChartLine,
  dotted: ChartScatter,
  bar: ChartColumn,
  pie: ChartPie,
};

/** Icon-only segmented control for a panel's chart type; same look as `Segmented`. */
export default function ChartTypeToggle<T extends ChartType>({
  value,
  onChange,
  label,
  options,
}: {
  value: T;
  onChange: (t: T) => void;
  /** Names the chart, e.g. "Traffic chart type". */
  label: string;
  /** The types that suit this data. */
  options: readonly T[];
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md p-0.5 shrink-0" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
      {CHART_TYPES.filter((t): t is { key: T; label: string } => (options as readonly ChartType[]).includes(t.key)).map((t) => {
        const Icon: LucideIcon = ICON[t.key as ChartType];
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={active}
            title={t.label}
            onClick={() => onChange(t.key)}
            className="dash-focusable p-1.5 rounded transition-colors cursor-pointer"
            style={{
              background: active ? "var(--dash-surface-3)" : "transparent",
              color: active ? "var(--dash-text)" : "var(--dash-text-subtle)",
            }}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
