"use client";

import React from "react";
import TagInput from "./TagInput";
import { CheckCircle2, XCircle, Info, Map, Compass } from "lucide-react";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Switch from "@/components/dashboard/ui/Switch";

interface InclusionsTabProps {
  inclusions: string[];
  exclusions: string[];
  travelInfo: string | null;
  routeMapUrl: string | null;
  showRouteMap: boolean;
  onChange: (patch: {
    inclusions?: string[];
    exclusions?: string[];
    travelInfo?: string | null;
    routeMapUrl?: string | null;
    showRouteMap?: boolean;
  }) => void;
  disabled?: boolean;
}

const cardStyle: React.CSSProperties = { background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" };

export default function InclusionsTab({
  inclusions = [],
  exclusions = [],
  travelInfo = "",
  routeMapUrl = "",
  showRouteMap = true,
  onChange,
  disabled = false,
}: InclusionsTabProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-lg space-y-3" style={cardStyle}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: "var(--dash-status-published)" }} />
            <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
              Package inclusions
            </h3>
          </div>
          <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
            Services, park entry fees, and safari amenities covered in the trip cost.
          </p>
          <TagInput
            disabled={disabled}
            tags={inclusions}
            onChange={(tags) => onChange({ inclusions: tags })}
            placeholder="e.g. All national park fees, Private 4x4 Cruiser, Expert Guide..."
          />
        </div>

        <div className="p-6 rounded-lg space-y-3" style={cardStyle}>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" style={{ color: "var(--dash-status-danger)" }} />
            <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
              Package exclusions
            </h3>
          </div>
          <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
            Items travelers are responsible for independently.
          </p>
          <TagInput
            disabled={disabled}
            tags={exclusions}
            onChange={(tags) => onChange({ exclusions: tags })}
            placeholder="e.g. International flights, Tanzania Visa, Gratuities, Travel Insurance..."
          />
        </div>
      </div>

      <div className="p-6 rounded-lg space-y-4" style={cardStyle}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
            Essential travel guidelines & briefing
          </h3>
        </div>
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          Important guidance regarding optimal clothing colors, baggage weight limits on light aircraft flights, visa
          recommendations, and vaccination requirements.
        </p>
        <Field label="Travel guidelines">
          {({ id }) => (
            <textarea
              id={id}
              rows={5}
              disabled={disabled}
              value={travelInfo || ""}
              onChange={(e) => onChange({ travelInfo: e.target.value })}
              placeholder="e.g. Luggage on internal safari flights is strictly limited to 15kg in soft-sided duffel bags..."
              className={`${inputClass} leading-relaxed resize-y`}
              style={inputStyle}
            />
          )}
        </Field>
      </div>

      <div className="p-6 rounded-lg space-y-4" style={cardStyle}>
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
            Interactive route map URL
          </h3>
        </div>
        <Field label="Route map URL" hint="Optional embeddable Mapbox, Google Maps, or custom GIS route URL displaying the circuit travel path.">
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              type="url"
              disabled={disabled}
              value={routeMapUrl || ""}
              onChange={(e) => onChange({ routeMapUrl: e.target.value })}
              placeholder="https://maps.google.com/..."
              className={`${inputClass} dash-code`}
              style={inputStyle}
            />
          )}
        </Field>
      </div>

      <div className="p-6 rounded-lg space-y-4" style={cardStyle}>
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
            Interactive journey map
          </h3>
        </div>
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          Shows the built-in Mapbox journey map on the public page, plotted from each day&apos;s coordinates or its
          destination&apos;s. Turn off if geo data isn&apos;t ready yet — the page falls back to the plain route map
          URL link above with no visible gap.
        </p>
        <Switch checked={showRouteMap} disabled={disabled} label="Show interactive route map" onChange={(checked) => onChange({ showRouteMap: checked })} />
      </div>
    </div>
  );
}
