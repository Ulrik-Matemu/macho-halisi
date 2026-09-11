"use client";

import React, { useState } from "react";
import { ItineraryDetail } from "@/lib/itineraries/types";
import { buildItineraryDiff } from "@/lib/itineraries/diff";
import { Eye, Loader2, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

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
export default function PublishChangesModal({
  live,
  pending,
  isAdmin,
  onPublish,
  onClose,
}: PublishChangesModalProps) {
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111] border border-white/15 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#c68642]" />
            <h2 className="font-serif-luxury text-xl text-white font-light">Review Unpublished Changes</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-white/50">
          Visitors are currently seeing the live version on the left. Publishing applies the changes on
          the right to the public itinerary page immediately.
        </p>

        {diff.length === 0 ? (
          <p className="text-xs text-white/40 italic">No differences detected.</p>
        ) : (
          <div className="space-y-3">
            {diff.map((entry) => (
              <div key={entry.label} className="p-3.5 rounded-lg bg-[#0a0a0a] border border-white/10">
                <div className="text-[10px] font-medium tracking-widest uppercase text-white/50 mb-2">
                  {entry.label}
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <span className="flex-1 text-white/50 line-through decoration-red-500/40">{entry.before}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c68642] shrink-0 mt-0.5" />
                  <span className="flex-1 text-white">{entry.after}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAdmin && (
          <div className="flex items-center gap-2 p-3 rounded bg-white/5 border border-white/10 text-[11px] text-white/60">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Only an admin can publish these changes. Ask an admin to review and push them live.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors cursor-pointer"
          >
            Not now
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || diff.length === 0}
              className="px-5 py-2.5 bg-[#c68642] hover:bg-[#8d5524] disabled:opacity-50 text-[#ffdbac] rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
            >
              {publishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publish Changes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
