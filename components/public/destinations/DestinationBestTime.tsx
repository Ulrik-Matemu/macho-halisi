"use client";

import { useState } from "react";
import type { DestinationBestTimeEntry } from "@/data/destinations";

interface DestinationBestTimeProps {
  months: DestinationBestTimeEntry[];
}

const RATING_LABEL: Record<DestinationBestTimeEntry["rating"], string> = {
  low: "Low season",
  good: "Good",
  peak: "Peak",
};

const RATING_HEIGHT: Record<DestinationBestTimeEntry["rating"], string> = {
  low: "h-[30%]",
  good: "h-[65%]",
  peak: "h-full",
};

/**
 * Interactive month-by-month strip — click/tap a month to reveal its note
 * below, with a small intensity bar per month as an at-a-glance visual.
 * The site has no existing interactive-strip component to copy; this is
 * new but follows the established eyebrow/serif typography conventions.
 */
export default function DestinationBestTime({ months }: DestinationBestTimeProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = months[activeIdx];

  return (
    <div>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2 mb-8">
        {months.map((entry, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={entry.month}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-pressed={isActive}
              className={`group flex flex-col items-center gap-2 pt-3 pb-2 rounded transition-colors cursor-pointer ${
                isActive ? "bg-safari-bark" : "bg-safari-bark/[0.05] hover:bg-safari-bark/10"
              }`}
            >
              <div className="h-10 w-2.5 rounded-full bg-safari-bark/10 flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-full transition-all ${RATING_HEIGHT[entry.rating]} ${
                    isActive ? "bg-safari-sand" : "bg-safari-gold"
                  }`}
                />
              </div>
              <span
                className={`font-sans font-light text-[10px] tracking-[0.1em] uppercase ${
                  isActive ? "text-safari-cream" : "text-safari-bark/70"
                }`}
              >
                {entry.month}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="border-t border-safari-bark/[0.14] pt-6">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-serif-luxury font-light text-2xl tracking-[0.04em] text-safari-bark">
              {active.month}
            </span>
            <span className="font-sans font-light text-[10px] tracking-[0.25em] text-safari-russet uppercase">
              {RATING_LABEL[active.rating]}
            </span>
          </div>
          <p className="font-sans font-light text-[15px] leading-[1.9] text-safari-bark/72 max-w-xl">
            {active.note}
          </p>
        </div>
      )}
    </div>
  );
}
