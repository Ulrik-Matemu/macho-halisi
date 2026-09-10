"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Destination } from "@/lib/itineraries/types";
import { MapPin, Plus, Check, Search, Loader2, AlertCircle } from "lucide-react";

interface DestinationsTabProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export default function DestinationsTab({
  selectedIds = [],
  onChange,
  disabled = false,
}: DestinationsTabProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDestinationName, setNewDestinationName] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const loadDestinations = useCallback(async () => {
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setDestinations(data.data);
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

  const toggleDestination = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((dId) => dId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !newDestinationName.trim()) return;

    setAddError(null);
    setAddingLoading(true);

    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDestinationName.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setAddError(data.message || "Failed to create destination");
        return;
      }

      if (data.destination && data.destination.id) {
        const created: Destination = data.destination;
        setDestinations((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        // Auto-select newly created destination
        if (!selectedIds.includes(created.id)) {
          onChange([...selectedIds, created.id]);
        }
        setNewDestinationName("");
        setIsAddingNew(false);
      }
    } catch (err) {
      console.error("Create destination error:", err);
      setAddError("Network error while creating destination");
    } finally {
      setAddingLoading(false);
    }
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c68642]" />
            <span>Associated Tanzanian Destinations</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Select the national parks, conservation areas, and islands covered in this itinerary.
          </p>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(!isAddingNew);
              setAddError(null);
            }}
            className="px-3 py-1.5 bg-[#c68642]/20 border border-[#c68642]/50 hover:bg-[#c68642]/30 text-[#ffdbac] rounded text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? "Cancel" : "Add New Destination"}</span>
          </button>
        )}
      </div>

      {/* Inline Quick-Add Form */}
      {isAddingNew && !disabled && (
        <form
          onSubmit={handleCreateDestination}
          className="p-4 rounded-lg bg-[#141414] border border-[#c68642]/40 space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#ffdbac] tracking-wide uppercase font-serif-luxury">
              Quick-Add Destination
            </span>
            <span className="text-[10px] text-white/40">
              Will immediately be saved to the database and selected
            </span>
          </div>

          {addError && (
            <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              required
              disabled={addingLoading}
              value={newDestinationName}
              onChange={(e) => setNewDestinationName(e.target.value)}
              placeholder="e.g. Lake Natron or Mahale Mountains..."
              className="flex-1 bg-[#0a0a0a] border border-white/20 focus:border-[#c68642] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={addingLoading || !newDestinationName.trim()}
              className="px-4 py-2 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] text-xs font-serif-luxury uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {addingLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              <span>Create</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Selection Controls */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search available destinations..."
            className="w-full bg-[#121212] border border-white/15 focus:border-[#c68642] rounded pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-xs text-white/50 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-[#c68642]" />
            <span>Loading destinations catalog...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 border border-red-900/40 rounded text-xs text-red-300">
            {error}
          </div>
        ) : destinations.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-lg bg-[#0e0e0e]/50 space-y-2">
            <p className="text-xs text-white/50">No destinations in catalog yet.</p>
            <p className="text-[11px] text-white/30">Use the quick-add button above to create the first destination.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((dest) => {
              const isSelected = selectedIds.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  onClick={() => toggleDestination(dest.id)}
                  className={`p-3.5 rounded border transition-all flex items-center justify-between cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#1c160f] border-[#c68642] text-white shadow-[0_0_15px_rgba(198,134,66,0.12)]"
                      : "bg-[#0e0e0e] border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                  } ${disabled ? "pointer-events-none opacity-80" : ""}`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MapPin
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-[#e0ac69]" : "text-white/30"
                      }`}
                    />
                    <span className="text-xs font-medium truncate">{dest.name}</span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      isSelected
                        ? "bg-[#c68642] border-[#c68642] text-black"
                        : "border-white/20"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected count footer */}
        <div className="pt-2 text-xs font-mono text-white/40 flex items-center justify-between">
          <span>{selectedIds.length} destination{selectedIds.length === 1 ? "" : "s"} selected for this safari</span>
          {selectedIds.length > 0 && !disabled && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-[#e0ac69] hover:underline cursor-pointer"
            >
              Clear selections
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
