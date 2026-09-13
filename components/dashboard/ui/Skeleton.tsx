import React from "react";

/** A single pulsing placeholder block — replaces full-page spinner-only loading states. */
export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ background: "var(--dash-surface-2)", ...style }}
      aria-hidden="true"
    />
  );
}

/** Row-shaped skeleton for tables/lists, with an aria-live announcement for screen readers. */
export function SkeletonRows({ rows = 5, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div className="space-y-3" role="status" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}
