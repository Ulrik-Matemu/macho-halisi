"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Destination } from "@/lib/itineraries/types";
import { MapPin, Plus, Check, Search, Loader2, ExternalLink } from "lucide-react";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { inputClass, inputStyle } from "@/components/dashboard/ui/Field";

interface DestinationsTabProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export default function DestinationsTab({ selectedIds = [], onChange, disabled = false }: DestinationsTabProps) {
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
    if (selectedIds.includes(id)) onChange(selectedIds.filter((dId) => dId !== id));
    else onChange([...selectedIds, id]);
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
        if (!selectedIds.includes(created.id)) onChange([...selectedIds, created.id]);
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

  const filtered = destinations.filter((d) => d.name.toLowerCase().includes(searchFilter.toLowerCase().trim()));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <div>
          <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <MapPin className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Associated destinations
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            Select the national parks, conservation areas, and islands covered in this itinerary.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/dashboard/destinations" target="_blank">
            <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              Manage coordinates
            </Button>
          </Link>
          {!disabled && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                setAddError(null);
              }}
            >
              {isAddingNew ? "Cancel" : "Add new"}
            </Button>
          )}
        </div>
      </div>

      {isAddingNew && !disabled && (
        <form onSubmit={handleCreateDestination} className="animate-in fade-in p-4 rounded-lg space-y-3" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)" }}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-medium" style={{ color: "var(--dash-accent)" }}>
              Quick-add destination
            </span>
            <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
              Saved immediately and selected
            </span>
          </div>
          {addError && <InlineMessage tone="error">{addError}</InlineMessage>}
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              required
              disabled={addingLoading}
              value={newDestinationName}
              onChange={(e) => setNewDestinationName(e.target.value)}
              placeholder="e.g. Lake Natron or Mahale Mountains..."
              className={`flex-1 ${inputClass}`}
              style={inputStyle}
            />
            <Button type="submit" variant="primary" size="sm" loading={addingLoading} disabled={!newDestinationName.trim()} icon={<Plus className="w-3.5 h-3.5" />}>
              Create
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search available destinations..."
            aria-label="Search available destinations"
            className={`${inputClass} pl-9`}
            style={inputStyle}
          />
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-sm" style={{ color: "var(--dash-text-subtle)" }}>
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--dash-accent)" }} />
            Loading destinations catalog...
          </div>
        ) : error ? (
          <InlineMessage tone="error">{error}</InlineMessage>
        ) : destinations.length === 0 ? (
          <div className="p-8 text-center rounded-lg space-y-2" style={{ border: "1px dashed var(--dash-border-strong)" }}>
            <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
              No destinations in catalog yet.
            </p>
            <p className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
              Use the quick-add button above to create the first destination.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="group" aria-label="Available destinations">
            {filtered.map((dest) => {
              const isSelected = selectedIds.includes(dest.id);
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => toggleDestination(dest.id)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className="dash-focusable p-3.5 rounded-lg transition-all flex items-center justify-between text-left disabled:opacity-80 disabled:pointer-events-none"
                  style={{
                    background: isSelected ? "var(--dash-accent-soft)" : "var(--dash-surface-1)",
                    border: `1px solid ${isSelected ? "var(--dash-accent-soft-border)" : "var(--dash-border)"}`,
                  }}
                >
                  <span className="flex items-center gap-2.5 overflow-hidden">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: isSelected ? "var(--dash-accent)" : "var(--dash-text-subtle)" }} />
                    <span className="text-sm font-medium truncate" style={{ color: isSelected ? "var(--dash-text)" : "var(--dash-text-muted)" }}>
                      {dest.name}
                    </span>
                  </span>
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-2"
                    style={{
                      background: isSelected ? "var(--dash-accent-fill)" : "transparent",
                      border: `1px solid ${isSelected ? "var(--dash-accent-fill)" : "var(--dash-border-strong)"}`,
                    }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" style={{ color: "var(--dash-accent-on-fill)" }} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          <span>
            {selectedIds.length} destination{selectedIds.length === 1 ? "" : "s"} selected for this safari
          </span>
          {selectedIds.length > 0 && !disabled && (
            <button type="button" onClick={() => onChange([])} className="dash-focusable hover:underline rounded" style={{ color: "var(--dash-accent)" }}>
              Clear selections
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
