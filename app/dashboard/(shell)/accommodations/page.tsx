"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MapPin, Star, Clock, CheckCircle2, Archive, Trash2, Hotel } from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import {
  AccommodationSummary,
  ACCOMMODATION_TYPE_LABELS,
  SERVICE_TIER_LABELS,
} from "@/lib/accommodations/types";
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

function priceLabel(a: AccommodationSummary): string {
  if (a.priceOnRequest) return "On request";
  if (a.pricePerNight !== null) return `${formatPrice(a.pricePerNight)}/night`;
  return "—";
}

function AccommodationsListInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "ALL";

  const [accommodations, setAccommodations] = useState<AccommodationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: ConfirmType; item: AccommodationSummary } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const setStatusFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "ALL") params.delete("status");
    else params.set("status", key);
    router.push(`/dashboard/accommodations${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const loadAccommodations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        statusFilter === "ALL"
          ? "/api/accommodations?limit=50"
          : `/api/accommodations?status=${statusFilter}&limit=50`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setAccommodations(data.data);
      } else {
        setError(data.message || "Failed to fetch accommodations");
      }
    } catch (err) {
      console.error("Failed to load accommodations:", err);
      setError("Network error while connecting to server");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadAccommodations();
  }, [loadAccommodations]);

  const handleExecuteAction = async () => {
    if (!confirmModal) return;
    const { type, item } = confirmModal;
    setActionLoading(item.id);
    setActionError(null);

    try {
      const endpoint =
        type === "publish"
          ? `/api/accommodations/${item.id}/publish`
          : type === "archive"
          ? `/api/accommodations/${item.id}/archive`
          : `/api/accommodations/${item.id}`;
      const method = type === "delete" ? "DELETE" : "PATCH";

      const res = await fetch(endpoint, { method });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setActionError(data.message || `Failed to ${type} accommodation.`);
        return;
      }

      setConfirmModal(null);
      await loadAccommodations();
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

  const columns: Column<AccommodationSummary>[] = [
    {
      key: "name",
      header: "Name & location",
      render: (a) => (
        <div className="min-w-0 max-w-xs">
          <Link href={`/dashboard/accommodations/${a.id}`} className="dash-focusable block truncate text-sm font-medium" style={{ color: "var(--dash-text)" }}>
            {a.name}
          </Link>
          <span className="block truncate mt-0.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
            {a.locationText}
          </span>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "type",
      header: "Type & tier",
      render: (a) => (
        <div className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
          <span className="block">{ACCOMMODATION_TYPE_LABELS[a.type]}</span>
          <span className="block text-xs" style={{ color: "var(--dash-text-subtle)" }}>
            {SERVICE_TIER_LABELS[a.serviceTier]}
          </span>
        </div>
      ),
    },
    {
      key: "stars",
      header: "Rating",
      render: (a) =>
        a.starRating !== null ? (
          <span className="flex items-center gap-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>
            <Star className="w-3.5 h-3.5 fill-current" style={{ color: "var(--dash-accent)" }} />
            {a.starRating}
          </span>
        ) : (
          <span style={{ color: "var(--dash-text-subtle)" }}>—</span>
        ),
    },
    {
      key: "price",
      header: "Price",
      render: (a) => (
        <span className="text-sm" style={{ color: "var(--dash-text)" }}>
          {priceLabel(a)}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (a) => (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
          <Clock className="w-3 h-3" />
          {formatShortDate(a.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/dashboard/accommodations/${a.id}`}>
            <Button variant="secondary" size="sm">
              {isViewer ? "View" : "Edit"}
            </Button>
          </Link>
          {isAdmin && (
            <>
              {(a.status === "DRAFT" || a.status === "IN_REVIEW") && (
                <IconButton label="Publish to live website" tone="success" onClick={() => setConfirmModal({ type: "publish", item: a })}>
                  <CheckCircle2 className="w-4 h-4" />
                </IconButton>
              )}
              {a.status === "PUBLISHED" && (
                <IconButton label="Archive accommodation" tone="warning" onClick={() => setConfirmModal({ type: "archive", item: a })}>
                  <Archive className="w-4 h-4" />
                </IconButton>
              )}
              <IconButton label="Delete accommodation permanently" tone="danger" onClick={() => setConfirmModal({ type: "delete", item: a })}>
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
        title="Accommodations"
        description="Manage hotels, camps, lodges, hostels and more — location, imagery, categorization, and publishing."
        actions={
          canCreate && (
            <Link href="/dashboard/accommodations/new">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                New accommodation
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
        <SkeletonRows rows={6} label="Loading accommodations" />
      ) : accommodations.length === 0 ? (
        <EmptyState
          icon={Hotel}
          title="No accommodations found"
          description={
            statusFilter === "ALL"
              ? "Get started by adding your first hotel, camp or lodge."
              : `No accommodations found matching status "${statusFilter}".`
          }
          action={
            canCreate && (
              <Link href="/dashboard/accommodations/new">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create new accommodation
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <DataTable
          caption="Accommodations"
          columns={columns}
          rows={accommodations}
          rowKey={(a) => a.id}
          renderCard={(a) => (
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/dashboard/accommodations/${a.id}`} className="dash-focusable block truncate text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                    {a.name}
                  </Link>
                  <span className="flex items-center gap-1 truncate mt-0.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    {a.locationText}
                  </span>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                <span>{ACCOMMODATION_TYPE_LABELS[a.type]}</span>
                <span>{SERVICE_TIER_LABELS[a.serviceTier]}</span>
                {a.starRating !== null && <span>{a.starRating}★</span>}
                <span>{priceLabel(a)}</span>
              </div>
              <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--dash-border)" }}>
                <Link href={`/dashboard/accommodations/${a.id}`}>
                  <Button variant="secondary" size="sm">
                    {isViewer ? "View" : "Edit"}
                  </Button>
                </Link>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    {(a.status === "DRAFT" || a.status === "IN_REVIEW") && (
                      <IconButton label="Publish" tone="success" onClick={() => setConfirmModal({ type: "publish", item: a })}>
                        <CheckCircle2 className="w-4 h-4" />
                      </IconButton>
                    )}
                    {a.status === "PUBLISHED" && (
                      <IconButton label="Archive" tone="warning" onClick={() => setConfirmModal({ type: "archive", item: a })}>
                        <Archive className="w-4 h-4" />
                      </IconButton>
                    )}
                    <IconButton label="Delete" tone="danger" onClick={() => setConfirmModal({ type: "delete", item: a })}>
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
            ? "Publish accommodation to the public site?"
            : confirmModal?.type === "archive"
            ? "Archive this accommodation?"
            : "Permanently delete accommodation?"
        }
        description={
          confirmModal?.type === "publish"
            ? `This will verify all requirements and make "${confirmModal.item.name}" visible on the live marketing website.`
            : confirmModal?.type === "archive"
            ? `This will unpublish "${confirmModal?.item.name}" and move it to archived status.`
            : `Are you sure you want to permanently delete "${confirmModal?.item.name}"? All associated images will be erased.`
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

export default function AccommodationsListPage() {
  return (
    <Suspense fallback={<SkeletonRows rows={6} label="Loading accommodations" />}>
      <AccommodationsListInner />
    </Suspense>
  );
}
