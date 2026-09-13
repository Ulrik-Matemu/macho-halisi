"use client";

import React, { useState } from "react";
import { AvailabilityPeriod, AvailabilityStatus } from "@/lib/itineraries/types";
import { CalendarRange, Plus, Trash2, Loader2 } from "lucide-react";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface AvailabilityTabProps {
  itineraryId: string;
  periods: AvailabilityPeriod[];
  onPeriodsChange: (periods: AvailabilityPeriod[]) => void;
  isPublished?: boolean;
  disabled?: boolean;
}

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Available" },
  { value: "LIMITED", label: "Limited" },
  { value: "FULLY_BOOKED", label: "Fully booked" },
];

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Sixth itinerary editor tab: dated availability periods, supplementary to
 * (and independent of) the Booking Availability badge in OverviewTab.
 *
 * Unlike Days/Destinations/Inclusions, this tab does NOT feed the parent's
 * debounced autosave — every add/edit/delete calls its own dedicated
 * endpoint directly, the same network-backed pattern GalleryTab uses.
 */
export default function AvailabilityTab({ itineraryId, periods = [], onPeriodsChange, isPublished = false, disabled = false }: AvailabilityTabProps) {
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
        body: JSON.stringify({ startDate: draftStart, endDate: draftEnd, status: draftStatus, note: draftNote.trim() || null }),
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
        body: JSON.stringify({ startDate: next.startDate, endDate: next.endDate, status: next.status, note: next.note || null }),
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
      const res = await fetch(`/api/itineraries/${itineraryId}/availability-periods/${periodId}`, { method: "DELETE" });
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

  const cardStyle: React.CSSProperties = { background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <CalendarRange className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Seasonal & date-based availability
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
          Optional supplementary detail shown on the public itinerary page — e.g. &ldquo;Jun 1 – Oct 31: Available
          (peak migration season).&rdquo; Does not affect the Booking Availability badge set in Overview.
        </p>
      </div>

      {isPublished && (
        <p className="text-sm" style={{ color: "var(--dash-accent)" }}>
          Unlike the other tabs, availability changes save immediately and are visible to visitors right away — they
          aren&apos;t held for review.
        </p>
      )}

      {error && <InlineMessage tone="error">{error}</InlineMessage>}

      {sorted.length === 0 ? (
        <div className="p-8 text-center rounded-lg text-sm" style={{ border: "1px dashed var(--dash-border-strong)", color: "var(--dash-text-subtle)" }}>
          No availability periods defined yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((period) => (
            <div key={period.id} className="p-4 sm:p-5 rounded-lg space-y-3" style={cardStyle}>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
                <Field label="Start date">
                  {({ id }) => (
                    <input
                      id={id}
                      type="date"
                      disabled={disabled || busyId === period.id}
                      defaultValue={toDateInputValue(period.startDate)}
                      onBlur={(e) => {
                        if (e.target.value && e.target.value !== toDateInputValue(period.startDate)) handleUpdate(period, { startDate: e.target.value });
                      }}
                      className={inputClass}
                      style={inputStyle}
                    />
                  )}
                </Field>
                <Field label="End date">
                  {({ id }) => (
                    <input
                      id={id}
                      type="date"
                      disabled={disabled || busyId === period.id}
                      defaultValue={toDateInputValue(period.endDate)}
                      onBlur={(e) => {
                        if (e.target.value && e.target.value !== toDateInputValue(period.endDate)) handleUpdate(period, { endDate: e.target.value });
                      }}
                      className={inputClass}
                      style={inputStyle}
                    />
                  )}
                </Field>
                <Field label="Status">
                  {({ id }) => (
                    <select
                      id={id}
                      disabled={disabled || busyId === period.id}
                      value={period.status}
                      onChange={(e) => handleUpdate(period, { status: e.target.value as AvailabilityStatus })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                {!disabled && (
                  <IconButton label="Delete this period" tone="danger" disabled={busyId === period.id} onClick={() => handleDelete(period.id)}>
                    {busyId === period.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </IconButton>
                )}
              </div>
              <Field label="Note (optional)">
                {({ id }) => (
                  <input
                    id={id}
                    type="text"
                    disabled={disabled || busyId === period.id}
                    defaultValue={period.note || ""}
                    onBlur={(e) => {
                      if (e.target.value !== (period.note || "")) handleUpdate(period, { note: e.target.value.trim() || null });
                    }}
                    placeholder="e.g. Peak migration season"
                    maxLength={280}
                    className={inputClass}
                    style={inputStyle}
                  />
                )}
              </Field>
            </div>
          ))}
        </div>
      )}

      {!disabled && (
        <div className="p-4 sm:p-5 rounded-lg space-y-3" style={{ border: "1px dashed var(--dash-accent-soft-border)", background: "var(--dash-accent-soft)" }}>
          <span className="text-sm font-medium" style={{ color: "var(--dash-accent)" }}>
            Add period
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <Field label="Start date">
              {({ id }) => (
                <input id={id} type="date" disabled={adding} value={draftStart} onChange={(e) => setDraftStart(e.target.value)} className={inputClass} style={inputStyle} />
              )}
            </Field>
            <Field label="End date">
              {({ id }) => (
                <input id={id} type="date" disabled={adding} value={draftEnd} onChange={(e) => setDraftEnd(e.target.value)} className={inputClass} style={inputStyle} />
              )}
            </Field>
            <Field label="Status">
              {({ id }) => (
                <select id={id} disabled={adding} value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as AvailabilityStatus)} className={inputClass} style={inputStyle}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <Field label="Note (optional)">
            {({ id }) => (
              <input
                id={id}
                type="text"
                disabled={adding}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="e.g. Peak migration season"
                maxLength={280}
                className={inputClass}
                style={inputStyle}
              />
            )}
          </Field>
          <Button variant="primary" size="sm" loading={adding} disabled={!draftStart || !draftEnd} icon={<Plus className="w-3.5 h-3.5" />} onClick={handleAdd}>
            Add period
          </Button>
        </div>
      )}
    </div>
  );
}
