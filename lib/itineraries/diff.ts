import { ItineraryDetail, ItineraryImage, effectiveAltText, hasPendingImageChange } from "./types";

export interface ItineraryDiffEntry {
  label: string;
  before: string;
  after: string;
}

const AVAILABILITY_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  LIMITED: "Limited",
  FULLY_BOOKED: "Fully Booked",
};

function scalarLabel(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

/** The hero image id actually in effect — the explicit choice, or the first gallery image as fallback. */
function resolvedHeroId(itin: ItineraryDetail): string | null {
  return itin.heroImageId ?? itin.images[0]?.id ?? null;
}

function heroImageLabel(itin: ItineraryDetail, id: string | null): string {
  if (!id) return "None";
  const img: ItineraryImage | null | undefined =
    itin.images.find((i) => i.id === id) ?? (itin.heroImage?.id === id ? itin.heroImage : null);
  return img ? effectiveAltText(img) || "Untitled image" : "Untitled image";
}

/**
 * Compares the live itinerary against a pending, not-yet-published edit
 * and returns a flat, human-readable list of what changed — used by
 * PublishChangesModal. Deliberately field-by-field rather than a generic
 * JSON diff: the fields being compared are known and small in number, and
 * a purpose-built comparison reads far better than a library's generic
 * "path changed" output for a non-technical admin reviewing a trip.
 */
export function buildItineraryDiff(live: ItineraryDetail, pending: ItineraryDetail): ItineraryDiffEntry[] {
  const entries: ItineraryDiffEntry[] = [];

  type ScalarKey =
    | "title"
    | "overview"
    | "nights"
    | "priceOnRequest"
    | "startingPrice"
    | "availabilityStatus"
    | "travelInfo"
    | "routeMapUrl"
    | "showRouteMap";

  type ScalarValue = string | number | boolean | null | undefined;
  const scalarFields: Array<{ key: ScalarKey; label: string; format?: (v: ScalarValue) => string }> = [
    { key: "title", label: "Title" },
    { key: "overview", label: "Overview" },
    { key: "nights", label: "Nights" },
    { key: "priceOnRequest", label: "Price on request" },
    { key: "startingPrice", label: "Starting price" },
    {
      key: "availabilityStatus",
      label: "Availability status",
      format: (v) => (typeof v === "string" ? AVAILABILITY_LABEL[v] ?? v : scalarLabel(v)),
    },
    { key: "travelInfo", label: "Travel information" },
    { key: "routeMapUrl", label: "Route map URL" },
    { key: "showRouteMap", label: "Show interactive map" },
  ];

  for (const field of scalarFields) {
    const before = live[field.key];
    const after = pending[field.key];
    if (String(before ?? "") === String(after ?? "")) continue;
    const format = field.format ?? scalarLabel;
    entries.push({ label: field.label, before: format(before), after: format(after) });
  }

  const beforeDayCount = live.days.length;
  const afterDayCount = pending.days.length;
  const changedDays = pending.days.filter((day, idx) => {
    const liveDay = live.days[idx];
    if (!liveDay) return true;
    return JSON.stringify(liveDay) !== JSON.stringify(day);
  }).length;
  if (beforeDayCount !== afterDayCount || changedDays > 0) {
    entries.push({
      label: "Day-by-day itinerary",
      before: `${beforeDayCount} day${beforeDayCount === 1 ? "" : "s"}`,
      after:
        afterDayCount === beforeDayCount
          ? `${afterDayCount} day${afterDayCount === 1 ? "" : "s"}, ${changedDays} changed`
          : `${afterDayCount} day${afterDayCount === 1 ? "" : "s"}`,
    });
  }

  const listFields: Array<{ key: "inclusions" | "exclusions"; label: string }> = [
    { key: "inclusions", label: "Inclusions" },
    { key: "exclusions", label: "Exclusions" },
  ];
  for (const field of listFields) {
    const before = live[field.key];
    const after = pending[field.key];
    if (JSON.stringify(before) === JSON.stringify(after)) continue;
    entries.push({
      label: field.label,
      before: `${before.length} item${before.length === 1 ? "" : "s"}`,
      after: `${after.length} item${after.length === 1 ? "" : "s"}`,
    });
  }

  const beforeDestinations = live.destinations.map((d) => d.destination.id).sort();
  const afterDestinations = pending.destinations.map((d) => d.destination.id).sort();
  if (JSON.stringify(beforeDestinations) !== JSON.stringify(afterDestinations)) {
    entries.push({
      label: "Destinations",
      before: live.destinations.map((d) => d.destination.name).join(", ") || "None",
      after: pending.destinations.map((d) => d.destination.name).join(", ") || "None",
    });
  }

  // Hero image — the explicit "Set as hero" choice, a normal staged
  // scalar field like any other (see Itinerary.heroImageId).
  const beforeHeroId = resolvedHeroId(live);
  const afterHeroId = resolvedHeroId(pending);
  if (beforeHeroId !== afterHeroId) {
    entries.push({
      label: "Hero image",
      before: heroImageLabel(live, beforeHeroId),
      after: heroImageLabel(pending, afterHeroId),
    });
  }

  // Gallery — uploads, removals, reordering and alt-text edits are staged
  // per-image (see the /:id/images route handlers) rather than as part of
  // this same scalar revision, so they're summarized separately here.
  const pendingImageChanges = pending.images.filter(hasPendingImageChange);
  if (pendingImageChanges.length > 0) {
    const added = pendingImageChanges.filter((i) => i.status === "PENDING_ADD").length;
    const removed = pendingImageChanges.filter((i) => i.status === "PENDING_DELETE").length;
    const edited = pendingImageChanges.length - added - removed;
    const parts = [
      added > 0 ? `${added} new` : null,
      removed > 0 ? `${removed} to remove` : null,
      edited > 0 ? `${edited} reordered/edited` : null,
    ].filter((p): p is string => p !== null);
    entries.push({
      label: "Gallery",
      before: `${live.images.length} image${live.images.length === 1 ? "" : "s"} live`,
      after: parts.join(", "),
    });
  }

  return entries;
}
