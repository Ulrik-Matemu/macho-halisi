"use client";

import React, { useEffect, useId, useRef, useState } from "react";

export interface LineSeries {
  key: string;
  label: string;
  /** A --dash-chart-* token. Marks only — labels stay in text tokens. */
  color: string;
  values: (number | null)[];
}

interface LineChartProps {
  /** One label per x position (ISO timestamps are typical). */
  x: string[];
  series: LineSeries[];
  formatX: (x: string) => string;
  formatY?: (y: number) => string;
  height?: number;
  /** Screen-reader summary of what the chart shows. */
  ariaLabel: string;
}

const PAD = { top: 12, right: 12, bottom: 26, left: 44 };

/** Rounds a max up to a clean axis ceiling (1, 2, 2.5, 5 × 10^n). */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/**
 * Dependency-free SVG line chart: one y-axis, 2px lines, a ~10% area wash
 * under the first series, recessive hairline grid, and a crosshair +
 * tooltip on hover/focus. A legend is shown whenever there are ≥2 series.
 */
export default function LineChart({ x, series, formatX, formatY = (y) => y.toLocaleString("en-US"), height = 220, ariaLabel }: LineChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const maxVal = Math.max(0, ...series.flatMap((s) => s.values.filter((v): v is number => v !== null)));
  const yMax = niceCeil(maxVal);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const n = x.length;
  const xAt = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => PAD.top + innerH - (v / yMax) * innerH;

  const pathFor = (values: (number | null)[]) => {
    let d = "";
    let pen = false;
    values.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  // Show at most ~6 x labels, evenly spaced.
  const labelEvery = Math.max(1, Math.ceil(n / 6));

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(n - 1, Math.max(0, Math.round(rel * (n - 1)))));
  };

  const first = series[0];
  const areaPath =
    first && first.values.every((v) => v !== null) && n > 1
      ? `${pathFor(first.values)}L${xAt(n - 1)},${yAt(0)}L${xAt(0)},${yAt(0)}Z`
      : null;

  return (
    <div className="space-y-3">
      {series.length >= 2 && (
        <ul className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--dash-text-muted)" }}>
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-4 h-[2px]" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={wrapRef} className="relative">
        <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block overflow-visible">
          {first && (
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={first.color} stopOpacity={0.14} />
                <stop offset="100%" stopColor={first.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
          )}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={yAt(t)} y2={yAt(t)} stroke="var(--dash-chart-grid)" strokeWidth={1} />
              <text x={PAD.left - 8} y={yAt(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="var(--dash-text-subtle)">
                {formatY(t)}
              </text>
            </g>
          ))}
          {x.map((label, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={label} x={xAt(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={11} fill="var(--dash-text-subtle)">
                {formatX(label)}
              </text>
            ) : null
          )}
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
          {series.map((s) => (
            <path key={s.key} d={pathFor(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={xAt(hover)} x2={xAt(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--dash-border-strong)" strokeWidth={1} />
              {series.map((s) =>
                s.values[hover] !== null ? (
                  <circle key={s.key} cx={xAt(hover)} cy={yAt(s.values[hover] as number)} r={4} fill={s.color} stroke="var(--dash-surface-1)" strokeWidth={2} />
                ) : null
              )}
            </g>
          )}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>
        {hover !== null && (
          <div
            className="absolute pointer-events-none px-3 py-2 rounded-md text-xs space-y-1 shadow-lg"
            style={{
              top: 0,
              left: Math.min(Math.max(xAt(hover) + 12, 0), width - 170),
              background: "var(--dash-surface-2)",
              border: "1px solid var(--dash-border-strong)",
              color: "var(--dash-text)",
              minWidth: 150,
            }}
          >
            <div style={{ color: "var(--dash-text-subtle)" }}>{formatX(x[hover])}</div>
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2" style={{ color: "var(--dash-text-muted)" }}>
                  <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="dash-code">{s.values[hover] === null ? "—" : formatY(s.values[hover] as number)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
