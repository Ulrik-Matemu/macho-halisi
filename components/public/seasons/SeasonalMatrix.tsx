"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CloudRain,
  Sun,
  Thermometer,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { MONTHS_DATA, MonthData } from "@/data/seasonalData";

export default function SeasonalMatrix() {
  const [selectedIdx, setSelectedIdx] = useState(6); // Default to July (Peak season)
  const current = MONTHS_DATA[selectedIdx];

  const getRainIcon = (rainfall: MonthData["rainfall"]) => {
    switch (rainfall) {
      case "minimal":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "moderate":
      case "short-rains":
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case "high":
        return <CloudRain className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section className="py-20 sm:py-28 border-b border-[#1E1913]/10">
      <div className="mb-10 sm:mb-14">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#C9A46A]" />
          <span>The Living Calendar</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] tracking-[0.04em] leading-tight">
          12 Months in the Tanzanian Wild
        </h2>
        <p className="text-sm sm:text-[15px] text-[#1E1913]/70 font-sans mt-3 max-w-2xl leading-relaxed">
          Select any month to reveal where the Great Migration herds are grazing, rainfall and temperature
          conditions, and which wilderness areas peak at that moment.
        </p>
      </div>

      {/* 12-Month Horizontal Scrubber Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2 mb-10">
        {MONTHS_DATA.map((m, idx) => {
          const isActive = idx === selectedIdx;
          return (
            <button
              key={m.month}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`p-3 flex flex-col items-center gap-1.5 transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-[#1E1913] text-[#FBF7F0] border-[#1E1913] shadow-md scale-105"
                  : "bg-white/60 hover:bg-white text-[#1E1913] border-[#1E1913]/10"
              }`}
            >
              <span
                className={`font-mono text-xs uppercase font-medium ${
                  isActive ? "text-[#E3C99A]" : "text-[#8A6A33]"
                }`}
              >
                {m.short}
              </span>
              <span className="text-[10px] font-sans opacity-70">
                {m.tempDayC}°C
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-[#E3C99A]" : "bg-[#1E1913]/20"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Selected Month Dashboard Card */}
      <div className="bg-[#1E1913] text-[#FBF7F0] p-6 sm:p-10 lg:p-12 shadow-xl border border-[#8A6A33]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-[#8A6A33]/30 border border-[#E3C99A]/40 rounded text-[11px] font-mono uppercase tracking-widest text-[#E3C99A]">
                {current.month}
              </span>
              <span className="font-serif-luxury italic text-sm text-[#FBF7F0]/80">
                {current.seasonLabel}
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-white font-light leading-snug">
              {current.keyHighlight}
            </h3>

            <p className="font-sans font-light text-sm sm:text-base text-white/80 leading-relaxed">
              {current.description}
            </p>

            {/* Migration Position Callout */}
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#E3C99A]">
                <Compass className="w-3.5 h-3.5 text-[#E3C99A]" />
                <span>Great Migration Location:</span>
              </div>
              <div className="font-serif-luxury text-lg text-white">
                {current.migrationLocation}
              </div>
            </div>

            {/* Best For Tags */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#E3C99A] mb-2">
                Prime Wildlife Focus:
              </div>
              <div className="flex flex-wrap gap-2">
                {current.bestFor.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-sans px-3 py-1 bg-white/10 text-white/90 rounded border border-white/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Gauges & Recommended Parks */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E3C99A] mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Temperature</span>
                </div>
                <div className="font-serif-luxury text-2xl text-white">
                  {current.tempDayC}°C <span className="text-xs text-white/50">/ {current.tempNightC}°C</span>
                </div>
                <div className="text-[10px] font-sans text-white/60">Day high / Night low</div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E3C99A] mb-1">
                  {getRainIcon(current.rainfall)}
                  <span className="capitalize">{current.rainfall} Rain</span>
                </div>
                <div className="font-serif-luxury text-2xl text-white capitalize">
                  {current.rainfall === "minimal" ? "Dry Bush" : "Lush Green"}
                </div>
                <div className="text-[10px] font-sans text-white/60">Seasonal moisture</div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E3C99A] mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Crowd Density</span>
                </div>
                <div className="font-serif-luxury text-xl text-white capitalize">
                  {current.crowdLevel}
                </div>
                <div className="text-[10px] font-sans text-white/60">Vehicle presence</div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E3C99A] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Value Index</span>
                </div>
                <div className="font-serif-luxury text-xl text-white capitalize">
                  {current.valueRating}
                </div>
                <div className="text-[10px] font-sans text-white/60">Lodge rates tier</div>
              </div>
            </div>

            {/* Recommended Destinations This Month */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#E3C99A]">
                Recommended Parks in {current.month}:
              </div>
              <div className="space-y-2">
                {current.recommendedParks.map((p) => (
                  <Link
                    key={p.name}
                    href={`/destinations/${p.slug}`}
                    className="group flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#8A6A33]/40 transition-colors"
                  >
                    <div>
                      <div className="font-serif-luxury text-sm text-white group-hover:text-[#E3C99A] transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[11px] font-sans text-white/60">{p.reason}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E3C99A] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
