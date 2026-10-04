import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Right-aligns the column (e.g. numeric/actions columns). */
  align?: "left" | "right";
  /** Hidden below the table breakpoint — shown instead inside the stacked card body. */
  className?: string;
}

export interface RowSelection<T> {
  isSelected: (row: T) => boolean;
  onToggle: (row: T, selected: boolean) => void;
  /** "all" | "some" | "none" of the visible rows are selected. */
  state: "all" | "some" | "none";
  onToggleAll: (selected: boolean) => void;
  /** Accessible name for a row's checkbox, e.g. "Select enquiry from Jane". */
  rowLabel: (row: T) => string;
}

interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Renders the row as a stacked card below 900px instead of the raw <table>. */
  renderCard: (row: T) => React.ReactNode;
  /** Adds a checkbox column (and a checkbox beside each card). */
  selection?: RowSelection<T>;
}

function SelectBox({ checked, indeterminate = false, label, onChange }: { checked: boolean; indeterminate?: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate;
      }}
      onChange={(e) => onChange(e.target.checked)}
      className="dash-focusable w-4 h-4 cursor-pointer align-middle"
      style={{ accentColor: "var(--dash-accent-fill)" }}
    />
  );
}

/**
 * Real semantic table (`scope="col"`, `sr-only` caption) at ≥900px;
 * stacked cards below it. The previous tables (Itineraries, Users) just
 * wrapped a fixed-layout table in `overflow-x-auto`, which on a phone
 * means horizontal scrolling to reach the row actions — effectively
 * unusable at 360–414px widths.
 */
export default function DataTable<T>({ caption, columns, rows, rowKey, renderCard, selection }: DataTableProps<T>) {
  return (
    <>
      <div
        className="hidden lg:block rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--dash-border)", background: "var(--dash-surface-1)" }}
      >
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr style={{ background: "var(--dash-surface-2)", borderBottom: "1px solid var(--dash-border)" }}>
              {selection && (
                <th scope="col" className="py-3 pl-6 pr-0 w-10">
                  <SelectBox
                    label="Select all rows on this page"
                    checked={selection.state === "all"}
                    indeterminate={selection.state === "some"}
                    onChange={selection.onToggleAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`dash-label py-3 px-4 first:pl-6 last:pr-6 ${col.align === "right" ? "text-right" : "text-left"} ${col.className ?? ""}`}
                  style={{ color: "var(--dash-text-subtle)" }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors"
                style={{ borderBottom: "1px solid var(--dash-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dash-surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {selection && (
                  <td className="py-3.5 pl-6 pr-0 w-10">
                    <SelectBox label={selection.rowLabel(row)} checked={selection.isSelected(row)} onChange={(v) => selection.onToggle(row, v)} />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3.5 px-4 first:pl-6 last:pr-6 ${col.align === "right" ? "text-right" : "text-left"} ${col.className ?? ""}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {rows.map((row) =>
          selection ? (
            <div key={rowKey(row)} className="flex items-start gap-3">
              <div className="pt-4">
                <SelectBox label={selection.rowLabel(row)} checked={selection.isSelected(row)} onChange={(v) => selection.onToggle(row, v)} />
              </div>
              <div className="flex-1 min-w-0">{renderCard(row)}</div>
            </div>
          ) : (
            <React.Fragment key={rowKey(row)}>{renderCard(row)}</React.Fragment>
          )
        )}
      </div>
    </>
  );
}
