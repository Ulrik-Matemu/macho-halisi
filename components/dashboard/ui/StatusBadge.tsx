import React from "react";
import { ItineraryStatus } from "@/lib/itineraries/types";

/**
 * Replaces the `getStatusBadge` function duplicated verbatim in both
 * itineraries/page.tsx and itineraries/[id]/page.tsx. Sentence case, no
 * letterspaced uppercase — see .dash-badge in globals.css for the recipe.
 */
export default function StatusBadge({ status }: { status: ItineraryStatus }) {
  const config: Record<ItineraryStatus, { label: string; className: string }> = {
    DRAFT: { label: "Draft", className: "dash-badge--draft" },
    IN_REVIEW: { label: "In review", className: "dash-badge--review" },
    PUBLISHED: { label: "Published", className: "dash-badge--published" },
    ARCHIVED: { label: "Archived", className: "dash-badge--archived" },
  };
  const { label, className } = config[status];
  return <span className={`dash-badge ${className}`}>{label}</span>;
}
