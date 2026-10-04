import type { jsPDF as JsPDF } from "jspdf";
import { fileName } from "./brand";
import type { ExportFormat, ReportSpec } from "./types";

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Opens the browser print dialog for a PDF without a popup: the PDF loads
 * in a hidden iframe and prints from there (popup blockers would stop a
 * window.open that happens after the async build).
 */
export function printPdf(doc: JsPDF) {
  const url = URL.createObjectURL(doc.output("blob"));
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  frame.src = url;
  frame.onload = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } catch {
      window.open(url, "_blank", "noopener");
    }
  };
  document.body.appendChild(frame);
  // Keep the frame alive long enough for the dialog; clean up afterwards.
  setTimeout(() => {
    frame.remove();
    URL.revokeObjectURL(url);
  }, 120_000);
}

export type ExportAction = "download" | "print";

/** Builds the requested file and downloads (or prints) it. Libraries load on demand. */
export async function runExport(spec: ReportSpec, format: ExportFormat, action: ExportAction = "download", suffix?: string) {
  if (format === "pdf") {
    const { buildPdf } = await import("./pdf");
    const doc = await buildPdf(spec);
    if (action === "print") printPdf(doc);
    else downloadBlob(doc.output("blob"), fileName(spec.slug, suffix, "pdf", spec.generatedAt));
    return;
  }
  const { buildWorkbook } = await import("./xlsx");
  downloadBlob(await buildWorkbook(spec), fileName(spec.slug, suffix, "xlsx", spec.generatedAt));
}
