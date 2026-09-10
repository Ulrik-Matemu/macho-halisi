"use client";

import React from "react";
import TagInput from "./TagInput";
import { CheckCircle2, XCircle, Info, Map } from "lucide-react";

interface InclusionsTabProps {
  inclusions: string[];
  exclusions: string[];
  travelInfo: string | null;
  routeMapUrl: string | null;
  onChange: (patch: {
    inclusions?: string[];
    exclusions?: string[];
    travelInfo?: string | null;
    routeMapUrl?: string | null;
  }) => void;
  disabled?: boolean;
}

export default function InclusionsTab({
  inclusions = [],
  exclusions = [],
  travelInfo = "",
  routeMapUrl = "",
  onChange,
  disabled = false,
}: InclusionsTabProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions */}
        <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif-luxury text-base text-white font-light">
              Package Inclusions
            </h3>
          </div>
          <p className="text-xs text-white/50">
            Services, park entry fees, and safari amenities covered in the trip cost.
          </p>
          <TagInput
            disabled={disabled}
            tags={inclusions}
            onChange={(tags) => onChange({ inclusions: tags })}
            placeholder="e.g. All national park fees, Private 4x4 Cruiser, Expert Guide..."
          />
        </div>

        {/* Exclusions */}
        <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <h3 className="font-serif-luxury text-base text-white font-light">
              Package Exclusions
            </h3>
          </div>
          <p className="text-xs text-white/50">
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

      {/* Travel Info Narrative */}
      <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#c68642]" />
          <h3 className="font-serif-luxury text-base text-white font-light">
            Essential Travel Guidelines & Briefing
          </h3>
        </div>
        <p className="text-xs text-white/50">
          Important guidance regarding optimal clothing colors, baggage weight limits on light aircraft flights, visa recommendations, and vaccination requirements.
        </p>
        <textarea
          rows={5}
          disabled={disabled}
          value={travelInfo || ""}
          onChange={(e) => onChange({ travelInfo: e.target.value })}
          placeholder="e.g. Luggage on internal safari flights is strictly limited to 15kg in soft-sided duffel bags. Light neutral tones (khaki, beige, olive) are recommended; avoid dark blue or black in tsetse fly zones..."
          className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none transition-colors leading-relaxed resize-y disabled:opacity-60"
        />
      </div>

      {/* Route Map URL */}
      <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#c68642]" />
          <h3 className="font-serif-luxury text-base text-white font-light">
            Interactive Route Map URL
          </h3>
        </div>
        <p className="text-xs text-white/50">
          Optional embeddable Mapbox, Google Maps, or custom GIS route URL displaying the circuit travel path.
        </p>
        <input
          type="url"
          disabled={disabled}
          value={routeMapUrl || ""}
          onChange={(e) => onChange({ routeMapUrl: e.target.value })}
          placeholder="https://maps.google.com/..."
          className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
        />
      </div>
    </div>
  );
}
