import { ENQUIRY_STATUSES, type Enquiry, type EnquiryStatus } from "@/lib/enquiries/types";
import { formatEnquiryRef } from "@/lib/enquiries/submit";
import { countryName } from "@/lib/dashboard/format";
import type { Cell, Column, ReportSpec, Section } from "@/lib/dashboard/export/types";
import { SHARE_TYPES, TREND_TYPES } from "@/lib/dashboard/useChartType";
import { applyChartChoice, gbDateTime, getJson, type ReportDefinition } from "./common";

const statusLabel = (s: EnquiryStatus) => ENQUIRY_STATUSES.find((x) => x.key === s)?.label ?? s;
const origin = (e: Enquiry) => (e.country ? [e.city, countryName(e.country)].filter(Boolean).join(", ") : null);
const trip = (e: Enquiry) => e.itinerary?.title ?? null;

/** Every exportable column; the dialog lets staff pick which ones to include. */
const COLUMNS: { key: string; label: string; defaultOn: boolean; column: Column; value: (e: Enquiry) => Cell }[] = [
  { key: "ref", label: "Reference", defaultOn: true, column: { header: "Ref.", width: 1 }, value: (e) => formatEnquiryRef(e.id) },
  { key: "received", label: "Received", defaultOn: true, column: { header: "Received", format: "datetime", width: 1.5 }, value: (e) => e.createdAt },
  { key: "name", label: "Guest name", defaultOn: true, column: { header: "Guest", width: 1.5 }, value: (e) => e.name },
  { key: "email", label: "Email", defaultOn: true, column: { header: "Email", width: 2 }, value: (e) => e.email },
  { key: "phone", label: "Phone", defaultOn: true, column: { header: "Phone", width: 1.4 }, value: (e) => e.phone },
  { key: "trip", label: "Itinerary", defaultOn: true, column: { header: "Itinerary", width: 1.8 }, value: trip },
  { key: "party", label: "Party size", defaultOn: true, column: { header: "Party", width: 0.8 }, value: (e) => e.partySize },
  { key: "dates", label: "Travel dates", defaultOn: true, column: { header: "Dates", width: 1.2 }, value: (e) => e.preferredDates },
  { key: "origin", label: "Origin", defaultOn: false, column: { header: "Origin", width: 1.3 }, value: origin },
  { key: "source", label: "Came from", defaultOn: false, column: { header: "Came from", width: 1.2 }, value: (e) => e.referrerHost ?? e.utmSource },
  { key: "status", label: "Status", defaultOn: true, column: { header: "Status", width: 1 }, value: (e) => statusLabel(e.status) },
  { key: "message", label: "Message", defaultOn: false, column: { header: "Message", width: 3 }, value: (e) => e.message },
  { key: "notes", label: "Staff notes", defaultOn: false, column: { header: "Staff notes", width: 2.5 }, value: (e) => e.staffNotes },
  { key: "handledBy", label: "Handled by", defaultOn: false, column: { header: "Handled by", width: 1.6 }, value: (e) => e.handledBy?.email ?? null },
];

export interface EnquiryScope {
  status?: EnquiryStatus;
  q?: string;
  ids?: string[];
  /** Human description for the report subtitle, e.g. "Status: New". */
  label: string;
}

export function enquiryListReport(scope: EnquiryScope, generatedBy?: string): ReportDefinition {
  return {
    title: "Export enquiries",
    description: scope.ids ? `${scope.ids.length} selected enquir${scope.ids.length === 1 ? "y" : "ies"}.` : `Every enquiry matching the current view (${scope.label}), across all pages.`,
    options: [
      { id: "summary", label: "Summary by status", kind: "section", defaultOn: true },
      { id: "byStatus", label: "Enquiries by status", kind: "chart", defaultChartType: "pie", chartTypes: SHARE_TYPES, defaultOn: false },
      { id: "byCountry", label: "Enquiries by country", kind: "chart", defaultChartType: "bar", chartTypes: ["bar"], defaultOn: false },
      { id: "overTime", label: "Enquiries over time", kind: "chart", defaultChartType: "bar", chartTypes: TREND_TYPES, defaultOn: false },
      { id: "list", label: "Enquiry list", kind: "section", defaultOn: true },
    ],
    columns: COLUMNS.map(({ key, label, defaultOn }) => ({ key, label, defaultOn })),
    async build({ include, chartTypes, columns }) {
      const params = new URLSearchParams();
      if (scope.ids) params.set("ids", scope.ids.join(","));
      else {
        if (scope.status) params.set("status", scope.status);
        if (scope.q) params.set("q", scope.q);
      }
      const { data, truncated } = await getJson<{ data: Enquiry[]; truncated: boolean }>(`/api/enquiries/admin/export?${params}`);

      const sections: Section[] = [];
      if (include.has("summary")) {
        sections.push({
          kind: "kpis",
          id: "summary",
          items: [
            { label: "Enquiries", value: data.length.toLocaleString("en-US") },
            ...ENQUIRY_STATUSES.map((s) => ({ label: s.label, value: data.filter((e) => e.status === s.key).length.toLocaleString("en-US") })),
          ],
        });
      }
      const count = (key: (e: Enquiry) => string) => {
        const m = new Map<string, number>();
        data.forEach((e) => m.set(key(e), (m.get(key(e)) ?? 0) + 1));
        return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
      };
      if (include.has("byStatus")) {
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "byStatus",
              title: "By status",
              chartType: "pie",
              format: "int",
              half: true,
              data: { kind: "category", rows: ENQUIRY_STATUSES.map((s) => ({ label: s.label, value: data.filter((e) => e.status === s.key).length })) },
            },
            chartTypes.byStatus
          )
        );
      }
      if (include.has("byCountry")) {
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "byCountry",
              title: "By country",
              subtitle: "Top 8",
              chartType: "bar",
              format: "int",
              half: true,
              data: { kind: "category", rows: count((e) => (e.country ? countryName(e.country) : "Unknown")).slice(0, 8) },
            },
            chartTypes.byCountry
          )
        );
      }
      if (include.has("overTime")) {
        const days = count((e) => e.createdAt.slice(0, 10)).sort((a, b) => a.label.localeCompare(b.label));
        sections.push(
          applyChartChoice(
            {
              kind: "chart",
              id: "overTime",
              title: "Enquiries over time",
              subtitle: "Per day received",
              chartType: "bar",
              format: "int",
              data: {
                kind: "trend",
                x: days.map((d) => d.label),
                xLabels: days.map((d) => new Date(d.label).toLocaleDateString("en-GB", { day: "numeric", month: "short" })),
                series: [{ label: "Enquiries", values: days.map((d) => d.value) }],
              },
            },
            chartTypes.overTime
          )
        );
      }
      if (include.has("list")) {
        const cols = COLUMNS.filter((c) => columns.has(c.key));
        sections.push({
          kind: "table",
          id: "list",
          title: "Enquiries",
          subtitle: truncated ? `Showing the newest ${data.length.toLocaleString("en-US")} — narrow the filter to export older enquiries.` : `${data.length.toLocaleString("en-US")} enquir${data.length === 1 ? "y" : "ies"}, newest first`,
          columns: cols.map((c) => c.column),
          rows: data.map((e) => cols.map((c) => c.value(e))),
          empty: "No enquiries match this view.",
        });
      }

      return {
        slug: "enquiries",
        title: "Enquiries Report",
        subtitle: scope.label,
        period: data.length ? `${gbDateTime(data[data.length - 1].createdAt)} – ${gbDateTime(data[0].createdAt)}` : undefined,
        generatedBy,
        generatedAt: new Date(),
        orientation: cols(columns) > 6 ? "landscape" : "auto",
        sections,
      };
    },
  };
}

const cols = (columns: Set<string>) => COLUMNS.filter((c) => columns.has(c.key)).length;

/** One enquiry as a single-page record: contact, trip, attribution, message, notes, journey. */
export function enquiryDetailSpec(enquiry: Enquiry, journey: { path: string; createdAt: string }[], generatedBy?: string): ReportSpec {
  const sections: Section[] = [
    {
      kind: "keyValue",
      id: "guest",
      title: "Guest",
      half: true,
      items: [
        ["Name", enquiry.name],
        ["Email", enquiry.email],
        ["Phone", enquiry.phone],
        ["Origin", origin(enquiry) ?? "—"],
      ],
    },
    {
      kind: "keyValue",
      id: "trip",
      title: "Trip",
      half: true,
      items: [
        ["Itinerary", trip(enquiry) ?? "—"],
        ["Travel dates", enquiry.preferredDates ?? "—"],
        ["Party size", enquiry.partySize ?? "—"],
        ["Status", statusLabel(enquiry.status)],
      ],
    },
    {
      kind: "keyValue",
      id: "attribution",
      title: "Handling & attribution",
      items: [
        ["Received", gbDateTime(enquiry.createdAt)],
        ["Form", enquiry.source === "studio" ? "Enquire page" : enquiry.source === "modal" ? "Quick enquiry modal" : "—"],
        ["Submitted on", enquiry.pagePath ?? "—"],
        ["Came from", enquiry.utmSource ? `${enquiry.referrerHost ?? "direct"} (utm: ${enquiry.utmSource})` : enquiry.referrerHost ?? "Direct / unknown"],
        ["Last handled by", enquiry.handledBy ? `${enquiry.handledBy.email}${enquiry.respondedAt ? ` · responded ${gbDateTime(enquiry.respondedAt)}` : ""}` : "—"],
      ],
    },
  ];
  if (enquiry.message) sections.push({ kind: "text", id: "message", title: "Message", body: enquiry.message });
  if (enquiry.staffNotes) sections.push({ kind: "text", id: "notes", title: "Staff notes", body: enquiry.staffNotes });
  if (journey.length) {
    sections.push({
      kind: "table",
      id: "journey",
      title: "Pages viewed before enquiring",
      columns: [{ header: "#", format: "int", width: 0.4 }, { header: "Page", width: 4 }, { header: "Time", format: "datetime", width: 1.6 }],
      rows: journey.map((j, i) => [i + 1, j.path, j.createdAt]),
    });
  }
  return {
    slug: "enquiry",
    title: "Enquiry Record",
    subtitle: `${formatEnquiryRef(enquiry.id)}  ·  ${enquiry.name}`,
    period: `Received ${gbDateTime(enquiry.createdAt)}`,
    generatedBy,
    generatedAt: new Date(),
    orientation: "portrait",
    sections,
  };
}
