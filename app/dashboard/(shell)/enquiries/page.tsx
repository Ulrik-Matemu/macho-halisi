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
import { Segmented } from "@/components/dashboard/charts/primitives";
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

type Filter = "ALL" | EnquiryStatus;

function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
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

function EnquiriesInbox() {
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
  const [openId, setOpenId] = useState<string | null>(null);

  // Loading is derived: the current request differs from the last one answered.
  const requestKey = `${page}|${filter}|${debouncedQuery}|${nonce}`;
  const loading = loadedKey !== requestKey;
  const reload = useCallback(() => setNonce((n) => n + 1), []);

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
        <IconButton label={`Open enquiry from ${e.name}`} onClick={() => setOpenId(e.id)}>
          <Eye className="w-4 h-4" />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description={stats ? `${stats.last7d} received in the last 7 days. Guests are promised a reply within 24 hours.` : "Trip enquiries submitted through the public site."}
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
            renderCard={(e) => (
              <button
                type="button"
                onClick={() => setOpenId(e.id)}
                className="dash-focusable w-full text-left p-4 rounded-lg space-y-2"
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
