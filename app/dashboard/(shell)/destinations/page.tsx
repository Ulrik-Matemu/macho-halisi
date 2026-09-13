"use client";

import React, { useState, useEffect, useCallback } from "react";
import LocationPickerModal from "@/components/dashboard/LocationPickerModal";
import { Destination } from "@/lib/itineraries/types";
import { useAuth } from "@/lib/dashboard/auth-context";
import { MapPin, Search, Save, Crosshair, Check } from "lucide-react";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import EmptyState from "@/components/dashboard/ui/EmptyState";

type SaveState = "idle" | "saving" | "saved" | "error";

interface DraftFields {
  latitude: string;
  longitude: string;
  blurb: string;
}

/**
 * Destinations are a shared catalog referenced by many itineraries, so
 * their coordinates/blurb are edited here rather than from within any one
 * itinerary's editor (see DestinationsTab.tsx, which only lets an editor
 * pick which destinations an itinerary covers).
 */
export default function DestinationsCatalogPage() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [drafts, setDrafts] = useState<Record<string, DraftFields>>({});
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [saveError, setSaveError] = useState<Record<string, string>>({});
  const [pickerForId, setPickerForId] = useState<string | null>(null);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setDestinations(data.data);
        const nextDrafts: Record<string, DraftFields> = {};
        for (const dest of data.data as Destination[]) {
          nextDrafts[dest.id] = {
            latitude: dest.latitude != null ? String(dest.latitude) : "",
            longitude: dest.longitude != null ? String(dest.longitude) : "",
            blurb: dest.blurb ?? "",
          };
        }
        setDrafts(nextDrafts);
      } else {
        setError(data.message || "Failed to load destinations");
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
      setError("Unable to reach destinations service");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const updateDraft = (id: string, patch: Partial<DraftFields>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id]!, ...patch } }));
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;

    const lat = draft.latitude.trim() === "" ? null : Number(draft.latitude);
    const lng = draft.longitude.trim() === "" ? null : Number(draft.longitude);

    if ((lat !== null && Number.isNaN(lat)) || (lng !== null && Number.isNaN(lng))) {
      setSaveState((prev) => ({ ...prev, [id]: "error" }));
      setSaveError((prev) => ({ ...prev, [id]: "Latitude/longitude must be numbers" }));
      return;
    }

    setSaveState((prev) => ({ ...prev, [id]: "saving" }));
    setSaveError((prev) => ({ ...prev, [id]: "" }));

    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng, blurb: draft.blurb.trim() === "" ? null : draft.blurb.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") throw new Error(data.message || "Failed to save destination");
      setDestinations((prev) => prev.map((d) => (d.id === id ? data.destination : d)));
      setSaveState((prev) => ({ ...prev, [id]: "saved" }));
      setTimeout(() => {
        setSaveState((prev) => (prev[id] === "saved" ? { ...prev, [id]: "idle" } : prev));
      }, 2000);
    } catch (err) {
      setSaveState((prev) => ({ ...prev, [id]: "error" }));
      setSaveError((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : "Save failed" }));
    }
  };

  const filtered = destinations.filter((d) => d.name.toLowerCase().includes(search.toLowerCase().trim()));
  const isViewer = user?.role === "VIEWER";

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Destinations catalog"
        description="Set the map pin and story blurb for each destination. These coordinates power the interactive journey map on published itineraries — any day without its own pin falls back to its destination's coordinates here."
      />

      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations..."
          aria-label="Search destinations"
          className={`${inputClass} pl-9`}
          style={inputStyle}
        />
      </div>

      {loading ? (
        <SkeletonRows rows={4} label="Loading destinations" />
      ) : error ? (
        <InlineMessage tone="error">{error}</InlineMessage>
      ) : filtered.length === 0 ? (
        <EmptyState icon={MapPin} title="No destinations found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((dest) => {
            const draft = drafts[dest.id];
            const state = saveState[dest.id] ?? "idle";
            if (!draft) return null;
            return (
              <div key={dest.id} className="p-4 sm:p-5 rounded-lg space-y-3.5" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
                    {dest.name}
                  </span>
                  {!isViewer && (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={state === "saving"}
                      icon={state === "saved" ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      onClick={() => handleSave(dest.id)}
                    >
                      {state === "saved" ? "Saved" : "Save"}
                    </Button>
                  )}
                </div>

                {!isViewer && process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setPickerForId(dest.id)}
                      className="dash-focusable text-xs hover:underline rounded flex items-center gap-1"
                      style={{ color: "var(--dash-accent)" }}
                    >
                      <Crosshair className="w-3 h-3" />
                      Pick on map
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Latitude">
                    {({ id }) => (
                      <input
                        id={id}
                        type="text"
                        inputMode="decimal"
                        disabled={isViewer}
                        value={draft.latitude}
                        onChange={(e) => updateDraft(dest.id, { latitude: e.target.value })}
                        placeholder="e.g. -2.3333"
                        className={inputClass}
                        style={inputStyle}
                      />
                    )}
                  </Field>
                  <Field label="Longitude">
                    {({ id }) => (
                      <input
                        id={id}
                        type="text"
                        inputMode="decimal"
                        disabled={isViewer}
                        value={draft.longitude}
                        onChange={(e) => updateDraft(dest.id, { longitude: e.target.value })}
                        placeholder="e.g. 34.8333"
                        className={inputClass}
                        style={inputStyle}
                      />
                    )}
                  </Field>
                </div>

                <Field label="Map popup blurb">
                  {({ id }) => (
                    <input
                      id={id}
                      type="text"
                      disabled={isViewer}
                      value={draft.blurb}
                      onChange={(e) => updateDraft(dest.id, { blurb: e.target.value })}
                      maxLength={280}
                      placeholder="e.g. Home to the Great Migration"
                      className={inputClass}
                      style={inputStyle}
                    />
                  )}
                </Field>

                {state === "error" && saveError[dest.id] && <InlineMessage tone="error">{saveError[dest.id]}</InlineMessage>}
              </div>
            );
          })}
        </div>
      )}

      {pickerForId && drafts[pickerForId] && (
        <LocationPickerModal
          title={`Set location for ${destinations.find((d) => d.id === pickerForId)?.name ?? "destination"}`}
          initialLat={drafts[pickerForId]!.latitude ? Number(drafts[pickerForId]!.latitude) : null}
          initialLng={drafts[pickerForId]!.longitude ? Number(drafts[pickerForId]!.longitude) : null}
          onConfirm={(lat, lng) => {
            updateDraft(pickerForId, { latitude: String(lat), longitude: String(lng) });
            setPickerForId(null);
          }}
          onClose={() => setPickerForId(null)}
        />
      )}
    </div>
  );
}
