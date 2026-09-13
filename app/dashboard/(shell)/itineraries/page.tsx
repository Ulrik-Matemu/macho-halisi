"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Calendar, Clock, CheckCircle2, Archive, Trash2, Compass } from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import { ItinerarySummary, ItineraryStatus } from "@/lib/itineraries/types";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import DataTable, { Column } from "@/components/dashboard/ui/DataTable";
import Dialog from "@/components/dashboard/ui/Dialog";
import { formatShortDate, formatPrice } from "@/lib/dashboard/format";

const FILTERS: { key: string; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "IN_REVIEW", label: "In review" },
  { key: "PUBLISHED", label: "Published" },
  { key: "ARCHIVED", label: "Archived" },
];

type ConfirmType = "publish" | "archive" | "delete";

function ItinerariesListInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "ALL";

  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: ConfirmType; itinerary: ItinerarySummary } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const setStatusFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "ALL") params.delete("status");
    else params.set("status", key);
    router.push(`/dashboard/itineraries${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        statusFilter === "ALL" ? "/api/itineraries?limit=50" : `/api/itineraries?status=${statusFilter}&limit=50`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setItineraries(data.data);
      } else {
        setError(data.message || "Failed to fetch itineraries");
      }
    } catch (err) {
      console.error("Failed to load itineraries:", err);
      setError("Network error while connecting to server");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  const handleExecuteAction = async () => {
    if (!confirmModal) return;
    const { type, itinerary } = confirmModal;
    setActionLoading(itinerary.id);
    setActionError(null);

    try {
      const endpoint =
        type === "publish"
          ? `/api/itineraries/${itinerary.id}/publish`
          : type === "archive"
          ? `/api/itineraries/${itinerary.id}/archive`
          : `/api/itineraries/${itinerary.id}`;
      const method = type === "delete" ? "DELETE" : "PATCH";

      const res = await fetch(endpoint, { method });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setActionError(data.message || `Failed to ${type} itinerary.`);
        return;
      }

      setConfirmModal(null);
      await loadItineraries();
    } catch (err) {
      console.error(`Action error ${type}:`, err);
      setActionError("Network error while performing action.");
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;
  const isAdmin = user.role === "ADMIN";
  const isViewer = user.role === "VIEWER";
  const canCreate = !isViewer;

  const columns: Column<ItinerarySummary>[] = [
    {
      key: "title",
      header: "Title & route",
      render: (i) => (
        <div className="min-w-0 max-w-xs">
          <Link href={`/dashboard/itineraries/${i.id}`} className="dash-focusable block truncate text-sm font-medium" style={{ color: "var(--dash-text)" }}>
            {i.title}
          </Link>
          <span className="dash-code block truncate mt-0.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
            /{i.slug}
          </span>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
    {
      key: "duration",
      header: "Duration",
      render: (i) =>
        i.nights !== null ? (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--dash-text-muted)" }}>
            <Calendar className="w-3.5 h-3.5" style={{ color: "var(--dash-accent)" }} />
            {i.nights} night{i.nights === 1 ? "" : "s"}
          </span>
        ) : (
          <span style={{ color: "var(--dash-text-subtle)" }}>—</span>
        ),
    },
    {
      key: "price",
      header: "Price basis",
      render: (i) =>
        i.priceOnRequest ? (
          <span className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            On request
          </span>
        ) : i.startingPrice !== null ? (
          <span className="dash-code text-sm" style={{ color: "var(--dash-text)" }}>
            {formatPrice(i.startingPrice)}
          </span>
        ) : (
          <span style={{ color: "var(--dash-text-subtle)" }}>—</span>
        ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (i) => (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
          <Clock className="w-3 h-3" />
          {formatShortDate(i.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (i) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/dashboard/itineraries/${i.id}`}>
            <Button variant="secondary" size="sm">
              {isViewer ? "View" : "Edit"}
            </Button>
          </Link>
          {isAdmin && (
            <>
              {(i.status === "DRAFT" || i.status === "IN_REVIEW") && (
                <IconButton label="Publish to live website" tone="success" onClick={() => setConfirmModal({ type: "publish", itinerary: i })}>
                  <CheckCircle2 className="w-4 h-4" />
                </IconButton>
              )}
              {i.status === "PUBLISHED" && (
                <IconButton label="Archive itinerary" tone="warning" onClick={() => setConfirmModal({ type: "archive", itinerary: i })}>
                  <Archive className="w-4 h-4" />
                </IconButton>
              )}
              <IconButton label="Delete itinerary permanently" tone="danger" onClick={() => setConfirmModal({ type: "delete", itinerary: i })}>
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Itineraries"
        description="Manage safari journeys — day-by-day programs, destinations, pricing, and publishing."
        actions={
          canCreate && (
            <Link href="/dashboard/itineraries/new">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                New itinerary
              </Button>
            </Link>
          )
        }
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => {
          const active = statusFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              aria-pressed={active}
              className="dash-focusable px-3.5 py-2 rounded-md text-sm transition-colors shrink-0"
              style={{
                background: active ? "var(--dash-accent-fill)" : "var(--dash-surface-2)",
                color: active ? "var(--dash-accent-on-fill)" : "var(--dash-text-muted)",
                border: active ? "1px solid transparent" : "1px solid var(--dash-border)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {error && <InlineMessage tone="error">{error}</InlineMessage>}

      {loading ? (
        <SkeletonRows rows={6} label="Loading itineraries" />
      ) : itineraries.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No itineraries found"
          description={
            statusFilter === "ALL"
              ? "Get started by authoring your first luxury safari itinerary."
              : `No itineraries found matching status "${statusFilter}".`
          }
          action={
            canCreate && (
              <Link href="/dashboard/itineraries/new">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create new itinerary
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <DataTable
          caption="Itineraries"
          columns={columns}
          rows={itineraries}
          rowKey={(i) => i.id}
          renderCard={(i) => (
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/dashboard/itineraries/${i.id}`} className="dash-focusable block truncate text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                    {i.title}
                  </Link>
                  <span className="dash-code block truncate mt-0.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    /{i.slug}
                  </span>
                </div>
                <StatusBadge status={i.status} />
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                {i.nights !== null && <span>{i.nights} nights</span>}
                <span>{i.priceOnRequest ? "On request" : i.startingPrice !== null ? formatPrice(i.startingPrice) : "—"}</span>
                <span>{formatShortDate(i.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--dash-border)" }}>
                <Link href={`/dashboard/itineraries/${i.id}`}>
                  <Button variant="secondary" size="sm">
                    {isViewer ? "View" : "Edit"}
                  </Button>
                </Link>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    {(i.status === "DRAFT" || i.status === "IN_REVIEW") && (
                      <IconButton label="Publish" tone="success" onClick={() => setConfirmModal({ type: "publish", itinerary: i })}>
                        <CheckCircle2 className="w-4 h-4" />
                      </IconButton>
                    )}
                    {i.status === "PUBLISHED" && (
                      <IconButton label="Archive" tone="warning" onClick={() => setConfirmModal({ type: "archive", itinerary: i })}>
                        <Archive className="w-4 h-4" />
                      </IconButton>
                    )}
                    <IconButton label="Delete" tone="danger" onClick={() => setConfirmModal({ type: "delete", itinerary: i })}>
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      )}

      <Dialog
        open={Boolean(confirmModal)}
        onClose={() => {
          setConfirmModal(null);
          setActionError(null);
        }}
        title={
          confirmModal?.type === "publish"
            ? "Publish itinerary to the public site?"
            : confirmModal?.type === "archive"
            ? "Archive this itinerary?"
            : "Permanently delete itinerary?"
        }
        description={
          confirmModal?.type === "publish"
            ? `This will verify all requirements and make "${confirmModal.itinerary.title}" visible on the live marketing website.`
            : confirmModal?.type === "archive"
            ? `This will unpublish "${confirmModal?.itinerary.title}" and move it to archived status.`
            : `Are you sure you want to permanently delete "${confirmModal?.itinerary.title}"? All associated days and destination links will be erased.`
        }
        footer={
          <>
            <Button variant="ghost" disabled={Boolean(actionLoading)} onClick={() => setConfirmModal(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmModal?.type === "delete" ? "danger" : "primary"}
              loading={Boolean(actionLoading)}
              onClick={handleExecuteAction}
            >
              {confirmModal?.type === "publish" && "Confirm publish"}
              {confirmModal?.type === "archive" && "Confirm archive"}
              {confirmModal?.type === "delete" && "Delete permanently"}
            </Button>
          </>
        }
      >
        {actionError && <InlineMessage tone="error">{actionError}</InlineMessage>}
      </Dialog>
    </div>
  );
}

export default function ItinerariesListPage() {
  return (
    <Suspense fallback={<SkeletonRows rows={6} label="Loading itineraries" />}>
      <ItinerariesListInner />
    </Suspense>
  );
}
