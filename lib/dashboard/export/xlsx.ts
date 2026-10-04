import type { Workbook, Worksheet, Cell as XCell, Font } from "exceljs";
import { BRAND, EXCEL_NUMFMT, documentName, formatValue, loadLogo } from "./brand";
import { renderChartImage } from "./chartImage";
import type { Cell, Column, ReportSpec, Section } from "./types";

const argb = (rgb: readonly [number, number, number]) => `FF${rgb.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
const INK = argb(BRAND.ink);
const GOLD = argb(BRAND.gold);
const MUTED = argb(BRAND.muted);
const TEXT = argb(BRAND.text);
const HAIR = argb(BRAND.hairline);
const ZEBRA = argb(BRAND.zebra);
const CONTENT_ROW = 7; // rows 1–5 are the letterhead
const ONE_PAGE_MAX_ROWS = 45;

const font = (f: Partial<Font> = {}): Partial<Font> => ({ name: BRAND.excelFont, size: 10, color: { argb: TEXT }, ...f });

/**
 * Builds the report as an .xlsx workbook: a Summary sheet (KPIs, notes,
 * key facts), one sheet per chart (its data table plus the chart image —
 * ExcelJS can't write native Excel charts) and one per table. Every sheet
 * carries the logo letterhead, uses Times New Roman throughout and is set
 * to print on a single A4 page (or one page wide for long lists).
 */
export async function buildWorkbook(spec: ReportSpec): Promise<Blob> {
  const [{ default: ExcelJS }, logo] = await Promise.all([import("exceljs"), loadLogo().catch(() => null)]);
  const wb: Workbook = new ExcelJS.Workbook();
  wb.creator = BRAND.company;
  wb.company = BRAND.company;
  wb.title = documentName(spec.nameParts, spec.generatedAt);
  wb.subject = [spec.title, spec.subtitle, spec.period].filter(Boolean).join(" · ");
  wb.created = spec.generatedAt;
  const logoId = logo ? wb.addImage({ base64: logo.replace(/^data:image\/\w+;base64,/, ""), extension: "jpeg" }) : null;
  const used = new Set<string>();

  const sheet = (name: string, landscape: boolean) => {
    let base = name.replace(/[[\]:*?/\\]/g, " ").trim().slice(0, 31) || "Sheet";
    let n = 2;
    while (used.has(base.toLowerCase())) base = `${name.slice(0, 27)} (${n++})`;
    used.add(base.toLowerCase());
    const ws = wb.addWorksheet(base, {
      views: [{ showGridLines: false }],
      pageSetup: {
        paperSize: 9, // A4
        orientation: landscape ? "landscape" : "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
        horizontalCentered: true,
        margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.7, header: 0.3, footer: 0.3 },
      },
      headerFooter: {
        oddFooter: `&L&"Times New Roman,Regular"&8${BRAND.company} · Confidential&C&"Times New Roman,Regular"&8${BRAND.contact}&R&"Times New Roman,Regular"&8Page &P of &N`,
      },
    });
    letterhead(ws, spec, logoId);
    return ws;
  };

  const orientationFor = (cols: number) => (spec.orientation === "auto" ? cols > 6 : spec.orientation === "landscape");

  // Summary: KPIs, key/value facts and notes, in report order.
  const summaryParts = spec.sections.filter((s) => s.kind === "kpis" || s.kind === "keyValue" || s.kind === "text");
  if (summaryParts.length) {
    const ws = sheet("Summary", false);
    let r = CONTENT_ROW;
    for (const sec of summaryParts) {
      if (sec.kind === "kpis") {
        r = writeTable(ws, r, sec.title ?? "Key figures", [{ header: "Metric" }, { header: "Value" }, { header: "Change vs previous" }], sec.items.map((i) => [i.label, i.value, i.change ?? null]));
      } else if (sec.kind === "keyValue") {
        r = writeTable(ws, r, sec.title, [{ header: "Item" }, { header: "Detail" }], sec.items);
      } else if (sec.kind === "text") {
        r = writeTitle(ws, r, sec.title);
        ws.mergeCells(r, 1, r, 6);
        const c = ws.getCell(r, 1);
        c.value = sec.body;
        c.alignment = { wrapText: true, vertical: "top" };
        c.font = font();
        ws.getRow(r).height = Math.min(400, 15 * Math.max(1, Math.ceil(sec.body.length / 90) + sec.body.split("\n").length - 1));
        r += 2;
      }
    }
    finishSheet(ws, r);
  }

  for (const sec of spec.sections) {
    if (sec.kind === "chart") {
      const { columns, rows } = chartTable(sec);
      const ws = sheet(sec.title, true);
      const end = writeTable(ws, CONTENT_ROW, sec.title, columns, rows, sec.subtitle);
      const img = renderChartImage(sec, 170, 85);
      const imgId = wb.addImage({ base64: img.dataUrl.replace(/^data:image\/\w+;base64,/, ""), extension: "png" });
      ws.addImage(imgId, { tl: { col: columns.length + 1, row: CONTENT_ROW - 1 }, ext: { width: 620, height: 310 } });
      finishSheet(ws, Math.max(end, CONTENT_ROW + 18), CONTENT_ROW + 1);
    } else if (sec.kind === "table") {
      const ws = sheet(sec.title, orientationFor(sec.columns.length));
      const end = writeTable(ws, CONTENT_ROW, sec.title, sec.columns, sec.rows, sec.subtitle, sec.empty);
      finishSheet(ws, end, CONTENT_ROW + 1 + (sec.subtitle ? 1 : 0));
    }
  }

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function letterhead(ws: Worksheet, spec: ReportSpec, logoId: number | null) {
  for (let r = 1; r <= 4; r++) ws.getRow(r).height = 19;
  if (logoId !== null) ws.addImage(logoId, { tl: { col: 0, row: 0 }, ext: { width: 152, height: 76 } });
  const put = (row: number, value: string, f: Partial<Font>) => {
    ws.mergeCells(row, 3, row, 9);
    const c = ws.getCell(row, 3);
    c.value = value;
    c.font = font(f);
    c.alignment = { horizontal: "right", vertical: "middle" };
  };
  put(1, BRAND.company.toUpperCase(), { size: 9, color: { argb: GOLD } });
  put(2, spec.title, { size: 16, bold: true, color: { argb: INK } });
  put(3, [spec.subtitle, spec.period].filter(Boolean).join("  ·  "), { size: 10, italic: true, color: { argb: MUTED } });
  const generated = spec.generatedAt.toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  put(4, `Generated ${generated}${spec.generatedBy ? ` by ${spec.generatedBy}` : ""}`, { size: 8, color: { argb: MUTED } });
  for (let col = 1; col <= 9; col++) ws.getCell(5, col).border = { bottom: { style: "medium", color: { argb: GOLD } } };
  ws.getRow(5).height = 6;
}

function writeTitle(ws: Worksheet, r: number, title: string, subtitle?: string): number {
  const c = ws.getCell(r, 1);
  c.value = title;
  c.font = font({ size: 12, bold: true, color: { argb: INK } });
  if (!subtitle) return r + 1;
  const sc = ws.getCell(r + 1, 1);
  sc.value = subtitle;
  sc.font = font({ size: 9, italic: true, color: { argb: MUTED } });
  return r + 2;
}

const NUMERIC = new Set(["int", "decimal", "pct", "pct2", "ms"]);

/** Title, branded header row, zebra body with number formats. Returns the next free row (+1 spacer). */
function writeTable(ws: Worksheet, start: number, title: string, columns: Column[], rows: Cell[][], subtitle?: string, empty?: string): number {
  let r = writeTitle(ws, start, title, subtitle);
  const border = { bottom: { style: "thin" as const, color: { argb: HAIR } } };
  columns.forEach((col, i) => {
    const c = ws.getCell(r, i + 1);
    c.value = col.header;
    c.font = font({ bold: true, color: { argb: "FFFFFFFF" } });
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
    c.alignment = { horizontal: NUMERIC.has(col.format ?? "text") ? "right" : "left", vertical: "middle" };
  });
  ws.getRow(r).height = 18;
  r++;
  if (rows.length === 0) {
    ws.mergeCells(r, 1, r, Math.max(1, columns.length));
    const c = ws.getCell(r, 1);
    c.value = empty ?? "No data for this period.";
    c.font = font({ italic: true, color: { argb: MUTED } });
    return r + 2;
  }
  rows.forEach((row, ri) => {
    row.forEach((v, i) => {
      const fmt = columns[i]?.format ?? "text";
      const c: XCell = ws.getCell(r, i + 1);
      c.value = (fmt === "datetime" || fmt === "date") && typeof v === "string" && v ? new Date(v) : v;
      if (EXCEL_NUMFMT[fmt]) c.numFmt = EXCEL_NUMFMT[fmt];
      c.font = font();
      c.border = border;
      c.alignment = { horizontal: NUMERIC.has(fmt) ? "right" : "left", vertical: "top", wrapText: typeof v === "string" && v.length > 60 };
      if (ri % 2 === 1) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZEBRA } };
    });
    r++;
  });
  // Width hints from the displayed text, clamped so long messages wrap instead.
  columns.forEach((col, i) => {
    const longest = Math.max(col.header.length, ...rows.map((row) => formatValue(row[i] ?? null, col.format).length));
    const column = ws.getColumn(i + 1);
    column.width = Math.max(column.width ?? 0, Math.min(60, Math.max(10, longest + 2)));
  });
  return r + 1;
}

/** Chart sections become a data table: label column plus one column per series. */
function chartTable(sec: Extract<Section, { kind: "chart" }>): { columns: Column[]; rows: Cell[][] } {
  if (sec.data.kind === "category") {
    return { columns: [{ header: "Item" }, { header: "Value", format: sec.format }], rows: sec.data.rows.map((r) => [r.label, r.value]) };
  }
  const { x, xLabels, series } = sec.data;
  return {
    columns: [{ header: "Period" }, ...series.map((s) => ({ header: s.label, format: sec.format }))],
    rows: x.map((_, i) => [xLabels[i], ...series.map((s) => s.values[i])]),
  };
}

function finishSheet(ws: Worksheet, lastRow: number, headerRow?: number) {
  // Leave room for the logo even when the first columns hold short values.
  if ((ws.getColumn(1).width ?? 0) < 13) ws.getColumn(1).width = 13;
  if ((ws.getColumn(2).width ?? 0) < 13) ws.getColumn(2).width = 13;
  if (headerRow) {
    ws.views = [{ state: "frozen", ySplit: headerRow, showGridLines: false }];
    ws.pageSetup.printTitlesRow = `${headerRow}:${headerRow}`;
  }
  // Long lists print one page wide rather than unreadably small.
  if (lastRow - CONTENT_ROW > ONE_PAGE_MAX_ROWS) ws.pageSetup.fitToHeight = 0;
  // Times New Roman on every touched cell, including ones written without a font.
  ws.eachRow({ includeEmpty: false }, (row) =>
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.font = { ...font(), ...cell.font, name: BRAND.excelFont };
    })
  );
}
