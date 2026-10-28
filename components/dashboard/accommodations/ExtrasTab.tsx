"use client";

import React from "react";
import { Compass } from "lucide-react";
import {
  AccommodationActivity,
  AccommodationDetail,
  ActivityCategory,
  ACTIVITY_CATEGORY_LABELS,
  NearbyPlace,
} from "@/lib/accommodations/types";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import ListEditor from "./ListEditor";

const ACTIVITY_OPTIONS = Object.entries(ACTIVITY_CATEGORY_LABELS) as [ActivityCategory, string][];

interface ExtrasTabProps {
  data: AccommodationDetail;
  onChange: (fields: Partial<AccommodationDetail>, immediate?: boolean) => void;
  disabled?: boolean;
}

export default function ExtrasTab({ data, onChange, disabled = false }: ExtrasTabProps) {
  return (
    <div className="space-y-10 max-w-3xl">
      <section className="space-y-6">
        <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
          <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <Compass className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Activities
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            Safaris, walks and cultural experiences guests can book from here.
          </p>
        </div>
        <ListEditor<AccommodationActivity>
          items={data.activities ?? []}
          onChange={(activities) => onChange({ activities })}
          disabled={disabled}
          addLabel="Add activity"
          emptyText="No activities yet."
          makeItem={() => ({ name: "", description: "", category: "SAFARI" })}
          titleOf={(a) => a.name || "New activity"}
          renderItem={(a, update) => (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required>
                  {({ id }) => (
                    <input id={id} type="text" disabled={disabled} value={a.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} style={inputStyle} />
                  )}
                </Field>
                <Field label="Group">
                  {({ id }) => (
                    <select id={id} disabled={disabled} value={a.category} onChange={(e) => update({ category: e.target.value as ActivityCategory })} className={inputClass} style={inputStyle}>
                      {ACTIVITY_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
              <Field label="Description">
                {({ id }) => (
                  <textarea id={id} rows={3} disabled={disabled} value={a.description ?? ""} onChange={(e) => update({ description: e.target.value })} className={`${inputClass} resize-y`} style={inputStyle} />
                )}
              </Field>
            </>
          )}
        />
      </section>

      <section className="space-y-6">
        <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
          <h3 className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
            Nearby places
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            Parks, towns and sights close to the property, with distances.
          </p>
        </div>
        <ListEditor<NearbyPlace>
          items={data.nearbyPlaces ?? []}
          onChange={(nearbyPlaces) => onChange({ nearbyPlaces })}
          disabled={disabled}
          addLabel="Add nearby place"
          emptyText="No nearby places yet."
          makeItem={() => ({ name: "", distanceKm: null, description: "" })}
          titleOf={(p) => p.name || "New place"}
          renderItem={(p, update) => (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required>
                  {({ id }) => (
                    <input id={id} type="text" disabled={disabled} value={p.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} style={inputStyle} />
                  )}
                </Field>
                <Field label="Distance (km)">
                  {({ id }) => (
                    <input
                      id={id}
                      type="number"
                      min={0}
                      step="any"
                      disabled={disabled}
                      value={p.distanceKm ?? ""}
                      onChange={(e) => update({ distanceKm: e.target.value === "" ? null : Number(e.target.value) })}
                      className={inputClass}
                      style={inputStyle}
                    />
                  )}
                </Field>
              </div>
              <Field label="Description">
                {({ id }) => (
                  <textarea id={id} rows={3} disabled={disabled} value={p.description ?? ""} onChange={(e) => update({ description: e.target.value })} className={`${inputClass} resize-y`} style={inputStyle} />
                )}
              </Field>
            </>
          )}
        />
      </section>
    </div>
  );
}
