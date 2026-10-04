import type { ChartType } from "@/lib/dashboard/useChartType";

/**
 * One report description that both the PDF and the XLSX writers consume,
 * so the two formats never drift apart. Values stay raw (numbers, ISO
 * dates) — each writer formats them its own way (text in the PDF, number
 * formats in Excel).
 */
export type ValueFormat = "text" | "int" | "decimal" | "pct" | "pct2" | "ms" | "datetime" | "date";

export interface Column {
  header: string;
  format?: ValueFormat;
  /** Relative width hint for the PDF; Excel sizes columns from content. */
  width?: number;
}

export type Cell = string | number | null;

export interface KpiItem {
  label: string;
  value: string;
  /** Pre-formatted change vs previous period, e.g. "+12%". */
  change?: string;
}

export type ChartData =
  | { kind: "trend"; x: string[]; xLabels: string[]; series: { label: string; values: (number | null)[] }[] }
  | { kind: "category"; rows: { label: string; value: number }[] };

export type Section =
  | { kind: "kpis"; id: string; title?: string; items: KpiItem[] }
  | {
      kind: "chart";
      id: string;
      title: string;
      subtitle?: string;
      chartType: ChartType;
      data: ChartData;
      format: ValueFormat;
      /** Category charts may sit half-width beside another half section. */
      half?: boolean;
    }
  | { kind: "table"; id: string; title: string; subtitle?: string; columns: Column[]; rows: Cell[][]; half?: boolean; empty?: string }
  | { kind: "keyValue"; id: string; title: string; items: [string, string][]; half?: boolean }
  | { kind: "text"; id: string; title: string; body: string };

export interface ReportSpec {
  /**
   * What this file holds, most general first, for its name — e.g.
   * ["Analytics Report", "Last 7 days"]. The company prefix and a
   * timestamp are added by `documentName`.
   */
  nameParts: string[];
  title: string;
  subtitle?: string;
  /** Human period, e.g. "Last 7 days · 27 Sep – 4 Oct 2026". */
  period?: string;
  generatedBy?: string;
  generatedAt: Date;
  orientation: "portrait" | "landscape" | "auto";
  sections: Section[];
}

export type ExportFormat = "pdf" | "xlsx";
