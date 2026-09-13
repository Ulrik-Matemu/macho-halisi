"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  FileEdit,
  Eye,
  CheckCircle2,
  Archive,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import { ItinerarySummary } from "@/lib/itineraries/types";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import { formatShortDate } from "@/lib/dashboard/format";

const METRICS: { key: "ALL" | ItinerarySummary["status"]; label: string; icon: typeof Compass }[] = [
  { key: "ALL", label: "Total itineraries", icon: Compass },
  { key: "DRAFT", label: "Draft", icon: FileEdit },
  { key: "IN_REVIEW", label: "In review", icon: Eye },
  { key: "PUBLISHED", label: "Published", icon: CheckCircle2 },
  { key: "ARCHIVED", label: "Archived", icon: Archive },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<ItinerarySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/itineraries?limit=50");
        const data = await res.json();
        if (!isMounted) return;
        if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
          setItineraries(data.data);
        } else {
          setError(data.message || "Failed to load itineraries.");
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
        if (isMounted) setError("Network error while connecting to server.");
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!user) return null;
  const isViewer = user.role === "VIEWER";

  const counts = {
    ALL: itineraries?.length ?? 0,
    DRAFT: itineraries?.filter((i) => i.status === "DRAFT").length ?? 0,
    IN_REVIEW: itineraries?.filter((i) => i.status === "IN_REVIEW").length ?? 0,
    PUBLISHED: itineraries?.filter((i) => i.status === "PUBLISHED").length ?? 0,
    ARCHIVED: itineraries?.filter((i) => i.status === "ARCHIVED").length ?? 0,
  };

  // Note: ItinerarySummary has no `hasPendingChanges` field from the list
  // endpoint (only the detail/revision endpoints expose it) — this uses an
  // updatedAt > publishedAt heuristic as a stand-in until the backend adds
  // the flag to the list payload.
  const needsAttention = (itineraries ?? []).filter(
    (i) =>
      i.status === "IN_REVIEW" ||
      (i.status === "PUBLISHED" && i.publishedAt && new Date(i.updatedAt) > new Date(i.publishedAt))
  );

  const recentlyEdited = [...(itineraries ?? [])]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back${user.email ? `, ${user.email.split("@")[0]}` : ""}`}
        description="An overview of the safari itineraries catalog and what needs your attention."
        actions={
          !isViewer && (
            <Link href="/dashboard/itineraries/new">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                New itinerary
              </Button>
            </Link>
          )
        }
      />

      {error && (
        <div role="alert" className="p-4 rounded-lg text-sm" style={{ background: "color-mix(in srgb, var(--dash-status-danger) 12%, transparent)", color: "var(--dash-status-danger)" }}>
          {error}
        </div>
      )}

      {/* Metric tiles — each links to the filtered itineraries list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {METRICS.map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            href={key === "ALL" ? "/dashboard/itineraries" : `/dashboard/itineraries?status=${key}`}
            className="dash-focusable p-4 rounded-xl transition-colors"
            style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--dash-border-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--dash-border)")}
          >
            <Icon className="w-4 h-4 mb-3" style={{ color: "var(--dash-accent)" }} />
            {itineraries === null ? (
              <Skeleton className="h-7 w-10 mb-1" />
            ) : (
              <div className="dash-title" style={{ color: "var(--dash-text)" }}>
                {counts[key]}
              </div>
            )}
            <div className="text-xs mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs attention */}
        <section
          className="rounded-xl p-5 space-y-4"
          style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
        >
          <h2 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--dash-status-draft)" }} />
            Needs attention
          </h2>
          {itineraries === null ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : needsAttention.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
              Nothing pending review or unpublished right now.
            </p>
          ) : (
            <ul className="space-y-1">
              {needsAttention.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/dashboard/itineraries/${i.id}`}
                    className="dash-focusable flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-md text-sm transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dash-surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span className="truncate" style={{ color: "var(--dash-text)" }}>
                      {i.title}
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={i.status} />
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--dash-text-subtle)" }} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recently edited */}
        <section
          className="rounded-xl p-5 space-y-4"
          style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
        >
          <h2 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <Map className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Recently edited
          </h2>
          {itineraries === null ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentlyEdited.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No itineraries yet"
              description="Create your first safari itinerary to get started."
              action={
                !isViewer && (
                  <Link href="/dashboard/itineraries/new">
                    <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                      New itinerary
                    </Button>
                  </Link>
                )
              }
            />
          ) : (
            <ul className="space-y-1">
              {recentlyEdited.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/dashboard/itineraries/${i.id}`}
                    className="dash-focusable flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-md text-sm transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dash-surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span className="truncate" style={{ color: "var(--dash-text)" }}>
                      {i.title}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: "var(--dash-text-subtle)" }}>
                      {formatShortDate(i.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
