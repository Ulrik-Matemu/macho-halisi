import { niceCeil, topWithOther, type Slice } from "@/lib/dashboard/chartData";
import { BRAND, formatValue, hex } from "./brand";
import type { Section } from "./types";

type ChartSection = Extract<Section, { kind: "chart" }>;

/** Canvas pixels per millimetre of printed size (~300 dpi). */
const PX_PER_MM = 12;
const FONT = `"Times New Roman", Times, serif`;

export interface ChartImage {
  dataUrl: string;
  widthPx: number;
  heightPx: number;
}

/**
 * Draws one chart section onto an offscreen canvas for print: white
 * background, Times labels, hairline grid, the print palette in fixed
 * order. Used for both the PDF (addImage) and the XLSX (workbook image),
 * so the two files always show the same picture.
 */
export function renderChartImage(section: ChartSection, widthMm: number, heightMm: number): ChartImage {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(widthMm * PX_PER_MM);
  canvas.height = Math.round(heightMm * PX_PER_MM);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.scale(PX_PER_MM, PX_PER_MM); // draw in millimetres from here on
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, widthMm, heightMm);

  const fmt = (v: number) => formatValue(v, section.format === "datetime" || section.format === "date" ? "decimal" : section.format);
  const { data, chartType } = section;

  // Categories are bars or a pie; trends are line, dotted or bar over time.
  if (data.kind === "category") {
    if (chartType === "pie") drawPie(ctx, topWithOther(data.rows.map((r, i) => ({ key: String(i), label: r.label, value: r.value }))), 0, 0, widthMm, heightMm, fmt);
    else drawRankedBars(ctx, data.rows, widthMm, heightMm, fmt);
  } else {
    drawAxesChart(ctx, data.xLabels, data.series, chartType === "pie" ? "line" : chartType, widthMm, heightMm, fmt);
  }

  return { dataUrl: canvas.toDataURL("image/png"), widthPx: canvas.width, heightPx: canvas.height };
}

function font(ctx: CanvasRenderingContext2D, sizeMm: number, weight: "normal" | "bold" = "normal") {
  ctx.font = `${weight} ${sizeMm}px ${FONT}`;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

function drawAxesChart(
  ctx: CanvasRenderingContext2D,
  x: string[],
  series: { label: string; values: (number | null)[] }[],
  type: "line" | "dotted" | "bar",
  w: number,
  h: number,
  fmt: (v: number) => string
) {
  const legendH = series.length >= 2 ? 6 : 0;
  font(ctx, 2.6);
  const maxVal = Math.max(0, ...series.flatMap((s) => s.values.filter((v): v is number => v !== null)));
  const yMax = niceCeil(maxVal);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const padL = Math.max(...ticks.map((t) => ctx.measureText(fmt(t)).width)) + 3;
  const pad = { top: 3 + legendH, right: 3, bottom: 7, left: padL };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const n = x.length;
  const isBar = type === "bar";
  const band = n > 0 ? innerW / n : innerW;
  const xAt = (i: number) => (isBar ? pad.left + band * (i + 0.5) : pad.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW));
  const yAt = (v: number) => pad.top + innerH - (v / yMax) * innerH;

  // Legend (≥2 series): swatch + label in text ink, never series-coloured text.
  if (legendH) {
    let lx = pad.left;
    series.forEach((s, i) => {
      ctx.fillStyle = BRAND.series[i % BRAND.series.length];
      ctx.fillRect(lx, 1.6, 3, 1.6);
      ctx.fillStyle = hex(BRAND.muted);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(s.label, lx + 4.2, 2.5);
      lx += 4.2 + ctx.measureText(s.label).width + 6;
    });
  }

  // Grid + y labels
  ctx.lineWidth = 0.15;
  ctx.strokeStyle = hex(BRAND.hairline);
  ctx.fillStyle = hex(BRAND.muted);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ticks.forEach((t) => {
    ctx.beginPath();
    ctx.moveTo(pad.left, yAt(t));
    ctx.lineTo(w - pad.right, yAt(t));
    ctx.stroke();
    ctx.fillText(fmt(t), pad.left - 1.5, yAt(t));
  });

  // X labels (≤ ~8), each truncated to the gap to its neighbours so they never collide.
  const every = Math.max(1, Math.ceil(n / 8));
  const step = (isBar ? band : n > 1 ? innerW / (n - 1) : innerW) * every;
  ctx.textBaseline = "alphabetic";
  x.forEach((label, i) => {
    const last = i === n - 1;
    if (i % every !== 0 && !(last && !isBar)) return;
    // The forced last label would crowd the previous one; skip it if too close.
    if (last && !isBar && i % every !== 0 && (i % every) * (step / every) < step * 0.6) return;
    const edge = !isBar && (i === 0 || last);
    ctx.textAlign = isBar ? "center" : i === 0 ? "left" : last ? "right" : "center";
    ctx.fillText(fitText(ctx, label, (edge ? step / 2 : step) - 1.5), xAt(i), h - 1.8);
  });

  const k = Math.max(1, series.length);
  if (isBar) {
    const gap = 0.4;
    const barW = Math.max(0.4, Math.min(6, (band * 0.75 - gap * (k - 1)) / k));
    series.forEach((s, si) => {
      ctx.fillStyle = BRAND.series[si % BRAND.series.length];
      s.values.forEach((v, i) => {
        if (v === null || v <= 0) return;
        const left = xAt(i) - (k * barW + (k - 1) * gap) / 2 + si * (barW + gap);
        ctx.fillRect(left, yAt(v), barW, pad.top + innerH - yAt(v));
      });
    });
  } else {
    series.forEach((s, si) => {
      const color = BRAND.series[si % BRAND.series.length];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 0.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash(type === "dotted" ? [0.01, 1.4] : []);
      ctx.beginPath();
      let pen = false;
      s.values.forEach((v, i) => {
        if (v === null) {
          pen = false;
          return;
        }
        if (pen) ctx.lineTo(xAt(i), yAt(v));
        else ctx.moveTo(xAt(i), yAt(v));
        pen = true;
      });
      ctx.stroke();
      ctx.setLineDash([]);
      if (type === "dotted") {
        s.values.forEach((v, i) => {
          if (v === null) return;
          ctx.beginPath();
          ctx.arc(xAt(i), yAt(v), 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.25;
          ctx.stroke();
          ctx.strokeStyle = color;
        });
      }
    });
  }

  // Baseline
  ctx.strokeStyle = hex(BRAND.muted);
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.moveTo(pad.left, yAt(0));
  ctx.lineTo(w - pad.right, yAt(0));
  ctx.stroke();
}

/** Ranked horizontal bars with labels left and values right — the print BarList. */
function drawRankedBars(ctx: CanvasRenderingContext2D, rows: { label: string; value: number }[], w: number, h: number, fmt: (v: number) => string) {
  if (rows.length === 0) return drawEmpty(ctx, w, h);
  font(ctx, 2.7);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const rowH = Math.min(6, h / rows.length);
  const valueW = Math.max(...rows.map((r) => ctx.measureText(fmt(r.value)).width)) + 2;
  const labelW = Math.min(w * 0.4, Math.max(...rows.map((r) => ctx.measureText(r.label).width)) + 2);
  const barX = labelW + 1;
  const barMax = w - barX - valueW - 1;
  rows.forEach((r, i) => {
    const cy = i * rowH + rowH / 2;
    ctx.fillStyle = hex(BRAND.text);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(fitText(ctx, r.label, labelW - 1), 0, cy);
    ctx.fillStyle = BRAND.series[0];
    ctx.fillRect(barX, cy - rowH * 0.3, Math.max(0.3, (r.value / max) * barMax), rowH * 0.6);
    ctx.fillStyle = hex(BRAND.muted);
    ctx.textAlign = "right";
    ctx.fillText(fmt(r.value), w, cy);
  });
}

function drawPie(
  ctx: CanvasRenderingContext2D,
  slices: Slice[],
  x0: number,
  y0: number,
  w: number,
  h: number,
  fmt: (v: number) => string
) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (slices.length === 0 || total <= 0) return drawEmpty(ctx, w, h, x0);
  const r = Math.min(h, w * 0.42) / 2 - 1;
  const cx = x0 + r + 1;
  const cy = y0 + h / 2;
  let a = -Math.PI / 2;
  slices.forEach((s) => {
    const a1 = a + (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a1);
    ctx.closePath();
    ctx.fillStyle = s.slot < 0 ? BRAND.other : BRAND.series[s.slot % BRAND.series.length];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    a = a1;
  });

  // Legend: swatch, label, value, share — identity never by colour alone.
  font(ctx, 2.6);
  const lx = cx + r + 4;
  const lw = x0 + w - lx;
  const lineH = Math.min(4.6, h / slices.length);
  const top = cy - (lineH * slices.length) / 2;
  slices.forEach((s, i) => {
    const ly = top + lineH * (i + 0.5);
    ctx.fillStyle = s.slot < 0 ? BRAND.other : BRAND.series[s.slot % BRAND.series.length];
    ctx.fillRect(lx, ly - 1.1, 2.2, 2.2);
    const right = `${fmt(s.value)}  ${((s.value / total) * 100).toFixed(1)}%`;
    ctx.fillStyle = hex(BRAND.muted);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(right, x0 + w, ly);
    ctx.fillStyle = hex(BRAND.text);
    ctx.textAlign = "left";
    ctx.fillText(fitText(ctx, s.label, lw - 4 - ctx.measureText(right).width - 2), lx + 3.2, ly);
  });
}

function drawEmpty(ctx: CanvasRenderingContext2D, w: number, h: number, x0 = 0) {
  font(ctx, 3);
  ctx.fillStyle = hex(BRAND.muted);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("No data for this period.", x0 + w / 2, h / 2);
}
