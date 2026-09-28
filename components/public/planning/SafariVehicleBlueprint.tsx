"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Crosshair, Info, Shield, Radio, Wind, BatteryCharging } from "lucide-react";
import { VEHICLE_HOTSPOTS } from "@/data/planningData";

export default function SafariVehicleBlueprint() {
  const [selectedHotspot, setSelectedHotspot] = useState(VEHICLE_HOTSPOTS[0]);

  return (
    <section className="py-20 sm:py-28">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
          <Crosshair className="w-3.5 h-3.5 text-[#C9A46A]" />
          <span>Field Hardware</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] tracking-[0.04em] leading-tight">
          The Anatomy of a Macho Halisi 4x4
        </h2>
        <p className="text-sm sm:text-[15px] text-[#1E1913]/70 font-sans mt-3 max-w-2xl leading-relaxed">
          Our custom-stretched Toyota Land Cruisers are designed specifically for long optical lenses,
          maximum passenger suspension comfort, and absolute bush reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#1E1913] text-[#FBF7F0] p-6 sm:p-10 lg:p-12 shadow-xl border border-[#8A6A33]/30">
        {/* Interactive Hotspot Viewport */}
        <div className="lg:col-span-7 relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85"
              alt="Macho Halisi custom safari cruiser on the plains"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            {/* Hotspot Radar Pins */}
            {VEHICLE_HOTSPOTS.map((h) => {
              const isSelected = h.id === selectedHotspot.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHotspot(h)}
                  aria-label={h.title}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-transform duration-300 ${
                    isSelected ? "scale-125" : "hover:scale-110"
                  }`}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? "bg-[#E3C99A]" : "bg-white"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 items-center justify-center border text-[9px] font-mono font-bold ${
                        isSelected
                          ? "bg-[#8A6A33] border-[#E3C99A] text-white"
                          : "bg-[#1E1913] border-white/60 text-[#E3C99A]"
                      }`}
                    >
                      •
                    </span>
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-[#E3C99A] uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3.5 py-2 rounded border border-white/10">
              <span>Interactive Blueprint Mode</span>
              <span className="text-white/60">Tap any radar pin</span>
            </div>
          </div>

          {/* Quick Hotspot Button Strip */}
          <div className="flex flex-wrap gap-2 mt-4">
            {VEHICLE_HOTSPOTS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHotspot(h)}
                className={`text-[11px] font-sans px-3 py-1.5 rounded transition-all cursor-pointer ${
                  h.id === selectedHotspot.id
                    ? "bg-[#8A6A33] text-white font-medium"
                    : "bg-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                {h.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Hotspot Detail Panel */}
        <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 sm:p-8">
          <div className="inline-block px-2.5 py-1 bg-[#8A6A33]/20 border border-[#E3C99A]/40 rounded text-[10px] font-mono uppercase tracking-widest text-[#E3C99A]">
            {selectedHotspot.badge}
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light">
            {selectedHotspot.title}
          </h3>

          <div className="font-sans text-xs sm:text-sm text-[#E3C99A] tracking-wider uppercase">
            {selectedHotspot.shortDesc}
          </div>

          <p className="font-sans font-light text-sm sm:text-[15px] text-white/80 leading-relaxed">
            {selectedHotspot.fullDesc}
          </p>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-sans text-white/60">
            <div>
              <span className="block text-[#E3C99A] uppercase text-[10px] font-mono">
                Guarantee
              </span>
              100% Window Seat for every guest
            </div>
            <div>
              <span className="block text-[#E3C99A] uppercase text-[10px] font-mono">
                Power
              </span>
              Dual inverter onboard 230V
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
