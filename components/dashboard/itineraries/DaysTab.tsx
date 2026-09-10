"use client";

import React from "react";
import { ItineraryDay } from "@/lib/itineraries/types";
import TagInput from "./TagInput";
import { Plus, Trash2, ArrowUp, ArrowDown, Calendar, Hotel } from "lucide-react";

interface DaysTabProps {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  disabled?: boolean;
}

export default function DaysTab({
  days = [],
  onChange,
  disabled = false,
}: DaysTabProps) {
  const updateDay = (index: number, patch: Partial<ItineraryDay>) => {
    if (disabled) return;
    const next = [...days];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addDay = () => {
    if (disabled) return;
    const nextDayNumber = days.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNumber,
      title: "",
      description: "",
      accommodation: "",
      activities: [],
    };
    onChange([...days, newDay]);
  };

  const removeDay = (index: number) => {
    if (disabled) return;
    const filtered = days.filter((_, idx) => idx !== index);
    // Re-index dayNumbers
    const reindexed = filtered.map((d, idx) => ({
      ...d,
      dayNumber: idx + 1,
    }));
    onChange(reindexed);
  };

  const moveDay = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    if (toIndex < 0 || toIndex >= days.length) return;
    const next = [...days];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    // Re-index dayNumbers sequentially
    const reindexed = next.map((d, idx) => ({
      ...d,
      dayNumber: idx + 1,
    }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c68642]" />
            <span>Day-by-Day Journey Schedule</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            {days.length === 0
              ? "No days added yet. Click Add Day below to start building the itinerary."
              : `${days.length} day${days.length === 1 ? "" : "s"} sequenced.`}
          </p>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={addDay}
            className="px-3.5 py-2 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-wider uppercase rounded transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </button>
        )}
      </div>

      {days.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/15 rounded-lg bg-[#0e0e0e]/50 space-y-4">
          <Calendar className="w-10 h-10 text-white/20 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">
              No Days Defined
            </p>
            <p className="text-xs text-white/40 max-w-md mx-auto">
              Safari itineraries require at least one day before they can be published.
            </p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={addDay}
              className="px-4 py-2.5 bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac] hover:bg-[#c68642]/30 rounded text-xs font-mono tracking-wider uppercase transition-colors"
            >
              + Add Day 1
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {days.map((day, idx) => (
            <div
              key={`day-${idx}-${day.dayNumber}`}
              className="p-5 sm:p-6 rounded-lg bg-[#0e0e0e] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-sm"
            >
              {/* Day Header with Controls */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-[#1c160f] border border-[#c68642]/50 flex items-center justify-center font-serif-luxury text-[#ffdbac] text-xs font-semibold">
                    {day.dayNumber}
                  </span>
                  <span className="font-serif-luxury text-base text-white tracking-wide">
                    Day {day.dayNumber}
                  </span>
                </div>

                {!disabled && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveDay(idx, idx - 1)}
                      title="Move day earlier"
                      className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === days.length - 1}
                      onClick={() => moveDay(idx, idx + 1)}
                      title="Move day later"
                      className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/15 mx-1" />
                    <button
                      type="button"
                      onClick={() => removeDay(idx)}
                      title="Delete this day"
                      className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Day Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                    Day Title / Route Highlight
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    value={day.title || ""}
                    onChange={(e) => updateDay(idx, { title: e.target.value })}
                    placeholder="e.g. Arusha to Tarangire National Park — Land of Giants"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5 flex items-center gap-1">
                      <Hotel className="w-3 h-3 text-[#c68642]" />
                      Accommodation / Lodge
                    </label>
                    <input
                      type="text"
                      disabled={disabled}
                      value={day.accommodation || ""}
                      onChange={(e) => updateDay(idx, { accommodation: e.target.value })}
                      placeholder="e.g. Tarangire Treetops Lodge or Luxury Canvas Camp"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                      Activities (Press Enter after each)
                    </label>
                    <TagInput
                      disabled={disabled}
                      tags={day.activities || []}
                      onChange={(activities) => updateDay(idx, { activities })}
                      placeholder="e.g. Morning Game Drive, Bush Walk..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/60 mb-1.5">
                    Day Narrative & Wildlife Encounters
                  </label>
                  <textarea
                    rows={3}
                    disabled={disabled}
                    value={day.description || ""}
                    onChange={(e) => updateDay(idx, { description: e.target.value })}
                    placeholder="Details about the day's drive, scenic overlooks, picnic lunches in the wild, and animal encounters..."
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-colors leading-relaxed resize-y disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          ))}

          {!disabled && (
            <div className="pt-2">
              <button
                type="button"
                onClick={addDay}
                className="w-full py-3.5 border border-dashed border-[#c68642]/40 hover:border-[#c68642] bg-[#c68642]/5 hover:bg-[#c68642]/10 text-[#ffdbac] font-serif-luxury text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Day {days.length + 1}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
