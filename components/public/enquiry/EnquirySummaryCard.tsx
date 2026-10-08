"use client";

import React from "react";
import { Compass, Calendar, Users, Home, Sparkles } from "lucide-react";

export interface EnquirySelectionState {
  destinations: string[];
  travelWindow: string;
  tripLength: string;
  partySize: string;
  accommodationStyle: string;
  specialInterests: string[];
}

interface EnquirySummaryCardProps {
  state: EnquirySelectionState;
}

export default function EnquirySummaryCard({ state }: EnquirySummaryCardProps) {
  return (
    <div className="bg-safari-bark text-safari-cream p-6 sm:p-7 border border-safari-russet/40 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-safari-sand" />
          <span className="font-serif-luxury text-base text-white">Your Safari Vision</span>
        </div>
        <span className="text-[10px] font-mono text-safari-sand uppercase tracking-widest">
          Live Blueprint
        </span>
      </div>

      <div className="space-y-4 text-xs font-sans">
        {/* Destinations */}
        <div>
          <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-safari-sand" />
            <span>Destinations Selected:</span>
          </div>
          {state.destinations.length === 0 ? (
            <span className="text-white/40 italic">Open to specialist curation</span>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {state.destinations.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-1 bg-white/10 text-white rounded text-[11px] border border-white/10"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timing & Party */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-safari-sand" />
              <span>Timing & Length:</span>
            </div>
            <div className="text-white font-medium">
              {state.travelWindow || "Flexible"}
            </div>
            <div className="text-white/60 text-[11px]">
              {state.tripLength || "8–10 Days"}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-safari-sand" />
              <span>Party Size:</span>
            </div>
            <div className="text-white font-medium">
              {state.partySize || "Couple (2 Travelers)"}
            </div>
          </div>
        </div>

        {/* Accommodation Style */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Home className="w-3 h-3 text-safari-sand" />
            <span>Accommodations:</span>
          </div>
          <div className="text-white font-medium">
            {state.accommodationStyle || "Luxury Canvas & Rim Lodges"}
          </div>
        </div>

        {/* Special Interests */}
        {state.specialInterests.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">
              Special Desires:
            </div>
            <div className="flex flex-wrap gap-1">
              {state.specialInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 bg-safari-russet/30 text-safari-sand rounded text-[10px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/10 text-[11px] text-white/60 font-sans leading-relaxed">
        Our Karatu safari directors will use these nuances to hand-draft your route proposal.
      </div>
    </div>
  );
}
