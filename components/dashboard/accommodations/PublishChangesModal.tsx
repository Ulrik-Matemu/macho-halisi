"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import {
  AccommodationDetail,
  ACCOMMODATION_TYPE_LABELS,
  SERVICE_TIER_LABELS,
  effectiveAltText,
  hasPendingImageChange,
} from "@/lib/accommodations/types";
import Dialog from "@/components/dashboard/ui/Dialog";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface PublishChangesModalProps {
  live: AccommodationDetail;
  pending: AccommodationDetail;
  isAdmin: boolean;
  onPublish: () => Promise<void>;
  onClose: () => void;
}

interface FieldDiff {
  label: string;
  before: string;
  after: string;
}

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

/** The hero image id actually in effect — the explicit choice, or the first gallery image as fallback. */
function resolvedHeroId(acc: AccommodationDetail): string | null {
  return acc.heroImageId ?? acc.images[0]?.id ?? null;
}

function heroImageLabel(acc: AccommodationDetail, id: string | null): string {
  if (!id) return "None";
  const img = acc.images.find((i) => i.id === id) ?? (acc.heroImage?.id === id ? acc.heroImage : null);
  return img ? effectiveAltText(img) || "Untitled image" : "Untitled image";
}

/**
 * Reviews the diff between the live accommodation and the pending,
 * unpublished revision before an admin pushes it live. Non-admins can open
 * this to see what's queued, but publishing is admin-only (matches PATCH
 * /accommodations/:id/publish-changes's role gate).
 */
export default function PublishChangesModal({ live, pending, isAdmin, onPublish, onClose }: PublishChangesModalProps) {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows: [string, unknown, unknown][] = [
    ["Name", live.name, pending.name],
    ["Type", ACCOMMODATION_TYPE_LABELS[live.type], ACCOMMODATION_TYPE_LABELS[pending.type]],
    ["Service tier", SERVICE_TIER_LABELS[live.serviceTier], SERVICE_TIER_LABELS[pending.serviceTier]],
    ["Star rating", live.starRating, pending.starRating],
    ["Location", live.locationText, pending.locationText],
    ["Latitude", live.latitude, pending.latitude],
    ["Longitude", live.longitude, pending.longitude],
    ["Description", live.description, pending.description],
    ["Amenities", live.amenities, pending.amenities],
    ["Price on request", live.priceOnRequest ? "Yes" : "No", pending.priceOnRequest ? "Yes" : "No"],
    ["Price per night", live.pricePerNight, pending.pricePerNight],
    ["Linked destination", live.destination?.name ?? null, pending.destination?.name ?? null],
  ];

  const diff: FieldDiff[] = rows
    .map(([label, before, after]) => ({ label, before: fmt(before), after: fmt(after) }))
    .filter((d) => d.before !== d.after);

  // Hero image and gallery changes are staged per-image (see the
  // /:id/images route handlers), independent of the scalar revision the
  // rows above come from, so they're compared separately here.
  const beforeHeroId = resolvedHeroId(live);
  const afterHeroId = resolvedHeroId(pending);
  if (beforeHeroId !== afterHeroId) {
    diff.push({ label: "Hero image", before: heroImageLabel(live, beforeHeroId), after: heroImageLabel(pending, afterHeroId) });
  }

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
    diff.push({
      label: "Gallery",
      before: `${live.images.length} image${live.images.length === 1 ? "" : "s"} live`,
      after: parts.join(", "),
    });
  }

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      await onPublish();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish changes.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title="Review unpublished changes"
      description="Visitors are currently seeing the live version. Publishing applies the pending changes immediately."
      size="lg"
      scrollable
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          {isAdmin && (
            <Button variant="primary" loading={publishing} disabled={diff.length === 0} onClick={handlePublish}>
              Publish changes
            </Button>
          )}
        </>
      }
    >
      {!isAdmin && (
        <div
          className="mb-4 px-3.5 py-2.5 rounded-md flex items-center gap-1.5 text-sm"
          style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}
        >
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          Only an administrator can publish these changes.
        </div>
      )}

      {diff.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          No field-level differences detected between the live version and the pending draft.
        </p>
      ) : (
        <div className="space-y-2.5">
          {diff.map((d) => (
            <div
              key={d.label}
              className="p-3 rounded-lg"
              style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}
            >
              <div className="text-xs font-medium mb-1.5" style={{ color: "var(--dash-text)" }}>
                {d.label}
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span style={{ color: "var(--dash-text-subtle)", textDecoration: "line-through" }}>{d.before}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--dash-accent)" }} />
                <span style={{ color: "var(--dash-text)" }}>{d.after}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4">
          <InlineMessage tone="error">{error}</InlineMessage>
        </div>
      )}
    </Dialog>
  );
}
