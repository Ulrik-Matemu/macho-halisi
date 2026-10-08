"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronRight, Compass } from "lucide-react";
import { PLANNING_STAGES } from "@/data/planningData";

export default function PlanStagesRail() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="py-20 sm:py-28 border-b border-safari-bark/10">
      <div className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
          <Compass className="w-3.5 h-3.5 text-safari-gold" />
          <span>The Five Chapters</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.04em] leading-tight">
          How a Safari Takes Form
        </h2>
        <p className="text-sm sm:text-[15px] text-safari-bark/70 font-sans mt-3 max-w-2xl leading-relaxed">
          From an unhurried conversation in Karatu to tracking prides at dawn. Explore how we architect
          each journey from the ground up.
        </p>
      </div>

      {/* Stage Selector Buttons / Horizontal Progress Bar */}
      <div role="tablist" aria-label="Planning stages" className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
        {PLANNING_STAGES.map((s, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={s.number}
              type="button"
              role="tab"
              id={`stage-tab-${s.number}`}
              aria-selected={isActive}
              aria-controls={`stage-panel-${s.number}`}
              onClick={() => setActiveStage(idx)}
              className={`p-4 text-left transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-safari-bark text-safari-cream border-safari-bark shadow-md"
                  : "bg-white/60 hover:bg-white text-safari-bark border-safari-bark/10 hover:border-safari-russet/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-xs ${
                    isActive ? "text-safari-sand" : "text-safari-russet"
                  }`}
                >
                  Stage {s.number}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-safari-sand" />}
              </div>
              <div className="font-serif-luxury font-light text-sm sm:text-base leading-snug line-clamp-1">
                {s.stepName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Every stage is in the HTML (crawlers and AI read all five); only the
          selected one is shown. */}
      {PLANNING_STAGES.map((stage, idx) => (
      <div
        key={stage.number}
        role="tabpanel"
        id={`stage-panel-${stage.number}`}
        aria-labelledby={`stage-tab-${stage.number}`}
        hidden={idx !== activeStage}
        className="bg-white/70 border border-safari-bark/10 p-6 sm:p-10 lg:p-12 shadow-sm transition-all duration-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-safari-russet px-2.5 py-1 bg-safari-russet/10 rounded">
                Stage {stage.number} · {stage.stepName}
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-safari-bark leading-snug">
              {stage.headline}
            </h3>

            <p className="font-serif-luxury text-lg italic text-safari-russet leading-relaxed">
              &ldquo;{stage.lead}&rdquo;
            </p>

            <p className="font-sans font-light text-[15px] sm:text-base text-safari-bark/80 leading-relaxed">
              {stage.description}
            </p>

            {/* Deliverable Pill */}
            <div className="flex items-start gap-3 p-4 bg-safari-cream border border-safari-russet/20">
              <CheckCircle2 className="w-5 h-5 text-safari-russet shrink-0 mt-0.5" />
              <div>
                <div className="font-sans font-medium text-xs text-safari-bark uppercase tracking-wider">
                  Tangible Deliverable:
                </div>
                <div className="font-sans font-light text-sm text-safari-bark/80">
                  {stage.deliverable}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="pt-2 border-t border-safari-bark/10">
              <p className="font-serif-luxury italic text-sm text-safari-bark/70">
                &ldquo;{stage.quote}&rdquo;
              </p>
              <span className="font-sans text-[11px] text-safari-russet uppercase tracking-widest block mt-1">
                — {stage.author}
              </span>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden shadow-lg border border-safari-bark/10 bg-safari-champagne">
              <Image
                src={stage.image.url}
                alt={stage.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-safari-sand block mb-1">
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
      ))}
    </section>
  );
}
