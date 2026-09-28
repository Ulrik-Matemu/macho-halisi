"use client";

import React, { useState } from "react";
import { Check, X, Sparkles, Scale } from "lucide-react";
import { PLANNING_COMPARISONS } from "@/data/planningData";

export default function PlanningComparison() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-20 sm:py-28 border-b border-[#1E1913]/10">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
          <Scale className="w-3.5 h-3.5 text-[#C9A46A]" />
          <span>The Real Distinction</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] tracking-[0.04em] leading-tight">
          Commercial Package vs. Bespoke Architecture
        </h2>
        <p className="text-sm sm:text-[15px] text-[#1E1913]/70 font-sans mt-3 leading-relaxed">
          Why two journeys with the same national park names on paper deliver profoundly different
          safari memories.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {/* Commercial Tour Column */}
        <div className="bg-[#EAE4D7]/70 border border-[#1E1913]/15 p-6 sm:p-8 relative">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1E1913]/10">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <X className="w-4 h-4" />
            </div>
            <div>
              <div className="font-sans text-[11px] uppercase tracking-wider text-[#1E1913]/60 font-medium">
                Standard Industry Norm
              </div>
              <div className="font-serif-luxury text-lg text-[#1E1913]">
                Commercial Group Itinerary
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {PLANNING_COMPARISONS.map((item, idx) => (
              <div key={item.title} className="text-xs sm:text-sm text-[#1E1913]/75 space-y-1.5">
                <span className="font-medium text-[#1E1913] block font-sans uppercase tracking-wider text-[10px]">
                  {item.title}
                </span>
                <p className="leading-relaxed font-sans">{item.commercialTour}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Macho Halisi Column */}
        <div className="bg-[#1E1913] text-[#FBF7F0] border border-[#8A6A33]/40 p-6 sm:p-8 relative shadow-xl">
          <div className="absolute top-4 right-4 bg-[#8A6A33]/30 border border-[#E3C99A]/40 text-[#E3C99A] text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded">
            Native Tailored
          </div>

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#8A6A33]/30 flex items-center justify-center text-[#E3C99A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-sans text-[11px] uppercase tracking-wider text-[#E3C99A] font-medium">
                The Macho Halisi Standard
              </div>
              <div className="font-serif-luxury text-lg text-[#FBF7F0]">
                Private Bespoke Expedition
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {PLANNING_COMPARISONS.map((item) => (
              <div key={item.title} className="text-xs sm:text-sm text-white/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#E3C99A] font-sans uppercase tracking-wider text-[10px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {item.highlight}
                  </span>
                </div>
                <p className="leading-relaxed font-sans font-light text-[#FBF7F0]/90">
                  {item.machoHalisi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
