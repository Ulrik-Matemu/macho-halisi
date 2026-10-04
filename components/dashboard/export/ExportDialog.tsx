"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import Dialog from "@/components/dashboard/ui/Dialog";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { inputStyle } from "@/components/dashboard/ui/Field";
import { Segmented } from "@/components/dashboard/charts/primitives";
import { CHART_TYPES, readChartType } from "@/lib/dashboard/useChartType";
import type { ExportFormat } from "@/lib/dashboard/export/types";
import type { ExportAction } from "@/lib/dashboard/export/download";
import type { ExportChartChoice, ReportDefinition } from "@/lib/dashboard/reports/common";

const CHOICES: { key: ExportChartChoice; label: string }[] = [...CHART_TYPES, { key: "table", label: "Table only" }];

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer min-w-0" style={{ color: "var(--dash-text)" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 shrink-0 cursor-pointer" style={{ accentColor: "var(--dash-accent-fill)" }} />
      <span className="truncate">{children}</span>
    </label>
  );
}

/**
 * Lets staff shape a report before exporting: format, which sections and
 * graphs to include, and how each graph is drawn. Chart types default to
 * whatever that chart currently shows on screen. Mount it only while open
 * so those defaults are read fresh each time.
 */
export default function ExportDialog({ report, onClose }: { report: ReportDefinition; onClose: () => void }) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [include, setInclude] = useState(() => new Set(report.options.filter((o) => o.defaultOn).map((o) => o.id)));
  const [chartTypes, setChartTypes] = useState<Record<string, ExportChartChoice>>(() =>
    Object.fromEntries(
      report.options
        .filter((o) => o.kind === "chart")
        .map((o) => [o.id, o.chartId ? readChartType(o.chartId, o.defaultChartType ?? "bar", o.chartTypes) : (o.defaultChartType ?? "bar")])
    )
  );
  const [columns, setColumns] = useState(() => new Set((report.columns ?? []).filter((c) => c.defaultOn).map((c) => c.key)));
  const [busy, setBusy] = useState<ExportAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (set: Set<string>, key: string, on: boolean) => {
    const next = new Set(set);
    if (on) next.add(key);
    else next.delete(key);
    return next;
  };

  const run = async (action: ExportAction) => {
    setBusy(action);
    setError(null);
    try {
      const spec = await report.build({ include, chartTypes, columns });
      if (spec.sections.length === 0) throw new Error("Choose at least one section to export.");
      const { runExport } = await import("@/lib/dashboard/export/download");
      await runExport(spec, format, action);
      if (action === "download") onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  };

  const nothing = include.size === 0 || (report.columns && include.has("list") && columns.size === 0);

  return (
    <Dialog
      open
      onClose={onClose}
      title={report.title}
      description={report.description}
      size="lg"
      scrollable
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy !== null}>
            Cancel
          </Button>
          {format === "pdf" && (
            <Button variant="secondary" icon={<Printer className="w-4 h-4" />} loading={busy === "print"} disabled={Boolean(nothing) || busy !== null} onClick={() => run("print")}>
              Print
            </Button>
          )}
          <Button variant="primary" icon={<Download className="w-4 h-4" />} loading={busy === "download"} disabled={Boolean(nothing) || busy !== null} onClick={() => run("download")}>
            Download {format === "pdf" ? "PDF" : "Excel"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {error && <InlineMessage tone="error">{error}</InlineMessage>}

        <div className="space-y-2">
          <p className="dash-label" style={{ color: "var(--dash-text-muted)" }}>
            Format
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              label="File format"
              value={format}
              onChange={setFormat}
              options={[
                { key: "pdf", label: "PDF document" },
                { key: "xlsx", label: "Excel workbook (.xlsx)" },
              ]}
            />
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
              {format === "pdf" ? <FileText className="w-3.5 h-3.5" aria-hidden="true" /> : <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />}
              {format === "pdf" ? "Fitted" : "One sheet per chart and table, each set to print on one page."}
            </span>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="dash-label mb-2" style={{ color: "var(--dash-text-muted)" }}>
            Include
          </legend>
          <ul className="divide-y rounded-lg" style={{ border: "1px solid var(--dash-border)", borderColor: "var(--dash-border)" }}>
            {report.options.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5" style={{ borderColor: "var(--dash-border)" }}>
                <Check checked={include.has(o.id)} onChange={(on) => setInclude((s) => toggle(s, o.id, on))}>
                  {o.label}
                </Check>
                {o.kind === "chart" && (
                  <label className="flex items-center gap-2 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    <span className="sr-only">{o.label} — </span>Show as
                    <select
                      value={chartTypes[o.id]}
                      disabled={!include.has(o.id)}
                      onChange={(e) => setChartTypes((t) => ({ ...t, [o.id]: e.target.value as ExportChartChoice }))}
                      className="dash-focusable rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                      style={inputStyle}
                    >
                      {CHOICES.filter((c) => c.key === "table" || !o.chartTypes || o.chartTypes.includes(c.key)).map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </li>
            ))}
          </ul>
        </fieldset>

        {report.columns && include.has("list") && (
          <fieldset>
            <legend className="dash-label mb-2" style={{ color: "var(--dash-text-muted)" }}>
              Columns in the list
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {report.columns.map((c) => (
                <Check key={c.key} checked={columns.has(c.key)} onChange={(on) => setColumns((s) => toggle(s, c.key, on))}>
                  {c.label}
                </Check>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--dash-text-subtle)" }}>
              More than six columns switches the PDF to landscape. Long messages wrap rather than being cut.
            </p>
          </fieldset>
        )}
      </div>
    </Dialog>
  );
}
