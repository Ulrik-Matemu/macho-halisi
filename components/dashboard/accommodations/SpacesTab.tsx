"use client";

import React from "react";
import { BedDouble } from "lucide-react";
import { AccommodationDetail, AccommodationSpace, SpaceCategory } from "@/lib/accommodations/types";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import TagInput from "@/components/dashboard/itineraries/TagInput";
import ListEditor from "./ListEditor";

const CATEGORY_OPTIONS: [SpaceCategory, string][] = [
  ["ROOM", "Room / accommodation"],
  ["CAMPING", "Campsite"],
  ["DINING", "Dining & social"],
  ["WELLNESS", "Leisure & wellness"],
  ["MEETINGS", "Conferences & events"],
];

interface SpacesTabProps {
  data: AccommodationDetail;
  onChange: (fields: Partial<AccommodationDetail>, immediate?: boolean) => void;
  disabled?: boolean;
}

export default function SpacesTab({ data, onChange, disabled = false }: SpacesTabProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <BedDouble className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Rooms &amp; spaces
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
          Rooms, campsite, dining, wellness and event spaces. They appear on the public page grouped by type, in this order.
        </p>
      </div>

      <ListEditor<AccommodationSpace>
        items={data.spaces ?? []}
        onChange={(spaces) => onChange({ spaces })}
        disabled={disabled}
        addLabel="Add space"
        emptyText="No spaces yet."
        makeItem={() => ({ category: "ROOM", name: "", tagline: "", description: "", capacity: null, features: [] })}
        titleOf={(s) => s.name || "New space"}
        renderItem={(s, update) => (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Name" required>
                {({ id }) => (
                  <input id={id} type="text" disabled={disabled} value={s.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} style={inputStyle} />
                )}
              </Field>
              <Field label="Type">
                {({ id }) => (
                  <select id={id} disabled={disabled} value={s.category} onChange={(e) => update({ category: e.target.value as SpaceCategory })} className={inputClass} style={inputStyle}>
                    {CATEGORY_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Capacity (guests)">
                {({ id }) => (
                  <input
                    id={id}
                    type="number"
                    min={1}
                    disabled={disabled}
                    value={s.capacity ?? ""}
                    onChange={(e) => update({ capacity: e.target.value === "" ? null : Number(e.target.value) })}
                    className={inputClass}
                    style={inputStyle}
                  />
                )}
              </Field>
            </div>
            <Field label="Tagline">
              {({ id }) => (
                <input id={id} type="text" disabled={disabled} value={s.tagline ?? ""} onChange={(e) => update({ tagline: e.target.value })} className={inputClass} style={inputStyle} />
              )}
            </Field>
            <Field label="Description">
              {({ id }) => (
                <textarea id={id} rows={4} disabled={disabled} value={s.description ?? ""} onChange={(e) => update({ description: e.target.value })} className={`${inputClass} resize-y`} style={inputStyle} />
              )}
            </Field>
            <Field label="Features" hint="Type a feature and press Enter.">
              {() => <TagInput tags={s.features ?? []} onChange={(features) => update({ features })} disabled={disabled} placeholder="Add a feature and press Enter…" />}
            </Field>
          </>
        )}
      />
    </div>
  );
}
