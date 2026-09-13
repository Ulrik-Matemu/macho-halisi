"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ItineraryDay, ItineraryImage, ItineraryDestinationItem } from "@/lib/itineraries/types";
import TagInput from "./TagInput";
import LocationPickerModal from "@/components/dashboard/LocationPickerModal";
import { Plus, Trash2, ArrowUp, ArrowDown, Calendar, Hotel, MapPin, Star, ImageOff, Crosshair } from "lucide-react";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import EmptyState from "@/components/dashboard/ui/EmptyState";

interface DaysTabProps {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  images?: ItineraryImage[];
  destinations?: ItineraryDestinationItem[];
  disabled?: boolean;
}

const cardStyle: React.CSSProperties = { background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" };

export default function DaysTab({ days = [], onChange, images = [], destinations = [], disabled = false }: DaysTabProps) {
  const [pickerForIndex, setPickerForIndex] = useState<number | null>(null);

  const updateDay = (index: number, patch: Partial<ItineraryDay>) => {
    if (disabled) return;
    const next = [...days];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addDay = () => {
    if (disabled) return;
    const newDay: ItineraryDay = {
      dayNumber: days.length + 1,
      title: "",
      description: "",
      accommodation: "",
      activities: [],
      latitude: null,
      longitude: null,
      heroImageId: null,
      highlight: false,
    };
    onChange([...days, newDay]);
  };

  const removeDay = (index: number) => {
    if (disabled) return;
    const filtered = days.filter((_, idx) => idx !== index);
    onChange(filtered.map((d, idx) => ({ ...d, dayNumber: idx + 1 })));
  };

  const moveDay = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    if (toIndex < 0 || toIndex >= days.length) return;
    const next = [...days];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next.map((d, idx) => ({ ...d, dayNumber: idx + 1 })));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <div>
          <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <Calendar className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Day-by-day journey schedule
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            {days.length === 0 ? "No days added yet. Click Add day below to start building the itinerary." : `${days.length} day${days.length === 1 ? "" : "s"} sequenced.`}
          </p>
        </div>
        {!disabled && (
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={addDay}>
            Add day
          </Button>
        )}
      </div>

      {days.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No days defined"
          description="Safari itineraries require at least one day before they can be published."
          action={
            !disabled && (
              <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={addDay}>
                Add day 1
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-5">
          {days.map((day, idx) => (
            <div key={`day-${idx}-${day.dayNumber}`} className="p-5 sm:p-6 rounded-lg space-y-4" style={cardStyle}>
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--dash-border)" }}>
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold"
                    style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}
                  >
                    {day.dayNumber}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                    Day {day.dayNumber}
                  </span>
                </div>
                {!disabled && (
                  <div className="flex items-center gap-1">
                    <IconButton label="Move day earlier" disabled={idx === 0} onClick={() => moveDay(idx, idx - 1)}>
                      <ArrowUp className="w-4 h-4" />
                    </IconButton>
                    <IconButton label="Move day later" disabled={idx === days.length - 1} onClick={() => moveDay(idx, idx + 1)}>
                      <ArrowDown className="w-4 h-4" />
                    </IconButton>
                    <IconButton label="Delete this day" tone="danger" onClick={() => removeDay(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Field label="Day title / route highlight">
                  {({ id }) => (
                    <input
                      id={id}
                      type="text"
                      disabled={disabled}
                      value={day.title || ""}
                      onChange={(e) => updateDay(idx, { title: e.target.value })}
                      placeholder="e.g. Arusha to Tarangire National Park — Land of Giants"
                      className={inputClass}
                      style={inputStyle}
                    />
                  )}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Accommodation / lodge">
                    {({ id }) => (
                      <div className="relative">
                        <Hotel className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-accent)" }} />
                        <input
                          id={id}
                          type="text"
                          disabled={disabled}
                          value={day.accommodation || ""}
                          onChange={(e) => updateDay(idx, { accommodation: e.target.value })}
                          placeholder="e.g. Tarangire Treetops Lodge"
                          className={`${inputClass} pl-9`}
                          style={inputStyle}
                        />
                      </div>
                    )}
                  </Field>

                  <div>
                    <span className="dash-label block mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
                      Activities (press Enter after each)
                    </span>
                    <TagInput disabled={disabled} tags={day.activities || []} onChange={(activities) => updateDay(idx, { activities })} placeholder="e.g. Morning Game Drive, Bush Walk..." />
                  </div>
                </div>

                <Field label="Day narrative & wildlife encounters">
                  {({ id }) => (
                    <textarea
                      id={id}
                      rows={3}
                      disabled={disabled}
                      value={day.description || ""}
                      onChange={(e) => updateDay(idx, { description: e.target.value })}
                      placeholder="Details about the day's drive, scenic overlooks, picnic lunches, and animal encounters..."
                      className={`${inputClass} leading-relaxed resize-y`}
                      style={inputStyle}
                    />
                  )}
                </Field>

                <div>
                  <span className="dash-label mb-1.5 flex items-center gap-1" style={{ color: "var(--dash-text-muted)" }}>
                    <MapPin className="w-3 h-3" style={{ color: "var(--dash-accent)" }} />
                    Map pin (optional — falls back to destination coordinates)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={disabled}
                      value={day.latitude ?? ""}
                      onChange={(e) => updateDay(idx, { latitude: e.target.value === "" ? null : Number(e.target.value) })}
                      placeholder="Latitude"
                      aria-label="Latitude"
                      className={`w-32 ${inputClass} py-2`}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={disabled}
                      value={day.longitude ?? ""}
                      onChange={(e) => updateDay(idx, { longitude: e.target.value === "" ? null : Number(e.target.value) })}
                      placeholder="Longitude"
                      aria-label="Longitude"
                      className={`w-32 ${inputClass} py-2`}
                      style={inputStyle}
                    />
                    {!disabled && process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
                      <Button variant="secondary" size="sm" icon={<Crosshair className="w-3 h-3" />} onClick={() => setPickerForIndex(idx)}>
                        Pick on map
                      </Button>
                    )}
                    {!disabled &&
                      destinations
                        .filter((d) => d.destination.latitude != null && d.destination.longitude != null)
                        .map((d) => (
                          <button
                            key={d.destination.id}
                            type="button"
                            onClick={() => updateDay(idx, { latitude: d.destination.latitude, longitude: d.destination.longitude })}
                            className="dash-focusable px-2.5 py-1.5 rounded-md text-xs transition-colors"
                            style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)", color: "var(--dash-text-muted)" }}
                          >
                            Use {d.destination.name}
                          </button>
                        ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                  <div>
                    <span className="dash-label block mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
                      Hero photo (optional — overrides the default photo cycle)
                    </span>
                    {images.length === 0 ? (
                      <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--dash-text-subtle)" }}>
                        <ImageOff className="w-3.5 h-3.5" />
                        Upload gallery photos in the Gallery tab to pick one here.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => updateDay(idx, { heroImageId: null })}
                          title="Use default photo cycle"
                          className="dash-focusable w-14 h-14 rounded-md flex items-center justify-center text-[9px] uppercase transition-colors disabled:opacity-60"
                          style={{
                            border: `1px solid ${!day.heroImageId ? "var(--dash-accent)" : "var(--dash-border-strong)"}`,
                            background: !day.heroImageId ? "var(--dash-accent-soft)" : "transparent",
                            color: !day.heroImageId ? "var(--dash-accent)" : "var(--dash-text-subtle)",
                          }}
                        >
                          None
                        </button>
                        {images.map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => updateDay(idx, { heroImageId: img.id })}
                            title={img.altText || undefined}
                            className="dash-focusable relative w-14 h-14 rounded-md overflow-hidden transition-colors disabled:opacity-60"
                            style={{ border: `2px solid ${day.heroImageId === img.id ? "var(--dash-accent)" : "transparent"}` }}
                          >
                            <Image src={img.url} alt={img.altText || ""} fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    <span className="dash-label block mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
                      Signature moment
                    </span>
                    <label
                      className="dash-focusable flex items-center gap-2 cursor-pointer w-fit px-3 py-2 rounded-md transition-colors"
                      style={{ border: "1px solid var(--dash-border-strong)" }}
                    >
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={Boolean(day.highlight)}
                        onChange={(e) => updateDay(idx, { highlight: e.target.checked })}
                        className="w-4 h-4 cursor-pointer disabled:opacity-60"
                        style={{ accentColor: "var(--dash-accent-fill)" }}
                      />
                      <Star className="w-3.5 h-3.5" style={{ color: "var(--dash-accent)" }} />
                      <span className="text-sm whitespace-nowrap" style={{ color: "var(--dash-text-muted)" }}>
                        Highlight this day
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!disabled && (
            <button
              type="button"
              onClick={addDay}
              className="dash-focusable w-full py-3.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              style={{ border: "1px dashed var(--dash-accent-soft-border)", background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}
            >
              <Plus className="w-4 h-4" />
              Add day {days.length + 1}
            </button>
          )}
        </div>
      )}

      {pickerForIndex !== null && days[pickerForIndex] && (
        <LocationPickerModal
          title={`Set location for Day ${days[pickerForIndex]!.dayNumber}`}
          initialLat={days[pickerForIndex]!.latitude}
          initialLng={days[pickerForIndex]!.longitude}
          onConfirm={(lat, lng) => {
            updateDay(pickerForIndex, { latitude: lat, longitude: lng });
            setPickerForIndex(null);
          }}
          onClose={() => setPickerForIndex(null)}
        />
      )}
    </div>
  );
}
