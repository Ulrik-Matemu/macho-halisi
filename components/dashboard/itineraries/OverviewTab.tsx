"use client";

import React from "react";
import { AvailabilityStatus, ItineraryDetail } from "@/lib/itineraries/types";
import { DollarSign, Compass } from "lucide-react";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Switch from "@/components/dashboard/ui/Switch";

interface OverviewTabProps {
  data: Partial<ItineraryDetail>;
  onChange: (fields: Partial<ItineraryDetail>) => void;
  disabled?: boolean;
}

const cardStyle: React.CSSProperties = { background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" };

export default function OverviewTab({ data, onChange, disabled = false }: OverviewTabProps) {
  const priceOnRequest = Boolean(data.priceOnRequest);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-6 rounded-lg space-y-5" style={cardStyle}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <Compass className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Core identification
        </h3>

        <Field label="Itinerary title" required>
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              type="text"
              required
              disabled={disabled}
              value={data.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. 8-Day Serengeti Great Migration & Ngorongoro Crater Expedition"
              className={inputClass}
              style={inputStyle}
            />
          )}
        </Field>

        <Field label="URL slug" hint="Used in the public URL: /itineraries/[slug]. Auto-generated on creation.">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              type="text"
              disabled={disabled}
              value={data.slug || ""}
              onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              placeholder="e.g. serengeti-migration-ngorongoro-8-days"
              className={`${inputClass} dash-code`}
              style={{ ...inputStyle, color: "var(--dash-accent)" }}
            />
          )}
        </Field>

        <Field label="Executive summary / overview narrative">
          {({ id, describedBy }) => (
            <textarea
              id={id}
              aria-describedby={describedBy}
              rows={5}
              disabled={disabled}
              value={data.overview || ""}
              onChange={(e) => onChange({ overview: e.target.value })}
              placeholder="Describe the atmosphere, highlights, wildlife expectations, and unique luxury safari encounters of this journey..."
              className={`${inputClass} leading-relaxed resize-y`}
              style={inputStyle}
            />
          )}
        </Field>
      </div>

      <div className="p-6 rounded-lg space-y-6" style={cardStyle}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <DollarSign className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Duration & commercials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Duration (nights)">
            {({ id }) => (
              <input
                id={id}
                type="number"
                min={0}
                disabled={disabled}
                value={data.nights !== undefined && data.nights !== null ? data.nights : ""}
                onChange={(e) => onChange({ nights: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                placeholder="e.g. 7"
                className={inputClass}
                style={inputStyle}
              />
            )}
          </Field>

          <Field label="Booking availability">
            {({ id }) => (
              <select
                id={id}
                disabled={disabled}
                value={data.availabilityStatus || "AVAILABLE"}
                onChange={(e) => onChange({ availabilityStatus: e.target.value as AvailabilityStatus })}
                className={inputClass}
                style={inputStyle}
              >
                <option value="AVAILABLE">Available (open for bookings)</option>
                <option value="LIMITED">Limited (few departures/slots left)</option>
                <option value="FULLY_BOOKED">Fully booked (waitlist only)</option>
              </select>
            )}
          </Field>
        </div>

        <div className="pt-4 space-y-4" style={{ borderTop: "1px solid var(--dash-border)" }}>
          <Switch
            checked={priceOnRequest}
            disabled={disabled}
            label="Price on request"
            description="Hide the numeric starting price on marketing pages and invite private consultation."
            onChange={(checked) =>
              onChange({ priceOnRequest: checked, startingPrice: checked ? null : data.startingPrice || 1000 })
            }
          />

          {!priceOnRequest && (
            <Field label="Starting price per person (USD)" required>
              {({ id }) => (
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--dash-text-subtle)" }}>
                    $
                  </span>
                  <input
                    id={id}
                    type="number"
                    min={0}
                    step="1"
                    required
                    disabled={disabled}
                    value={data.startingPrice !== undefined && data.startingPrice !== null ? data.startingPrice : ""}
                    onChange={(e) => onChange({ startingPrice: e.target.value === "" ? null : parseFloat(e.target.value) })}
                    placeholder="4500"
                    className={`${inputClass} pl-8 dash-code`}
                    style={inputStyle}
                  />
                </div>
              )}
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}
