import type { ValueFormat } from "./types";

/**
 * Print identity for exported reports. Tuned for white paper, not the
 * dark dashboard: the ink is the logo's own brown band, the accent is the
 * dashboard's gold, and Times is used throughout for a corporate feel.
 */
export const BRAND = {
  company: "Macho Halisi Ltd",
  tagline: "Private, native-guided safaris across Tanzania",
  contact: "Arusha, Tanzania  ·  +255 754 474 792  ·  info@machohalisi.com",
  logoUrl: "/media/macho-halisi-logo-2.jpg",
  /** Logo is 1000×500. */
  logoAspect: 2,
  ink: [67, 41, 26] as const, // #43291a — logo band brown
  gold: [194, 130, 64] as const, // #c28240
  text: [33, 28, 24] as const,
  muted: [110, 101, 92] as const,
  hairline: [214, 206, 196] as const,
  zebra: [249, 246, 241] as const,
  /** Print categorical palette (light surface), fixed order; "Other" is grey. */
  series: ["#b06a28", "#2a78d6", "#1baf7a", "#4a3aa7", "#eda100", "#e87ba4", "#008300", "#e34948"],
  other: "#9a928a",
  pdfFont: "times",
  excelFont: "Times New Roman",
};

export const hex = (rgb: readonly [number, number, number]) => `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;

let logoPromise: Promise<string> | null = null;

/** Logo as a data URL, fetched once per session. */
export function loadLogo(): Promise<string> {
  logoPromise ??= fetch(BRAND.logoUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`Logo request failed (HTTP ${r.status})`);
      return r.blob();
    })
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        })
    )
    .catch((err) => {
      logoPromise = null;
      throw err;
    });
  return logoPromise;
}

/** Text rendering of a raw value, shared by the PDF tables and chart labels. */
export function formatValue(v: string | number | null, format: ValueFormat = "text"): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "string") {
    if (format === "datetime" || format === "date") {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return v;
      return format === "date"
        ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    return v;
  }
  switch (format) {
    case "int":
      return Math.round(v).toLocaleString("en-US");
    case "decimal":
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    case "pct":
      return `${(v * 100).toFixed(1)}%`;
    case "pct2":
      return `${(v * 100).toFixed(2)}%`;
    case "ms":
      return v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`;
    default:
      return String(v);
  }
}

/** Excel number format per value format. */
export const EXCEL_NUMFMT: Partial<Record<ValueFormat, string>> = {
  int: "#,##0",
  decimal: "#,##0.00",
  pct: "0.0%",
  pct2: "0.00%",
  ms: '#,##0" ms"',
  datetime: "d mmm yyyy hh:mm",
  date: "d mmm yyyy",
};

export function fileName(slug: string, suffix: string | undefined, ext: string, at = new Date()): string {
  const day = at.toISOString().slice(0, 10);
  return ["macho-halisi", slug, suffix, day].filter(Boolean).join("-").replace(/[^a-z0-9-]+/gi, "-").toLowerCase() + `.${ext}`;
}
