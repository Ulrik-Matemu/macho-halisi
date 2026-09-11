"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LocationPickerModal from "@/components/dashboard/LocationPickerModal";
import { Destination } from "@/lib/itineraries/types";
import { AuthUser } from "@/lib/auth/types";
import { MapPin, Loader2, AlertCircle, Check, Search, Save, Crosshair } from "lucide-react";

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
 * pick which destinations an itinerary covers). These coordinates are what
 * the public itinerary page's journey map falls back to for any day that
 * doesn't have its own pin (see getItineraryMapPins in lib/public/api.ts).
 */
export default function DestinationsCatalogPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [drafts, setDrafts] = useState<Record<string, DraftFields>>({});
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [saveError, setSaveError] = useState<Record<string, string>>({});
  const [pickerForId, setPickerForId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.status === "ok" && data.user) {
          setUser(data.user);
        } else {
          router.push("/dashboard/login?from=/dashboard/destinations");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    fetchUser();
  }, [router]);

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
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          blurb: draft.blurb.trim() === "" ? null : draft.blurb.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to save destination");
      }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div>
          <h1 className="font-serif-luxury text-2xl text-white font-light flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#c68642]" />
            <span>Destinations Catalog</span>
          </h1>
          <p className="text-xs text-white/50 mt-1.5 max-w-2xl">
            Set the map pin and story blurb for each destination. These coordinates power the
            interactive journey map on published itineraries — any day without its own pin falls
            back to its destination&apos;s coordinates here.
          </p>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full bg-[#121212] border border-white/15 focus:border-[#c68642] rounded pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-xs text-white/50 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-[#c68642]" />
            <span>Loading destinations catalog...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 border border-red-900/40 rounded text-xs text-red-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-lg bg-[#0e0e0e]/50">
            <p className="text-xs text-white/50">No destinations found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((dest) => {
              const draft = drafts[dest.id];
              const state = saveState[dest.id] ?? "idle";
              if (!draft) return null;
              return (
                <div
                  key={dest.id}
                  className="p-4 sm:p-5 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-serif-luxury text-base text-white tracking-wide">{dest.name}</span>
                    {!isViewer && (
                      <button
                        type="button"
                        onClick={() => handleSave(dest.id)}
                        disabled={state === "saving"}
                        className="px-3 py-1.5 bg-[#c68642] hover:bg-[#8d5524] disabled:opacity-50 text-[#ffdbac] text-[10px] font-mono tracking-wider uppercase rounded transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {state === "saving" ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : state === "saved" ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        <span>{state === "saved" ? "Saved" : "Save"}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60">
                          Latitude
                        </label>
                        {!isViewer && process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
                          <button
                            type="button"
                            onClick={() => setPickerForId(dest.id)}
                            className="text-[10px] text-[#e0ac69] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Crosshair className="w-3 h-3" />
                            Pick on Map
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewer}
                        value={draft.latitude}
                        onChange={(e) => updateDraft(dest.id, { latitude: e.target.value })}
                        placeholder="e.g. -2.3333"
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                        Longitude
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isViewer}
                        value={draft.longitude}
                        onChange={(e) => updateDraft(dest.id, { longitude: e.target.value })}
                        placeholder="e.g. 34.8333"
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                      Map popup blurb
                    </label>
                    <input
                      type="text"
                      disabled={isViewer}
                      value={draft.blurb}
                      onChange={(e) => updateDraft(dest.id, { blurb: e.target.value })}
                      maxLength={280}
                      placeholder="e.g. Home to the Great Migration"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  {state === "error" && saveError[dest.id] && (
                    <div className="flex items-center gap-2 text-[11px] text-red-300">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{saveError[dest.id]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

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
