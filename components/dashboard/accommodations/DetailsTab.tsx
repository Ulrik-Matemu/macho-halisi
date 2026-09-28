"use client";

import React, { useEffect, useState } from "react";
import { Crosshair, Hotel, MapPin, DollarSign } from "lucide-react";
import {
  AccommodationDetail,
  AccommodationType,
  ServiceTier,
  ACCOMMODATION_TYPE_LABELS,
  SERVICE_TIER_LABELS,
} from "@/lib/accommodations/types";
import { Destination } from "@/lib/itineraries/types";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Switch from "@/components/dashboard/ui/Switch";
import LocationPickerModal from "@/components/dashboard/LocationPickerModal";

const TYPE_OPTIONS = Object.entries(ACCOMMODATION_TYPE_LABELS) as [AccommodationType, string][];
const TIER_OPTIONS = Object.entries(SERVICE_TIER_LABELS) as [ServiceTier, string][];

interface DetailsTabProps {
  data: AccommodationDetail;
  onChange: (fields: Partial<AccommodationDetail>, immediate?: boolean) => void;
  disabled?: boolean;
}

export default function DetailsTab({ data, onChange, disabled = false }: DetailsTabProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/destinations");
        const json = await res.json();
        if (mounted && res.ok && json.status === "ok" && Array.isArray(json.data)) {
          setDestinations(json.data);
        }
      } catch (err) {
        console.error("Failed to load destinations:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasMapbox = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <Hotel className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Property details
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
          Name, categorization, location and pricing. Changes autosave.
        </p>
      </div>

      <Field label="Name" required>
        {({ id }) => (
          <input
            id={id}
            type="text"
            disabled={disabled}
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Serengeti Serena Safari Lodge"
            className={inputClass}
            style={inputStyle}
          />
        )}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Type" required>
          {({ id }) => (
            <select
              id={id}
              disabled={disabled}
              value={data.type}
              onChange={(e) => onChange({ type: e.target.value as AccommodationType })}
              className={inputClass}
              style={inputStyle}
            >
              {TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Service tier" required>
          {({ id }) => (
            <select
              id={id}
              disabled={disabled}
              value={data.serviceTier}
              onChange={(e) => onChange({ serviceTier: e.target.value as ServiceTier })}
              className={inputClass}
              style={inputStyle}
            >
              {TIER_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Star rating">
          {({ id }) => (
            <select
              id={id}
              disabled={disabled}
              value={data.starRating ?? ""}
              onChange={(e) => onChange({ starRating: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputClass}
              style={inputStyle}
            >
              <option value="">Unrated</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field label="Location" required hint="Human-readable, e.g. 'Central Serengeti, near Seronera'.">
        {({ id }) => (
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
            <input
              id={id}
              type="text"
              disabled={disabled}
              value={data.locationText}
              onChange={(e) => onChange({ locationText: e.target.value })}
              placeholder="e.g. Central Serengeti, Tanzania"
              className={`${inputClass} pl-9`}
              style={inputStyle}
            />
          </div>
        )}
      </Field>

      <Field label="Linked destination" hint="Optional — associate this property with a destination in the catalog.">
        {({ id }) => (
          <select
            id={id}
            disabled={disabled}
            value={data.destinationId ?? ""}
            onChange={(e) => onChange({ destinationId: e.target.value === "" ? null : e.target.value })}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">No linked destination</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}
      </Field>

      <div className="p-4 rounded-lg space-y-3.5" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm" style={{ color: "var(--dash-text)" }}>
            Map coordinates
          </span>
          {!disabled && hasMapbox && (
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="dash-focusable text-xs hover:underline rounded flex items-center gap-1"
              style={{ color: "var(--dash-accent)" }}
            >
              <Crosshair className="w-3 h-3" />
              Pick on map
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            {({ id }) => (
              <input
                id={id}
                type="text"
                inputMode="decimal"
                disabled={disabled}
                value={data.latitude ?? ""}
                onChange={(e) => onChange({ latitude: e.target.value.trim() === "" ? null : Number(e.target.value) })}
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
                disabled={disabled}
                value={data.longitude ?? ""}
                onChange={(e) => onChange({ longitude: e.target.value.trim() === "" ? null : Number(e.target.value) })}
                placeholder="e.g. 34.8333"
                className={inputClass}
                style={inputStyle}
              />
            )}
          </Field>
        </div>
      </div>

      <div className="p-4 rounded-lg space-y-4" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
        <Switch
          checked={data.priceOnRequest}
          onChange={(checked) => onChange({ priceOnRequest: checked })}
          disabled={disabled}
          label="Price on request"
          description="Hide a fixed nightly rate and invite enquiries instead."
        />
        {!data.priceOnRequest && (
          <Field label="Price per night (USD)" required>
            {({ id }) => (
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
                <input
                  id={id}
                  type="number"
                  min={1}
                  disabled={disabled}
                  value={data.pricePerNight ?? ""}
                  onChange={(e) => onChange({ pricePerNight: e.target.value === "" ? null : Number(e.target.value) })}
                  placeholder="e.g. 500"
                  className={`${inputClass} pl-9`}
                  style={inputStyle}
                />
              </div>
            )}
          </Field>
        )}
      </div>

      {showPicker && (
        <LocationPickerModal
          title={`Set location for ${data.name || "accommodation"}`}
          initialLat={data.latitude ?? null}
          initialLng={data.longitude ?? null}
          onConfirm={(lat, lng) => {
            onChange({ latitude: lat, longitude: lng });
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
