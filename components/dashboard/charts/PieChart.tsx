"use client";

import React, { useState } from "react";
import { CHART_COLORS, OTHER_COLOR, type Slice } from "@/lib/dashboard/chartData";

const SIZE = 180;
const R = SIZE / 2 - 4;

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => `${(cx + r * Math.sin(a)).toFixed(2)},${(cy - r * Math.cos(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx},${cy}L${p(a0)}A${r},${r} 0 ${large} 1 ${p(a1)}Z`;
}

export const sliceColor = (s: Slice) => (s.slot < 0 ? OTHER_COLOR : CHART_COLORS[s.slot % CHART_COLORS.length]);

/**
 * SVG pie with a 2px surface gap between slices and a legend that always
 * carries label, value and share — identity never rests on color alone.
 * `showShare` is off for averaged measures, where a "% of total" is
 * meaningless.
 */
export default function PieChart({
  slices,
  formatValue = (v) => v.toLocaleString("en-US"),
  ariaLabel,
  showShare = true,
  empty = "No data for this period yet.",
}: {
  slices: Slice[];
  formatValue?: (v: number) => string;
  ariaLabel: string;
  showShare?: boolean;
  empty?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const total = slices.reduce((a, s) => a + s.value, 0);

  if (slices.length === 0 || total <= 0) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "var(--dash-text-subtle)" }}>
        {empty}
      </p>
    );
  }

  const share = (v: number) => `${((v / total) * 100).toFixed(v / total < 0.1 ? 1 : 0)}%`;
  const arcs = slices.reduce<{ s: Slice; a0: number; a1: number }[]>((acc, s) => {
    const a0 = acc.length ? acc[acc.length - 1].a1 : 0;
    return [...acc, { s, a0, a1: a0 + (s.value / total) * Math.PI * 2 }];
  }, []);
  const c = SIZE / 2;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={ariaLabel} className="shrink-0 overflow-visible">
        {arcs.map(({ s, a0, a1 }) => {
          const dim = active !== null && active !== s.key;
          const common = {
            fill: sliceColor(s),
            stroke: "var(--dash-surface-1)",
            strokeWidth: 2,
            opacity: dim ? 0.45 : 1,
            tabIndex: 0,
            className: "dash-focusable transition-opacity outline-none",
            onMouseEnter: () => setActive(s.key),
            onMouseLeave: () => setActive(null),
            onFocus: () => setActive(s.key),
            onBlur: () => setActive(null),
          };
          return slices.length === 1 ? (
            <circle key={s.key} cx={c} cy={c} r={R} {...common}>
              <title>{`${s.label}: ${formatValue(s.value)}`}</title>
            </circle>
          ) : (
            <path key={s.key} d={arcPath(c, c, R, a0, a1)} {...common}>
              <title>{`${s.label}: ${formatValue(s.value)}${showShare ? ` (${share(s.value)})` : ""}`}</title>
            </path>
          );
        })}
      </svg>
      <ul className="flex-1 min-w-0 w-full space-y-1.5 text-sm">
        {slices.map((s) => (
          <li
            key={s.key}
            className="flex items-center gap-3 px-2 py-1 rounded transition-colors"
            style={{ background: active === s.key ? "var(--dash-surface-2)" : "transparent" }}
            onMouseEnter={() => setActive(s.key)}
            onMouseLeave={() => setActive(null)}
          >
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sliceColor(s) }} />
            <span className="flex-1 min-w-0 truncate" style={{ color: "var(--dash-text)" }} title={s.label}>
              {s.label}
            </span>
            <span className="dash-code tabular-nums" style={{ color: "var(--dash-text-muted)" }}>
              {formatValue(s.value)}
            </span>
            {showShare && (
              <span className="w-12 text-right dash-code text-xs tabular-nums" style={{ color: "var(--dash-text-subtle)" }}>
                {share(s.value)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
