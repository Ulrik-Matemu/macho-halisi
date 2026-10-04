/**
 * Chart data shaping shared by the on-screen SVG charts and the canvas
 * renderer used for PDF/XLSX exports, so both always agree on palette
 * order and what an "Other" slice holds.
 */

/** Categorical slots in fixed order (never cycled) — see globals.css. */
export const CHART_COLORS = [
  "var(--dash-chart-1)",
  "var(--dash-chart-2)",
  "var(--dash-chart-3)",
  "var(--dash-chart-4)",
  "var(--dash-chart-5)",
  "var(--dash-chart-6)",
  "var(--dash-chart-7)",
  "var(--dash-chart-8)",
];
export const OTHER_COLOR = "var(--dash-chart-other)";

/** Pies stay legible up to 7 slices; past that the tail folds into "Other". */
export const MAX_PIE_SLICES = 7;

export interface Slice {
  key: string;
  label: string;
  value: number;
  /** Index into the categorical palette, or -1 for the neutral "Other". */
  slot: number;
}

/** Rounds a max up to a clean axis ceiling (1, 2, 2.5, 5 × 10^n). */
export function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/** Top N−1 categories by value, the rest summed into one "Other" slice. */
export function topWithOther(rows: { key: string; label: string; value: number }[], max = MAX_PIE_SLICES): Slice[] {
  const positive = rows.filter((r) => r.value > 0).sort((a, b) => b.value - a.value);
  if (positive.length <= max) return positive.map((r, i) => ({ ...r, slot: i }));
  const head = positive.slice(0, max - 1).map((r, i) => ({ ...r, slot: i }));
  const rest = positive.slice(max - 1).reduce((sum, r) => sum + r.value, 0);
  return [...head, { key: "__other", label: `Other (${positive.length - max + 1})`, value: rest, slot: -1 }];
}
