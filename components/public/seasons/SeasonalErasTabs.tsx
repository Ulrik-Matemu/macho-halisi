"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, AlertCircle, Compass, Lightbulb } from "lucide-react";
import { SEASONAL_ERAS } from "@/data/seasonalData";

export default function SeasonalErasTabs() {
  const [activeEraIdx, setActiveEraIdx] = useState(0);

  return (
    <section className="py-20 sm:py-28 border-b border-safari-bark/10">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
          <Compass className="w-3.5 h-3.5 text-safari-gold" />
          <span>The Three Great Chapters</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.04em] leading-tight">
          Tanzania Across the Primary Eras
        </h2>
        <p className="text-sm sm:text-[15px] text-safari-bark/70 font-sans mt-3 leading-relaxed">
          Rather than simple four-season calendars, safari travel is shaped by three distinct wilderness
          cycles.
        </p>
      </div>

      {/* Era Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div role="tablist" aria-label="Safari seasons" className="inline-flex p-1.5 bg-[#EAE4D7] border border-safari-bark/10 gap-1 flex-wrap justify-center">
          {SEASONAL_ERAS.map((e, idx) => {
            const isActive = idx === activeEraIdx;
            return (
              <button
                key={e.id}
                type="button"
                role="tab"
                id={`era-tab-${e.id}`}
                aria-selected={isActive}
                aria-controls={`era-panel-${e.id}`}
                onClick={() => setActiveEraIdx(idx)}
                className={`px-5 py-2.5 rounded font-sans text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-safari-bark text-safari-cream shadow-sm font-medium"
                    : "text-safari-bark/70 hover:text-safari-bark hover:bg-white/40"
                }`}
              >
                {e.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Every era is in the HTML (crawlers and AI read all three); only the
          selected one is shown. */}
      {SEASONAL_ERAS.map((era, idx) => (
      <div
        key={era.id}
        role="tabpanel"
        id={`era-panel-${era.id}`}
        aria-labelledby={`era-tab-${era.id}`}
        hidden={idx !== activeEraIdx}
        className="bg-white/80 border border-safari-bark/10 p-6 sm:p-10 lg:p-12 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden shadow-md border border-safari-bark/10 bg-safari-champagne">
              <Image
                src={era.image.url}
                alt={era.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-safari-sand block mb-1">
                  {era.monthsSpan}
                </span>
                <span className="font-serif-luxury text-xl font-light leading-snug">
                  {era.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-safari-russet">
                {era.monthsSpan}
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-safari-bark mt-1">
                {era.title}
              </h3>
              <p className="font-serif-luxury italic text-base text-safari-russet mt-1">
                {era.subtitle}
              </p>
            </div>

            <p className="font-sans font-light text-[15px] sm:text-base text-safari-bark/80 leading-relaxed">
              {era.narrative}
            </p>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                <div className="font-sans font-medium text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Why Travel in this Era
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-950/80 font-sans">
                  {era.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="font-sans font-medium text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Considerations
                </div>
                <ul className="space-y-1.5 text-xs text-amber-950/80 font-sans">
                  {era.cons.map((con) => (
                    <li key={con} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Naturalist Secret */}
            <div className="flex items-start gap-3 p-4 bg-safari-cream border border-safari-russet/30">
              <Lightbulb className="w-5 h-5 text-safari-russet shrink-0 mt-0.5" />
              <div>
                <div className="font-sans font-medium text-xs text-safari-bark uppercase tracking-wider">
                  Macho Halisi Field Advice:
                </div>
                <div className="font-sans font-light text-xs sm:text-sm text-safari-bark/80 mt-0.5">
                  {era.insiderSecret}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ))}
    </section>
  );
}
