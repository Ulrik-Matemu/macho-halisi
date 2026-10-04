"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  Mail,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Clock,
  MapPin,
  MoreHorizontal,
  Download,
  Printer,
  FileText,
  Copy,
  ChevronDown,
  X,
} from "lucide-react";
import AdminOnly from "@/components/dashboard/AdminOnly";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Dialog from "@/components/dashboard/ui/Dialog";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { SkeletonRows, Skeleton } from "@/components/dashboard/ui/Skeleton";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import DataTable, { Column } from "@/components/dashboard/ui/DataTable";
import Menu, { type MenuEntry } from "@/components/dashboard/ui/Menu";
import ExportDialog from "@/components/dashboard/export/ExportDialog";
import { Segmented } from "@/components/dashboard/charts/primitives";
import { useAuth } from "@/lib/dashboard/auth-context";
import { enquiryDetailSpec, enquiryListReport, type EnquiryScope } from "@/lib/dashboard/reports/enquiries";
import type { ExportAction } from "@/lib/dashboard/export/download";
import { ENQUIRY_STATUSES, type Enquiry, type EnquiryStats, type EnquiryStatus } from "@/lib/enquiries/types";
import { formatEnquiryRef } from "@/lib/enquiries/submit";
import { countryFlag, countryName, formatDateTime, formatRelative } from "@/lib/dashboard/format";

const STATUS_BADGE: Record<EnquiryStatus, string> = {
  NEW: "dash-badge--draft",
  IN_PROGRESS: "dash-badge--review",
  RESPONDED: "dash-badge--published",
  CLOSED: "dash-badge--archived",
};

function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`dash-badge ${STATUS_BADGE[status]}`}>{ENQUIRY_STATUSES.find((s) => s.key === status)?.label ?? status}</span>;
}

const STATUS_DOT: Record<EnquiryStatus, string> = {
  NEW: "var(--dash-status-draft)",
  IN_PROGRESS: "var(--dash-status-review)",
  RESPONDED: "var(--dash-status-published)",
  CLOSED: "var(--dash-status-archived)",
};

function EnquiryDot({ status }: { status: EnquiryStatus }) {
  return <span className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[status] }} />;
}

type Filter = "ALL" | EnquiryStatus;

function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

/** Backend calls return `{ status: "ok", ... }`; anything else becomes a thrown message. */
async function send<T = Record<string, unknown>>(url: string, init: RequestInit, fallback: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error("Network error while connecting to server.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== "ok") throw new Error(data.message || fallback);
  return data as T;
}

const setStatus = (id: string, status: EnquiryStatus) =>
  send(`/api/enquiries/admin/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }, "Failed to update status.");

const bulkAction = (ids: string[], action: "delete" | "status", status?: EnquiryStatus) =>
  send<{ count: number }>(
    "/api/enquiries/admin/bulk",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, action, status }) },
    action === "delete" ? "Failed to delete enquiries." : "Failed to update enquiries."
  );

/** Single-enquiry record as a one-page PDF (download or print). */
async function exportEnquiry(enquiry: Enquiry, journey: { path: string; createdAt: string }[], action: ExportAction, generatedBy?: string) {
  const { runExport } = await import("@/lib/dashboard/export/download");
  await runExport(enquiryDetailSpec(enquiry, journey, generatedBy), "pdf", action, formatEnquiryRef(enquiry.id));
}

async function exportEnquiryById(id: string, action: ExportAction, generatedBy?: string) {
  const data = await send<{ enquiry: Enquiry; journey?: { path: string; createdAt: string }[] }>(`/api/enquiries/admin/${id}`, { method: "GET" }, "Failed to load enquiry.");
  await exportEnquiry(data.enquiry, data.journey ?? [], action, generatedBy);
}

function EnquiryDetail({
  enquiryId,
  onClose,
  onChanged,
}: {
  enquiryId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [journey, setJourney] = useState<{ path: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<EnquiryStatus>("NEW");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState<ExportAction | null>(null);
  const { user } = useAuth();

  const runExport = async (action: ExportAction) => {
    if (!enquiry) return;
    setExporting(action);
    setError(null);
    try {
      await exportEnquiry(enquiry, journey, action, user?.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(null);
    }
  };

  useEffect(() => {
    // Mounted fresh per enquiry (keyed by id), so there's no stale state to reset.
    if (!enquiryId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/enquiries/admin/${enquiryId}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.status === "ok") {
          setEnquiry(data.enquiry);
          setJourney(data.journey ?? []);
          setStatus(data.enquiry.status);
          setNotes(data.enquiry.staffNotes ?? "");
        } else {
          setError(data.message || "Failed to load enquiry.");
        }
      } catch {
        if (!cancelled) setError("Network error while loading enquiry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enquiryId]);

  const save = async () => {
    if (!enquiry) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/enquiries/admin/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, staffNotes: notes }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        setError(data.message || "Failed to save changes.");
        return;
      }
      setEnquiry(data.enquiry);
      onChanged();
      onClose();
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!enquiry) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/enquiries/admin/${enquiry.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        setError(data.message || "Failed to delete enquiry.");
        return;
      }
      onChanged();
      onClose();
    } catch {
      setError("Network error while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  const dirty = enquiry && (status !== enquiry.status || (notes || "") !== (enquiry.staffNotes || ""));

  return (
    <Dialog
      open={Boolean(enquiryId)}
      onClose={onClose}
      title={enquiry ? enquiry.name : "Enquiry"}
      description={enquiry ? `${formatEnquiryRef(enquiry.id)} · received ${formatDateTime(enquiry.createdAt)}` : undefined}
      size="lg"
      scrollable
      footer={
        enquiry && (
          <>
            {confirmDelete ? (
              <>
                <span className="text-sm mr-auto" style={{ color: "var(--dash-status-danger)" }}>
                  Permanently delete this enquiry?
                </span>
                <Button variant="ghost" disabled={deleting} onClick={() => setConfirmDelete(false)}>
                  Keep
                </Button>
                <Button variant="danger" loading={deleting} onClick={remove}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" icon={<Trash2 className="w-4 h-4" />} onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
                <span className="mr-auto flex items-center">
                  <IconButton label="Download as PDF" disabled={exporting !== null} onClick={() => runExport("download")}>
                    <FileText className="w-4 h-4" />
                  </IconButton>
                  <IconButton label="Print" disabled={exporting !== null} onClick={() => runExport("print")}>
                    <Printer className="w-4 h-4" />
                  </IconButton>
                </span>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" loading={saving} disabled={!dirty} onClick={save}>
                  Save changes
                </Button>
              </>
            )}
          </>
        )
      }
    >
      {loading && !enquiry ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : enquiry ? (
        <div className="space-y-6">
          {error && <InlineMessage tone="error">{error}</InlineMessage>}

          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${enquiry.email}`} className="dash-focusable inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
              <Mail className="w-4 h-4" style={{ color: "var(--dash-accent)" }} /> {enquiry.email}
            </a>
            <a href={`tel:${enquiry.phone}`} className="dash-focusable inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
              <Phone className="w-4 h-4" style={{ color: "var(--dash-accent)" }} /> {enquiry.phone}
            </a>
            <a href={whatsappLink(enquiry.phone)} target="_blank" rel="noopener noreferrer" className="dash-focusable inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
              <MessageCircle className="w-4 h-4" style={{ color: "var(--dash-accent)" }} /> WhatsApp
            </a>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              ["Travel dates", enquiry.preferredDates],
              ["Party size", enquiry.partySize],
              ["Itinerary", enquiry.itinerary ? <Link key="it" href={`/itineraries/${enquiry.itinerary.slug}`} target="_blank" className="underline" style={{ color: "var(--dash-accent)" }}>{enquiry.itinerary.title}</Link> : null],
              ["Form", enquiry.source === "studio" ? "Enquire page" : enquiry.source === "modal" ? "Quick enquiry modal" : null],
              ["Location", enquiry.country ? `${countryFlag(enquiry.country)} ${[enquiry.city, countryName(enquiry.country)].filter(Boolean).join(", ")}` : null],
              ["Came from", enquiry.utmSource ? `${enquiry.referrerHost ?? "direct"} (utm: ${enquiry.utmSource})` : enquiry.referrerHost ?? (enquiry.sessionId ? "Direct / unknown" : null)],
              ["Submitted on", enquiry.pagePath],
              ["Last handled by", enquiry.handledBy ? `${enquiry.handledBy.email}${enquiry.respondedAt ? ` · responded ${formatDateTime(enquiry.respondedAt)}` : ""}` : null],
            ].map(([label, value]) => (
              <div key={label as string} className="space-y-0.5">
                <dt className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
                  {label}
                </dt>
                <dd className="text-sm" style={{ color: value ? "var(--dash-text)" : "var(--dash-text-subtle)" }}>
                  {value || "—"}
                </dd>
              </div>
            ))}
          </dl>

          {enquiry.message && (
            <div className="space-y-1">
              <h3 className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
                Message
              </h3>
              <p className="text-sm whitespace-pre-wrap p-3 rounded-md" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)", color: "var(--dash-text)" }}>
                {enquiry.message}
              </p>
            </div>
          )}

          {journey.length > 0 && (
            <div className="space-y-1">
              <h3 className="dash-label" style={{ color: "var(--dash-text-subtle)" }}>
                Pages viewed before enquiring
              </h3>
              <ol className="space-y-1 text-xs">
                {journey.map((j, i) => (
                  <li key={`${j.createdAt}-${i}`} className="flex items-center justify-between gap-3">
                    <span className="dash-code truncate" style={{ color: "var(--dash-text)" }}>
                      {i + 1}. {j.path}
                    </span>
                    <span className="shrink-0" style={{ color: "var(--dash-text-subtle)" }}>
                      {new Date(j.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2" style={{ borderTop: "1px solid var(--dash-border)" }}>
            <Field label="Status">
              {({ id }) => (
                <select id={id} value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus)} className={inputClass} style={inputStyle}>
                  {ENQUIRY_STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <div className="sm:col-span-2">
              <Field label="Staff notes" hint="Internal only — never shown to the guest.">
                {({ id }) => (
                  <textarea id={id} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} style={inputStyle} placeholder="Call summary, proposal sent, follow-up date…" />
                )}
              </Field>
            </div>
          </div>
        </div>
      ) : (
        error && <InlineMessage tone="error">{error}</InlineMessage>
      )}
    </Dialog>
  );
}

type ConfirmDelete = { ids: string[]; label: string } | null;

function EnquiriesInbox() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("NEW");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [nonce, setNonce] = useState(0);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmDelete>(null);
  const [busy, setBusy] = useState(false);
  const [exportScope, setExportScope] = useState<EnquiryScope | null>(null);

  // Loading is derived: the current request differs from the last one answered.
  const requestKey = `${page}|${filter}|${debouncedQuery}|${nonce}`;
  const loading = loadedKey !== requestKey;
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  // Selection belongs to one view (page + filter + search); changing the view
  // drops it without an effect. Only ids still on screen count.
  const viewKey = `${page}|${filter}|${debouncedQuery}`;
  const [selection, setSelection] = useState<{ view: string; ids: Set<string> }>({ view: viewKey, ids: new Set() });
  const selectedIds = selection.view === viewKey ? selection.ids : new Set<string>();
  const selectedRows = enquiries.filter((e) => selectedIds.has(e.id));
  const setSelected = (ids: Set<string>) => setSelection({ view: viewKey, ids });

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filter !== "ALL") params.set("status", filter);
    if (debouncedQuery) params.set("q", debouncedQuery);

    (async () => {
      let nextError: string | null = null;
      try {
        const [listRes, statsRes] = await Promise.all([fetch(`/api/enquiries/admin?${params}`), fetch("/api/enquiries/admin/stats")]);
        const [list, statsData] = await Promise.all([listRes.json(), statsRes.json()]);
        if (cancelled) return;
        if (listRes.ok && list.status === "ok") {
          setEnquiries(list.data);
          setTotalPages(list.pagination?.totalPages ?? 1);
        } else {
          nextError = list.message || "Failed to load enquiries.";
        }
        if (statsRes.ok && statsData.status === "ok") setStats(statsData);
      } catch {
        nextError = "Network error while connecting to server.";
      }
      if (!cancelled) {
        setError(nextError);
        setLoadedKey(requestKey);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, filter, debouncedQuery, requestKey]);

  /** Runs an action with shared busy/error/notice handling, then refreshes the list. */
  const act = async (fn: () => Promise<string | void>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const message = await fn();
      if (message) setNotice(message);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const plural = (n: number) => `${n} enquir${n === 1 ? "y" : "ies"}`;
  const statusName = (st: EnquiryStatus) => ENQUIRY_STATUSES.find((x) => x.key === st)?.label ?? st;

  const changeStatus = (ids: string[], status: EnquiryStatus) =>
    act(async () => {
      if (ids.length === 1) await setStatus(ids[0], status);
      else await bulkAction(ids, "status", status);
      setSelected(new Set());
      return `${plural(ids.length)} marked as ${statusName(status).toLowerCase()}.`;
    });

  const confirmDelete = () => {
    if (!confirm) return;
    const { ids } = confirm;
    return act(async () => {
      await bulkAction(ids, "delete");
      setConfirm(null);
      setSelected(new Set());
      return `${plural(ids.length)} deleted.`;
    });
  };

  const exportOne = (e: Enquiry, action: ExportAction) =>
    act(async () => {
      await exportEnquiryById(e.id, action, user?.email);
    });

  const copy = (text: string, what: string) =>
    act(async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        throw new Error("Couldn't copy — your browser blocked clipboard access.");
      }
      return `${what} copied.`;
    });

  const statusItems = (ids: string[], current?: EnquiryStatus): MenuEntry[] =>
    ENQUIRY_STATUSES.map((st) => ({
      label: `Mark as ${st.label.toLowerCase()}`,
      icon: <EnquiryDot status={st.key} />,
      disabled: st.key === current,
      onSelect: () => changeStatus(ids, st.key),
    }));

  const rowMenu = (e: Enquiry): MenuEntry[] => [
    { label: "View details", icon: <Eye className="w-4 h-4" />, onSelect: () => setOpenId(e.id) },
    { kind: "heading", label: "Status" },
    ...statusItems([e.id], e.status),
    { kind: "heading", label: "Reply" },
    { label: "Reply by email", icon: <Mail className="w-4 h-4" />, onSelect: () => window.open(`mailto:${e.email}?subject=${encodeURIComponent(`Your Macho Halisi enquiry ${formatEnquiryRef(e.id)}`)}`, "_self") },
    { label: "WhatsApp", icon: <MessageCircle className="w-4 h-4" />, onSelect: () => window.open(whatsappLink(e.phone), "_blank", "noopener,noreferrer") },
    { label: "Call", icon: <Phone className="w-4 h-4" />, onSelect: () => window.open(`tel:${e.phone}`, "_self") },
    { label: "Copy email", icon: <Copy className="w-4 h-4" />, onSelect: () => copy(e.email, "Email address") },
    { label: "Copy reference", icon: <Copy className="w-4 h-4" />, hint: formatEnquiryRef(e.id), onSelect: () => copy(formatEnquiryRef(e.id), "Reference") },
    { kind: "heading", label: "Export" },
    { label: "Download PDF", icon: <FileText className="w-4 h-4" />, onSelect: () => exportOne(e, "download") },
    { label: "Print", icon: <Printer className="w-4 h-4" />, onSelect: () => exportOne(e, "print") },
    { kind: "separator" },
    { label: "Delete…", icon: <Trash2 className="w-4 h-4" />, danger: true, onSelect: () => setConfirm({ ids: [e.id], label: `the enquiry from ${e.name}` }) },
  ];

  const viewLabel = () => {
    const parts = [filter === "ALL" ? "All statuses" : `Status: ${statusName(filter)}`];
    if (debouncedQuery) parts.push(`search “${debouncedQuery}”`);
    return parts.join(", ");
  };

  const filterOptions: { key: Filter; label: string }[] = [
    ...ENQUIRY_STATUSES.map((s) => ({ key: s.key as Filter, label: stats ? `${s.label} (${stats.byStatus[s.key]})` : s.label })),
    { key: "ALL", label: stats ? `All (${stats.total})` : "All" },
  ];

  const columns: Column<Enquiry>[] = [
    {
      key: "received",
      header: "Received",
      render: (e) => (
        <span className="flex flex-col text-xs" style={{ color: "var(--dash-text-subtle)" }}>
          <span style={{ color: "var(--dash-text-muted)" }}>{formatDateTime(e.createdAt)}</span>
          {formatRelative(e.createdAt)}
        </span>
      ),
    },
    {
      key: "guest",
      header: "Guest",
      render: (e) => (
        <span className="flex flex-col min-w-0">
          <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
            {e.name}
          </span>
          <span className="dash-code text-xs truncate" style={{ color: "var(--dash-text-subtle)" }}>
            {e.email}
          </span>
        </span>
      ),
    },
    {
      key: "trip",
      header: "Trip",
      render: (e) => (
        <span className="flex flex-col text-xs max-w-[260px]" style={{ color: "var(--dash-text-muted)" }}>
          {e.itinerary && <span className="truncate" style={{ color: "var(--dash-text)" }}>{e.itinerary.title}</span>}
          <span className="truncate">{[e.preferredDates, e.partySize].filter(Boolean).join(" · ") || "—"}</span>
        </span>
      ),
    },
    {
      key: "origin",
      header: "Origin",
      render: (e) => (
        <span className="text-xs" style={{ color: "var(--dash-text-muted)" }} title={e.country ? countryName(e.country) : undefined}>
          {e.country ? `${countryFlag(e.country)} ${e.country}` : "—"}
          {e.referrerHost && <span className="block dash-code" style={{ color: "var(--dash-text-subtle)" }}>{e.referrerHost}</span>}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (e) => <EnquiryStatusBadge status={e.status} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (e) => (
        <span className="inline-flex items-center justify-end">
          <IconButton label={`Open enquiry from ${e.name}`} onClick={() => setOpenId(e.id)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <Menu
            label={`Actions for ${e.name}`}
            items={rowMenu(e)}
            renderTrigger={(t) => (
              <IconButton label={`More actions for ${e.name}`} {...t}>
                <MoreHorizontal className="w-4 h-4" />
              </IconButton>
            )}
          />
        </span>
      ),
    },
  ];

  const allState = selectedRows.length === 0 ? "none" : selectedRows.length === enquiries.length ? "all" : "some";
  const selectedList = selectedRows.map((e) => e.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description={stats ? `${stats.last7d} received in the last 7 days. Guests are promised a reply within 24 hours.` : "Trip enquiries submitted through the public site."}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setExportScope({ status: filter === "ALL" ? undefined : filter, q: debouncedQuery || undefined, label: viewLabel() })}
          >
            Export
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="overflow-x-auto">
          <Segmented label="Filter by status" options={filterOptions} value={filter} onChange={changeFilter} />
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search enquiries</span>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--dash-text-subtle)" }} aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or phone" className={`${inputClass} pl-9`} style={inputStyle} />
        </label>
      </div>

      {error && <InlineMessage tone="error">{error}</InlineMessage>}
      {notice && <InlineMessage tone="success">{notice}</InlineMessage>}

      {selectedRows.length > 0 && (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-lg"
          style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)" }}
        >
          <span className="text-sm font-medium mr-2" style={{ color: "var(--dash-text)" }}>
            {selectedRows.length} selected
          </span>
          <Menu
            label="Set status for selected enquiries"
            align="start"
            items={statusItems(selectedList)}
            renderTrigger={(t) => (
              <Button variant="secondary" size="sm" disabled={busy} icon={<ChevronDown className="w-4 h-4" />} {...t}>
                Set status
              </Button>
            )}
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            icon={<Download className="w-4 h-4" />}
            onClick={() => setExportScope({ ids: selectedList, label: `${plural(selectedList.length)} selected` })}
          >
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            icon={<Trash2 className="w-4 h-4" />}
            style={{ color: "var(--dash-status-danger)" }}
            onClick={() => setConfirm({ ids: selectedList, label: plural(selectedList.length) })}
          >
            Delete
          </Button>
          <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {loading && enquiries.length === 0 ? (
        <SkeletonRows rows={5} label="Loading enquiries" />
      ) : enquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={debouncedQuery ? "No matching enquiries" : filter === "NEW" ? "Inbox zero" : "No enquiries here"}
          description={filter === "NEW" && !debouncedQuery ? "Every enquiry has been picked up. New submissions from the site appear here." : undefined}
        />
      ) : (
        <div className="space-y-4">
          <DataTable
            caption="Enquiries"
            columns={columns}
            rows={enquiries}
            rowKey={(e) => e.id}
            selection={{
              isSelected: (e) => selectedIds.has(e.id),
              onToggle: (e, on) => {
                const next = new Set(selectedIds);
                if (on) next.add(e.id);
                else next.delete(e.id);
                setSelected(next);
              },
              state: allState,
              onToggleAll: (on) => setSelected(on ? new Set(enquiries.map((e) => e.id)) : new Set()),
              rowLabel: (e) => `Select enquiry from ${e.name}`,
            }}
            renderCard={(e) => (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenId(e.id)}
                  className="dash-focusable w-full text-left p-4 pr-14 rounded-lg space-y-2"
                  style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                      {e.name}
                    </span>
                    <EnquiryStatusBadge status={e.status} />
                  </div>
                  <p className="dash-code text-xs truncate" style={{ color: "var(--dash-text-subtle)" }}>
                    {e.email}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatRelative(e.createdAt)}
                    </span>
                    {e.country && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {countryFlag(e.country)} {e.country}
                      </span>
                    )}
                  </div>
                </button>
                <div className="absolute top-2 right-2">
                  <Menu
                    label={`Actions for ${e.name}`}
                    items={rowMenu(e)}
                    renderTrigger={(t) => (
                      <IconButton label={`More actions for ${e.name}`} {...t}>
                        <MoreHorizontal className="w-4 h-4" />
                      </IconButton>
                    )}
                  />
                </div>
              </div>
            )}
          />

          {totalPages > 1 && (
            <nav aria-label="Enquiries pagination" className="flex items-center justify-end gap-3 text-sm" style={{ color: "var(--dash-text-subtle)" }}>
              <IconButton label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </IconButton>
              <span className="dash-code">
                Page {page} of {totalPages}
              </span>
              <IconButton label="Next page" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </IconButton>
            </nav>
          )}
        </div>
      )}

      {openId && <EnquiryDetail key={openId} enquiryId={openId} onClose={() => setOpenId(null)} onChanged={reload} />}

      <Dialog
        open={confirm !== null}
        onClose={() => !busy && setConfirm(null)}
        title="Delete permanently?"
        description={confirm ? `This removes ${confirm.label} and cannot be undone.` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="ghost" disabled={busy} onClick={() => setConfirm(null)}>
              Keep
            </Button>
            <Button variant="danger" loading={busy} onClick={confirmDelete}>
              Delete{confirm && confirm.ids.length > 1 ? ` ${confirm.ids.length}` : ""}
            </Button>
          </>
        }
      />

      {exportScope && <ExportDialog report={enquiryListReport(exportScope, user?.email)} onClose={() => setExportScope(null)} />}
    </div>
  );
}

export default function EnquiriesPage() {
  return (
    <AdminOnly>
      <EnquiriesInbox />
    </AdminOnly>
  );
}
