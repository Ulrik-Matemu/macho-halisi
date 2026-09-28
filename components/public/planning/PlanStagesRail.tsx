"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronRight, Compass } from "lucide-react";
import { PLANNING_STAGES } from "@/data/planningData";

export default function PlanStagesRail() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = PLANNING_STAGES[activeStage];

  return (
    <section className="py-20 sm:py-28 border-b border-[#1E1913]/10">
      <div className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
          <Compass className="w-3.5 h-3.5 text-[#C9A46A]" />
          <span>The Five Chapters</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] tracking-[0.04em] leading-tight">
          How a Safari Takes Form
        </h2>
        <p className="text-sm sm:text-[15px] text-[#1E1913]/70 font-sans mt-3 max-w-2xl leading-relaxed">
          From an unhurried conversation in Karatu to tracking prides at dawn. Explore how we architect
          each journey from the ground up.
        </p>
      </div>

      {/* Stage Selector Buttons / Horizontal Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
        {PLANNING_STAGES.map((s, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`p-4 text-left transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-[#1E1913] text-[#FBF7F0] border-[#1E1913] shadow-md"
                  : "bg-white/60 hover:bg-white text-[#1E1913] border-[#1E1913]/10 hover:border-[#8A6A33]/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-xs ${
                    isActive ? "text-[#E3C99A]" : "text-[#8A6A33]"
                  }`}
                >
                  Stage {s.number}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#E3C99A]" />}
              </div>
              <div className="font-serif-luxury font-light text-sm sm:text-base leading-snug line-clamp-1">
                {s.stepName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Editorial Card */}
      <div className="bg-white/70 border border-[#1E1913]/10 p-6 sm:p-10 lg:p-12 shadow-sm transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#8A6A33] px-2.5 py-1 bg-[#8A6A33]/10 rounded">
                Stage {stage.number} · {stage.stepName}
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-[#1E1913] leading-snug">
              {stage.headline}
            </h3>

            <p className="font-serif-luxury text-lg italic text-[#8A6A33] leading-relaxed">
              &ldquo;{stage.lead}&rdquo;
            </p>

            <p className="font-sans font-light text-[15px] sm:text-base text-[#1E1913]/80 leading-relaxed">
              {stage.description}
            </p>

            {/* Deliverable Pill */}
            <div className="flex items-start gap-3 p-4 bg-[#F6F2EA] border border-[#8A6A33]/20">
              <CheckCircle2 className="w-5 h-5 text-[#8A6A33] shrink-0 mt-0.5" />
              <div>
                <div className="font-sans font-medium text-xs text-[#1E1913] uppercase tracking-wider">
                  Tangible Deliverable:
                </div>
                <div className="font-sans font-light text-sm text-[#1E1913]/80">
                  {stage.deliverable}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="pt-2 border-t border-[#1E1913]/10">
              <p className="font-serif-luxury italic text-sm text-[#1E1913]/70">
                &ldquo;{stage.quote}&rdquo;
              </p>
              <span className="font-sans text-[11px] text-[#8A6A33] uppercase tracking-widest block mt-1">
                — {stage.author}
              </span>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden shadow-lg border border-[#1E1913]/10 bg-[#E7DFD1]">
              <Image
                src={stage.image.url}
                alt={stage.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E3C99A] block mb-1">
                  Macho Halisi Blueprint
                </span>
                <span className="font-serif-luxury text-sm leading-snug line-clamp-2">
                  {stage.image.alt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
