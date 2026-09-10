"use client";

import React, { useState } from "react";
import { AvailabilityPeriod, AvailabilityStatus } from "@/lib/itineraries/types";
import { CalendarRange, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

interface AvailabilityTabProps {
  itineraryId: string;
  periods: AvailabilityPeriod[];
  onPeriodsChange: (periods: AvailabilityPeriod[]) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: "AVAILABLE", label: "AVAILABLE" },
  { value: "LIMITED", label: "LIMITED" },
  { value: "FULLY_BOOKED", label: "FULLY BOOKED" },
];

// startDate/endDate arrive as full ISO datetime strings (the @db.Date
// column serializes at UTC midnight) — trim to YYYY-MM-DD for
// <input type="date">, which is also exactly the format it emits back.
function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Sixth itinerary editor tab: dated availability periods, supplementary to
 * (and independent of) the Booking Availability badge in OverviewTab.
 *
 * Unlike Days/Destinations/Inclusions, this tab does NOT feed the parent's
 * debounced autosave — every add/edit/delete calls its own dedicated
 * endpoint directly (POST/PATCH/DELETE .../availability-periods[...]) and
 * only then reports the result up via onPeriodsChange, the same
 * network-backed pattern GalleryTab uses for adding/removing images.
 */
export default function AvailabilityTab({
  itineraryId,
  periods = [],
  onPeriodsChange,
  disabled = false,
}: AvailabilityTabProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");
  const [draftStatus, setDraftStatus] = useState<AvailabilityStatus>("AVAILABLE");
  const [draftNote, setDraftNote] = useState("");
  const [adding, setAdding] = useState(false);

  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));

  const handleAdd = async () => {
    if (disabled || !draftStart || !draftEnd) return;
    setError(null);
    setAdding(true);
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/availability-periods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: draftStart,
          endDate: draftEnd,
          status: draftStatus,
          note: draftNote.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setError(data.message || "Failed to add availability period");
        return;
      }
      onPeriodsChange([...periods, data.period]);
      setDraftStart("");
      setDraftEnd("");
      setDraftStatus("AVAILABLE");
      setDraftNote("");
    } catch (err) {
      console.error("Failed to add availability period:", err);
      setError("Network error while adding availability period");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (period: AvailabilityPeriod, patch: Partial<AvailabilityPeriod>) => {
    if (disabled) return;
    setError(null);
    setBusyId(period.id);
    const next = { ...period, ...patch };
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/availability-periods/${period.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: next.startDate,
          endDate: next.endDate,
          status: next.status,
          note: next.note || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setError(data.message || "Failed to update availability period");
        return;
      }
      onPeriodsChange(periods.map((p) => (p.id === period.id ? data.period : p)));
    } catch (err) {
      console.error("Failed to update availability period:", err);
      setError("Network error while updating availability period");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (periodId: string) => {
    if (disabled || busyId) return;
    setError(null);
    setBusyId(periodId);
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/availability-periods/${periodId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setError(data.message || "Failed to delete availability period");
        return;
      }
      onPeriodsChange(periods.filter((p) => p.id !== periodId));
    } catch (err) {
      console.error("Failed to delete availability period:", err);
      setError("Network error while deleting availability period");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-white/10">
        <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-[#c68642]" />
          <span>Seasonal & Date-Based Availability</span>
        </h3>
        <p className="text-xs text-white/50 mt-0.5">
          Optional supplementary detail shown on the public itinerary page — e.g. &ldquo;Jun 1 – Oct
          31: Available (peak migration season).&rdquo; Does not affect the Booking Availability badge
          set in Overview.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-xs text-white/40">
          No availability periods defined yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((period) => (
            <div
              key={period.id}
              className="p-4 sm:p-5 rounded-lg bg-[#0e0e0e] border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    disabled={disabled || busyId === period.id}
                    defaultValue={toDateInputValue(period.startDate)}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value !== toDateInputValue(period.startDate)) {
                        handleUpdate(period, { startDate: e.target.value });
                      }
                    }}
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={disabled || busyId === period.id}
                    defaultValue={toDateInputValue(period.endDate)}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value !== toDateInputValue(period.endDate)) {
                        handleUpdate(period, { endDate: e.target.value });
                      }
                    }}
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                    Status
                  </label>
                  <select
                    disabled={disabled || busyId === period.id}
                    value={period.status}
                    onChange={(e) => handleUpdate(period, { status: e.target.value as AvailabilityStatus })}
                    className="bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    disabled={busyId === period.id}
                    onClick={() => handleDelete(period.id)}
                    title="Delete this period"
                    className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {busyId === period.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                  Note (optional)
                </label>
                <input
                  type="text"
                  disabled={disabled || busyId === period.id}
                  defaultValue={period.note || ""}
                  onBlur={(e) => {
                    if (e.target.value !== (period.note || "")) {
                      handleUpdate(period, { note: e.target.value.trim() || null });
                    }
                  }}
                  placeholder="e.g. Peak migration season"
                  maxLength={280}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!disabled && (
        <div className="p-4 sm:p-5 rounded-lg border border-dashed border-[#c68642]/40 bg-[#c68642]/5 space-y-3">
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#ffdbac]">
            Add Period
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                disabled={adding}
                value={draftStart}
                onChange={(e) => setDraftStart(e.target.value)}
                className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                disabled={adding}
                value={draftEnd}
                onChange={(e) => setDraftEnd(e.target.value)}
                className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                Status
              </label>
              <select
                disabled={adding}
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value as AvailabilityStatus)}
                className="bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
              Note (optional)
            </label>
            <input
              type="text"
              disabled={adding}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="e.g. Peak migration season"
              maxLength={280}
              className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            disabled={adding || !draftStart || !draftEnd}
            onClick={handleAdd}
            className="px-4 py-2.5 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-wider uppercase rounded transition-colors flex items-center gap-1.5 shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Add Period</span>
          </button>
        </div>
      )}
    </div>
  );
}
