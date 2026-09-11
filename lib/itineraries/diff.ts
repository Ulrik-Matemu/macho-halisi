import { ItineraryDetail } from "./types";

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

  return entries;
}
