"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Calendar } from "lucide-react";
import { WILDLIFE_SPECTACLES } from "@/data/seasonalData";

export default function WildlifeInterestFilter() {
  const [selectedId, setSelectedId] = useState(WILDLIFE_SPECTACLES[0].id);
  const current =
    WILDLIFE_SPECTACLES.find((w) => w.id === selectedId) ?? WILDLIFE_SPECTACLES[0];

  return (
    <section className="py-20 sm:py-28">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
          <Eye className="w-3.5 h-3.5 text-safari-gold" />
          <span>Intent-Driven Planning</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.04em] leading-tight">
          What Do You Yearn to See?
        </h2>
        <p className="text-sm sm:text-[15px] text-safari-bark/70 font-sans mt-3 max-w-2xl leading-relaxed">
          Select your bucket-list wildlife encounter to discover which months provide the highest
          probability of witnessing it in person.
        </p>
      </div>

      {/* Spectacle Chips */}
      <div className="flex flex-wrap gap-2.5 mb-10">
        {WILDLIFE_SPECTACLES.map((spec) => {
          const isSelected = spec.id === selectedId;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedId(spec.id)}
              className={`px-4 py-2.5 rounded text-xs sm:text-sm font-sans transition-all duration-300 border cursor-pointer ${
                isSelected
                  ? "bg-safari-bark text-safari-cream border-safari-bark shadow-md scale-105"
                  : "bg-white/70 hover:bg-white text-safari-bark border-safari-bark/10 hover:border-safari-russet/40"
              }`}
            >
              {spec.title}
            </button>
          );
        })}
      </div>

      {/* Selected Spectacle Detail Card */}
      <div className="bg-safari-bark text-safari-cream p-6 sm:p-10 lg:p-12 shadow-xl border border-safari-russet/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono text-safari-sand uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wildlife Focus</span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-white font-light">
              {current.title}
            </h3>

            <p className="font-serif-luxury italic text-base sm:text-lg text-safari-sand">
              &ldquo;{current.tagline}&rdquo;
            </p>

            <p className="font-sans font-light text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              {current.description}
            </p>

            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link
                href={`/destinations/${current.parkSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-safari-russet hover:bg-safari-russet text-white text-xs font-sans tracking-widest uppercase rounded transition-colors"
              >
                <span>Explore {current.primaryPark}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/enquire?destination=${encodeURIComponent(current.primaryPark)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-sans tracking-widest uppercase rounded border border-white/10 transition-colors"
              >
                <span>Inquire About This Season</span>
              </Link>
            </div>
          </div>

          {/* Prime Months Grid */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-safari-sand uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Optimal Travel Window</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => {
                const isPrime = current.primeMonths.includes(m);
                return (
                  <div
                    key={m}
                    className={`py-2 text-center rounded text-xs font-mono transition-colors ${
                      isPrime
                        ? "bg-safari-russet text-white font-bold shadow"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {m}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-sans text-white/60 text-center">
              Gold boxes highlight peak viewing probability in Tanzania.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
