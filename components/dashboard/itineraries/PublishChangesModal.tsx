"use client";

import React, { useState } from "react";
import { ItineraryDetail } from "@/lib/itineraries/types";
import { buildItineraryDiff } from "@/lib/itineraries/diff";
import { ArrowRight, ShieldAlert } from "lucide-react";
import Dialog from "@/components/dashboard/ui/Dialog";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface PublishChangesModalProps {
  live: ItineraryDetail;
  pending: ItineraryDetail;
  isAdmin: boolean;
  onPublish: () => Promise<void>;
  onClose: () => void;
}

/**
 * Reviews the diff between the live record and the pending, unpublished
 * revision before an admin pushes it live. Non-admins can open this to see
 * exactly the same diff (transparency into what's queued up), but the
 * publish action itself is admin-only — matches PATCH
 * /itineraries/:id/publish-changes's role gate.
 */
export default function PublishChangesModal({ live, pending, isAdmin, onPublish, onClose }: PublishChangesModalProps) {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const diff = buildItineraryDiff(live, pending);

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
      description="Visitors are currently seeing the live version on the left. Publishing applies the changes on the right immediately."
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
      {diff.length === 0 ? (
        <p className="text-sm italic" style={{ color: "var(--dash-text-subtle)" }}>
          No differences detected.
        </p>
      ) : (
        <div className="space-y-3">
          {diff.map((entry) => (
            <div key={entry.label} className="p-3.5 rounded-lg" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
              <div className="dash-label mb-2" style={{ color: "var(--dash-text-subtle)" }}>
                {entry.label}
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-1 line-through" style={{ color: "var(--dash-text-subtle)", textDecorationColor: "var(--dash-status-danger)" }}>
                  {entry.before}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--dash-accent)" }} />
                <span className="flex-1" style={{ color: "var(--dash-text)" }}>
                  {entry.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAdmin && (
        <div className="flex items-center gap-2 p-3 rounded-md mt-4 text-sm" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)", color: "var(--dash-text-muted)" }}>
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Only an admin can publish these changes. Ask an admin to review and push them live.</span>
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
