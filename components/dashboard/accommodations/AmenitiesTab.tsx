"use client";

import React from "react";
import { ListChecks, FileText } from "lucide-react";
import { AccommodationDetail } from "@/lib/accommodations/types";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import TagInput from "@/components/dashboard/itineraries/TagInput";

interface AmenitiesTabProps {
  data: AccommodationDetail;
  onChange: (fields: Partial<AccommodationDetail>, immediate?: boolean) => void;
  disabled?: boolean;
}

export default function AmenitiesTab({ data, onChange, disabled = false }: AmenitiesTabProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <FileText className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
          Description &amp; amenities
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
          Tell guests what makes this property special and list its facilities.
        </p>
      </div>

      <Field label="Description" hint="Rich narrative shown on the public detail page.">
        {({ id }) => (
          <textarea
            id={id}
            disabled={disabled}
            value={data.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={8}
            placeholder="Describe the setting, rooms, dining, views and experience…"
            className={`${inputClass} resize-y`}
            style={inputStyle}
          />
        )}
      </Field>

      <Field label="Amenities" hint="Type an amenity and press Enter — e.g. Wi-Fi, Pool, En-suite bathroom, Full board.">
        {() => (
          <div className="mt-1 flex items-start gap-2">
            <ListChecks className="w-4 h-4 mt-2 shrink-0" style={{ color: "var(--dash-text-subtle)" }} />
            <div className="flex-1">
              <TagInput
                tags={data.amenities || []}
                onChange={(amenities) => onChange({ amenities })}
                disabled={disabled}
                placeholder="Add an amenity and press Enter…"
              />
            </div>
          </div>
        )}
      </Field>
    </div>
  );
}
