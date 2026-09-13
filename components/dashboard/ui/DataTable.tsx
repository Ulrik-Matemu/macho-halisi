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

interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Renders the row as a stacked card below 900px instead of the raw <table>. */
  renderCard: (row: T) => React.ReactNode;
}

/**
 * Real semantic table (`scope="col"`, `sr-only` caption) at ≥900px;
 * stacked cards below it. The previous tables (Itineraries, Users) just
 * wrapped a fixed-layout table in `overflow-x-auto`, which on a phone
 * means horizontal scrolling to reach the row actions — effectively
 * unusable at 360–414px widths.
 */
export default function DataTable<T>({ caption, columns, rows, rowKey, renderCard }: DataTableProps<T>) {
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

      <div className="lg:hidden space-y-3">{rows.map((row) => <React.Fragment key={rowKey(row)}>{renderCard(row)}</React.Fragment>)}</div>
    </>
  );
}
