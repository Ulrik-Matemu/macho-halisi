"use client";

import React from "react";
import { BarList, type BarListRow } from "@/components/dashboard/charts/primitives";
import PieChart from "@/components/dashboard/charts/PieChart";
import { topWithOther } from "@/lib/dashboard/chartData";
import type { ChartType } from "@/lib/dashboard/useChartType";

export interface CategoryRow extends BarListRow {
  /** Plain-text label for pie legends (`label` may be JSX). */
  text: string;
}

/**
 * A part-of-whole breakdown as ranked bars (default, keeps the secondary
 * column) or a pie that folds the tail into "Other".
 */
export default function CategoryChart({
  rows,
  type,
  ariaLabel,
  formatValue = (v) => v.toLocaleString("en-US"),
  valueHeader,
  secondaryHeader,
  empty = "No data for this period yet.",
}: {
  rows: CategoryRow[];
  type: ChartType;
  ariaLabel: string;
  formatValue?: (v: number) => string;
  valueHeader?: string;
  secondaryHeader?: string;
  empty?: string;
}) {
  if (type === "pie" && rows.length > 0) {
    return (
      <PieChart
        ariaLabel={ariaLabel}
        formatValue={formatValue}
        empty={empty}
        slices={topWithOther(rows.map((r) => ({ key: r.key, label: r.text, value: r.value })))}
      />
    );
  }
  return <BarList rows={rows} formatValue={formatValue} valueHeader={valueHeader} secondaryHeader={secondaryHeader} empty={empty} />;
}
