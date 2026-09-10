"use client";

import React from "react";
import { AvailabilityStatus, ItineraryDetail } from "@/lib/itineraries/types";
import { DollarSign, Moon, Compass, Hash } from "lucide-react";

interface OverviewTabProps {
  data: Partial<ItineraryDetail>;
  onChange: (fields: Partial<ItineraryDetail>) => void;
  disabled?: boolean;
}

export default function OverviewTab({
  data,
  onChange,
  disabled = false,
}: OverviewTabProps) {
  const priceOnRequest = Boolean(data.priceOnRequest);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Section 1: Core Identification */}
      <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-5">
        <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c68642]" />
          <span>Core Identification</span>
        </h3>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2">
            Itinerary Title *
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            value={data.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. 8-Day Serengeti Great Migration & Ngorongoro Crater Expedition"
            className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3 h-3 text-[#c68642]" />
              URL Slug (Auto-generated on creation)
            </span>
            <span className="text-[10px] text-white/40 normal-case">
              Used in public URL: /itineraries/[slug]
            </span>
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data.slug || ""}
            onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
            placeholder="e.g. serengeti-migration-ngorongoro-8-days"
            className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-2.5 text-xs font-mono text-[#f1c27d] placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2">
            Executive Summary / Overview Narrative
          </label>
          <textarea
            rows={5}
            disabled={disabled}
            value={data.overview || ""}
            onChange={(e) => onChange({ overview: e.target.value })}
            placeholder="Describe the atmosphere, highlights, wildlife expectations, and unique luxury safari encounters of this journey..."
            className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors leading-relaxed resize-y disabled:opacity-60"
          />
        </div>
      </div>

      {/* Section 2: Duration, Pricing & Availability */}
      <div className="p-6 rounded-lg bg-[#0e0e0e] border border-white/10 space-y-6">
        <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#c68642]" />
          <span>Duration & Commercials</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nights */}
          <div>
            <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#c68642]" />
              Duration (Nights)
            </label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={data.nights !== undefined && data.nights !== null ? data.nights : ""}
              onChange={(e) => {
                const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                onChange({ nights: val });
              }}
              placeholder="e.g. 7"
              className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
            />
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2">
              Booking Availability
            </label>
            <select
              disabled={disabled}
              value={data.availabilityStatus || "AVAILABLE"}
              onChange={(e) =>
                onChange({ availabilityStatus: e.target.value as AvailabilityStatus })
              }
              className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors disabled:opacity-60"
            >
              <option value="AVAILABLE">AVAILABLE (Open for Bookings)</option>
              <option value="LIMITED">LIMITED (Few Departures / Slots Left)</option>
              <option value="FULLY_BOOKED">FULLY_BOOKED (Waitlist Only)</option>
            </select>
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-white font-medium block">
                Price On Request
              </span>
              <span className="text-xs text-white/50 block">
                Hide numeric starting price on marketing pages and invite private consultation.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={disabled}
                checked={priceOnRequest}
                onChange={(e) => {
                  const checked = e.target.checked;
                  onChange({
                    priceOnRequest: checked,
                    startingPrice: checked ? null : data.startingPrice || 1000,
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c68642]" />
            </label>
          </div>

          {!priceOnRequest && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2">
                Starting Price per Person (USD) *
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  required
                  disabled={disabled}
                  value={
                    data.startingPrice !== undefined && data.startingPrice !== null
                      ? data.startingPrice
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value === "" ? null : parseFloat(e.target.value);
                    onChange({ startingPrice: val });
                  }}
                  placeholder="4500"
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded pl-8 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60 font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
