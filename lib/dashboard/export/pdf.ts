import type { jsPDF as JsPDF } from "jspdf";
import { BRAND, formatValue, loadLogo } from "./brand";
import { renderChartImage, type ChartImage } from "./chartImage";
import type { Column, ReportSpec, Section } from "./types";

type Orientation = "portrait" | "landscape";
type AutoTable = (typeof import("jspdf-autotable"))["autoTable"];

/** Shrink steps tried, in order, to get the report onto a single page. */
const SCALES = [1, 0.92, 0.85, 0.78, 0.72];
const MARGIN = 12;
const HEADER_H = 25; // logo + title block + gold rule
const FOOTER_H = 14;
const GUTTER = 6;
const NUMERIC = new Set(["int", "decimal", "pct", "pct2", "ms"]);

// The PDF's built-in Times only covers WinAnsi (Western European). Map the
// few symbols we use to ASCII, strip accents that WinAnsi lacks, and mark
// anything else rather than letting jsPDF emit garbled glyphs.
const WINANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");
const SYMBOLS: Record<string, string> = { "≤": "<=", "≥": ">=", "≈": "~", "→": "->", "←": "<-", "−": "-", "✓": "Yes", "×": "x" };
export function pdfText(input: string): string {
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0;
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WINANSI_EXTRA.has(ch) || ch === "\n") out += ch;
    else if (SYMBOLS[ch]) out += SYMBOLS[ch];
    else {
      const base = ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
      out += base && [...base].every((c) => (c.codePointAt(0) ?? 0) < 0x100) ? base : "?";
    }
  }
  return out;
}

/**
 * Builds the report as an A4 PDF in Times. It first tries to fit
 * everything on one page: each orientation at progressively smaller type
 * and chart sizes. Only if no layout fits does it fall back to normal
 * pagination at full size. Rows are never dropped to make it fit.
 */
export async function buildPdf(spec: ReportSpec): Promise<JsPDF> {
  const [{ jsPDF }, { autoTable }, logo] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    loadLogo().catch(() => null),
  ]);

  const wide = spec.sections.some((s) => s.kind === "table" && s.columns.length > 6);
  const orientations: Orientation[] =
    spec.orientation === "auto" ? (wide ? ["landscape", "portrait"] : ["portrait", "landscape"]) : [spec.orientation];

  const images = new Map<string, ChartImage>();
  // Dry runs only measure: charts are boxes, so no PNG is rasterised or
  // embedded until the winning layout is drawn for real.
  const render = (orientation: Orientation, scale: number, draft: boolean) => {
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4", compress: !draft });
    layout(doc, autoTable, spec, scale, images, draft);
    return doc;
  };

  for (const o of orientations) {
    for (const s of SCALES) {
      if (render(o, s, true).getNumberOfPages() === 1) return finish(render(o, s, false), spec, logo);
    }
  }
  return finish(render(orientations[0], 1, false), spec, logo);
}

interface Ctx {
  doc: JsPDF;
  autoTable: AutoTable;
  s: number;
  W: number;
  H: number;
  top: number;
  bottom: number;
  y: number;
  images: Map<string, ChartImage>;
  draft: boolean;
}

function layout(doc: JsPDF, autoTable: AutoTable, spec: ReportSpec, s: number, images: Map<string, ChartImage>, draft: boolean) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const top = MARGIN + HEADER_H + 2;
  const c: Ctx = { doc, autoTable, s, W, H, top, bottom: H - FOOTER_H - 2, y: top, images, draft };
  doc.setFont(BRAND.pdfFont, "normal");

  // Consecutive half-width sections pair up side by side.
  const rows: Section[][] = [];
  for (const sec of spec.sections) {
    const last = rows[rows.length - 1];
    const half = "half" in sec && sec.half;
    if (half && last && last.length === 1 && "half" in last[0] && last[0].half) last.push(sec);
    else rows.push([sec]);
  }

  for (const row of rows) {
    if (row.length === 1) {
      drawSection(c, row[0], MARGIN, W - 2 * MARGIN);
    } else {
      const colW = (W - 2 * MARGIN - GUTTER) / 2;
      const startPage = doc.getCurrentPageInfo().pageNumber;
      const startY = c.y;
      drawSection(c, row[0], MARGIN, colW);
      const left = { page: doc.getCurrentPageInfo().pageNumber, y: c.y };
      doc.setPage(startPage);
      c.y = startY;
      drawSection(c, row[1], MARGIN + colW + GUTTER, colW);
      const right = { page: doc.getCurrentPageInfo().pageNumber, y: c.y };
      const end = left.page > right.page || (left.page === right.page && left.y > right.y) ? left : right;
      doc.setPage(end.page);
      c.y = end.y;
    }
    c.y += 5 * s;
  }
}

function ensure(c: Ctx, need: number) {
  if (c.y + need <= c.bottom) return;
  c.doc.addPage();
  c.y = c.top;
}

function sectionTitle(c: Ctx, x: number, title: string, subtitle?: string) {
  const { doc, s } = c;
  doc.setFont(BRAND.pdfFont, "bold");
  doc.setFontSize(11.5 * s);
  doc.setTextColor(...BRAND.ink);
  doc.text(pdfText(title), x, c.y + 3.6 * s);
  c.y += 5 * s;
  if (subtitle) {
    doc.setFont(BRAND.pdfFont, "italic");
    doc.setFontSize(8 * s);
    doc.setTextColor(...BRAND.muted);
    doc.text(pdfText(subtitle), x, c.y + 2.6 * s);
    c.y += 3.8 * s;
  }
  c.y += 1.2 * s;
}

function drawSection(c: Ctx, sec: Section, x: number, w: number) {
  const { doc, s } = c;
  switch (sec.kind) {
    case "kpis": {
      const cols = Math.min(sec.items.length, c.W > c.H ? 5 : 4);
      const gap = 3;
      const cellW = (w - gap * (cols - 1)) / cols;
      const cellH = 15 * s;
      const rowsNeeded = Math.ceil(sec.items.length / cols);
      ensure(c, (sec.title ? 7 * s : 0) + cellH * Math.min(rowsNeeded, 2));
      if (sec.title) sectionTitle(c, x, sec.title);
      sec.items.forEach((item, i) => {
        const col = i % cols;
        if (col === 0 && i > 0) c.y += cellH + gap;
        if (col === 0) ensure(c, cellH);
        const cx = x + col * (cellW + gap);
        doc.setDrawColor(...BRAND.hairline);
        doc.setLineWidth(0.2);
        doc.rect(cx, c.y, cellW, cellH);
        doc.setFillColor(...BRAND.gold);
        doc.rect(cx, c.y, 0.8, cellH, "F");
        doc.setFont(BRAND.pdfFont, "normal");
        doc.setFontSize(6.8 * s);
        doc.setTextColor(...BRAND.muted);
        doc.text(pdfText(item.label.toUpperCase()), cx + 3, c.y + 4.6 * s, { charSpace: 0.25 });
        doc.setFont(BRAND.pdfFont, "bold");
        doc.setFontSize(14 * s);
        doc.setTextColor(...BRAND.text);
        doc.text(pdfText(item.value), cx + 3, c.y + 11.4 * s);
        if (item.change) {
          doc.setFont(BRAND.pdfFont, "italic");
          doc.setFontSize(7.5 * s);
          doc.setTextColor(...BRAND.muted);
          doc.text(pdfText(item.change), cx + cellW - 2.5, c.y + 11.4 * s, { align: "right" });
        }
      });
      c.y += cellH;
      return;
    }
    case "chart": {
      const h = (sec.half ? 48 : 58) * s;
      ensure(c, h + 10 * s);
      sectionTitle(c, x, sec.title, sec.subtitle);
      if (c.draft) {
        c.y += h;
        return;
      }
      const key = `${sec.id}|${sec.chartType}|${w.toFixed(1)}|${h.toFixed(1)}`;
      let img = c.images.get(key);
      if (!img) {
        img = renderChartImage(sec, w, h);
        c.images.set(key, img);
      }
      doc.addImage(img.dataUrl, "PNG", x, c.y, w, h, key, "FAST");
      c.y += h;
      return;
    }
    case "table": {
      ensure(c, 22 * s);
      sectionTitle(c, x, sec.title, sec.subtitle);
      drawTable(c, x, w, sec.columns, sec.rows.length ? sec.rows.map((r) => r.map((v, i) => formatValue(v, sec.columns[i]?.format))) : [[sec.empty ?? "No data for this period."]], true);
      return;
    }
    case "keyValue": {
      ensure(c, 16 * s);
      sectionTitle(c, x, sec.title);
      drawTable(c, x, w, [{ header: "" }, { header: "" }], sec.items.map(([k, v]) => [k, v]), false);
      return;
    }
    case "text": {
      ensure(c, 14 * s);
      sectionTitle(c, x, sec.title);
      doc.setFont(BRAND.pdfFont, "normal");
      doc.setFontSize(9.5 * s);
      doc.setTextColor(...BRAND.text);
      const lineH = 4.2 * s;
      for (const line of doc.splitTextToSize(pdfText(sec.body), w) as string[]) {
        ensure(c, lineH);
        doc.text(line, x, c.y + 3.2 * s);
        c.y += lineH;
      }
      return;
    }
  }
}

function drawTable(c: Ctx, x: number, w: number, columns: Column[], body: string[][], head: boolean) {
  const { doc, s } = c;
  const totalWeight = columns.reduce((a, col) => a + (col.width ?? 1), 0);
  const singleNote = body.length === 1 && body[0].length === 1 && columns.length > 1;
  c.autoTable(doc, {
    startY: c.y,
    margin: { left: x, right: c.W - x - w, top: c.top, bottom: c.H - c.bottom },
    tableWidth: w,
    head: head ? [columns.map((col) => pdfText(col.header))] : undefined,
    body: singleNote ? [[{ content: pdfText(body[0][0]), colSpan: columns.length, styles: { halign: "center", fontStyle: "italic", textColor: [...BRAND.muted] } }]] : body.map((r) => r.map(pdfText)),
    showHead: "everyPage",
    theme: "plain",
    styles: {
      font: BRAND.pdfFont,
      fontSize: 8.6 * s,
      cellPadding: { top: 1.3 * s, bottom: 1.3 * s, left: 1.8, right: 1.8 },
      textColor: [...BRAND.text],
      lineColor: [...BRAND.hairline],
      lineWidth: { bottom: 0.15 },
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: { fillColor: [...BRAND.ink], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.2 * s, lineWidth: 0 },
    alternateRowStyles: head ? { fillColor: [...BRAND.zebra] } : undefined,
    columnStyles: Object.fromEntries(
      columns.map((col, i) => [
        i,
        {
          halign: NUMERIC.has(col.format ?? "text") ? "right" : "left",
          cellWidth: columns.length > 1 ? (w * (col.width ?? 1)) / totalWeight : "auto",
          ...(!head && i === 0 ? { fontStyle: "bold", textColor: [...BRAND.muted] } : {}),
        },
      ])
    ),
  });
  c.y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

/** Letterhead and footer on every page, drawn last so "Page x of y" is known. */
function finish(doc: JsPDF, spec: ReportSpec, logo: string | null): JsPDF {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const pages = doc.getNumberOfPages();
  const generated = spec.generatedAt.toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  doc.setProperties({ title: pdfText(`${BRAND.company} — ${spec.title}`), author: BRAND.company, creator: `${BRAND.company} dashboard`, subject: spec.period ?? spec.title });

  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    // Header
    const logoW = 34;
    if (logo) doc.addImage(logo, "JPEG", MARGIN, MARGIN - 2, logoW, logoW / BRAND.logoAspect, "brand-logo", "FAST");
    doc.setFont(BRAND.pdfFont, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.gold);
    doc.text(BRAND.company.toUpperCase(), W - MARGIN, MARGIN + 1, { align: "right", charSpace: 0.6 });
    doc.setFont(BRAND.pdfFont, "bold");
    doc.setFontSize(17);
    doc.setTextColor(...BRAND.ink);
    doc.text(pdfText(spec.title), W - MARGIN, MARGIN + 8, { align: "right" });
    doc.setFont(BRAND.pdfFont, "italic");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.muted);
    const line2 = [spec.subtitle, spec.period].filter(Boolean).join("  ·  ");
    if (line2) doc.text(pdfText(line2), W - MARGIN, MARGIN + 13, { align: "right" });
    doc.setFont(BRAND.pdfFont, "normal");
    doc.setFontSize(7.5);
    doc.text(pdfText(`Generated ${generated}${spec.generatedBy ? ` by ${spec.generatedBy}` : ""}`), W - MARGIN, MARGIN + 17.5, { align: "right" });
    doc.setDrawColor(...BRAND.gold);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, MARGIN + HEADER_H - 4, W - MARGIN, MARGIN + HEADER_H - 4);
    doc.setDrawColor(...BRAND.hairline);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, MARGIN + HEADER_H - 3, W - MARGIN, MARGIN + HEADER_H - 3);

    // Footer
    const fy = H - FOOTER_H + 3.5;
    doc.setDrawColor(...BRAND.hairline);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, fy - 3.5, W - MARGIN, fy - 3.5);
    doc.setFont(BRAND.pdfFont, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.muted);
    doc.text(`${BRAND.company}  ·  Confidential — internal use only`, MARGIN, fy);
    doc.text(`Page ${p} of ${pages}`, W - MARGIN, fy, { align: "right" });
    doc.setFontSize(7);
    doc.text(BRAND.contact, W / 2, fy + 3.6, { align: "center" });
  }
  doc.setPage(pages);
  return doc;
}
