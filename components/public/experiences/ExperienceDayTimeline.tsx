"use client";

import { useRef } from "react";
import type { ExperienceDayEntry } from "@/data/experiences";
import { clamp01, useScrollFrame } from "./useScrollFrame";

interface ExperienceDayTimelineProps {
  day: ExperienceDayEntry[];
}

/**
 * "The shape of a day" — a sticky intro with a large clock beside a
 * vertical rail. As the section scrolls through, a gold line fills the
 * rail, each entry lights up in turn and the clock shows the latest lit
 * entry's time. Entries render lit by default (`data-on`), so the server
 * render, small screens and reduced motion get a plain readable list.
 */
export default function ExperienceDayTimeline({ day }: ExperienceDayTimelineProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const clockRef = useRef<HTMLDivElement | null>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const n = day.length;

  useScrollFrame((animate) => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    if (!section || !fill) return;
    const entries = entryRefs.current;

    if (!animate) {
      fill.style.height = "";
      entries.forEach((el) => el && (el.dataset.on = "true"));
      return;
    }

    const rect = section.getBoundingClientRect();
    const p = clamp01((window.innerHeight * 0.55 - rect.top) / Math.max(1, rect.height - 120));
    const active = Math.min(n - 1, Math.floor(p * n));
    fill.style.height = `${(p * 100).toFixed(2)}%`;
    entries.forEach((el, i) => {
      if (el) el.dataset.on = String(i <= active && p > 0.01);
    });
    if (clockRef.current) clockRef.current.textContent = day[Math.max(0, active)].time;
  });

  return (
    <section ref={sectionRef} className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-14 lg:gap-24 items-start">
        <div className="scrub:sticky scrub:top-[120px]">
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-5">
            Hour by hour
          </div>
          <h2 className="m-0 mb-6 font-serif-luxury font-light text-[clamp(36px,4vw,56px)] leading-[1.04] tracking-[0.02em] text-safari-bark">
            The shape
            <br />
            <em>of a day</em>
          </h2>
          <p className="m-0 font-sans font-light text-[15px] leading-[2] text-safari-bark/68 max-w-[360px] scrub:mb-10">
            An indicative day. Your guide adjusts every hour of it to the light, the weather and the animals.
          </p>
          <div
            ref={clockRef}
            aria-hidden
            className="hidden scrub:block font-serif-luxury font-light text-[clamp(64px,7vw,108px)] leading-none tracking-[0.02em] text-safari-bark tabular-nums"
          >
            {day[0]?.time}
          </div>
        </div>

        <div className="relative pl-10 sm:pl-14">
          <span className="absolute left-0 top-2.5 bottom-2.5 w-px bg-safari-bark/16" />
          <span
            ref={fillRef}
            className="absolute left-0 top-2.5 w-px bg-safari-russet h-[calc(100%-20px)] scrub:h-0"
          />
          {day.map((d, i) => (
            <div
              key={d.time}
              ref={(el) => {
                entryRefs.current[i] = el;
              }}
              data-on="true"
              className="group relative pb-16 sm:pb-[88px] last:pb-0"
            >
              <span className="absolute -left-[44px] sm:-left-[60px] top-3.5 w-[9px] h-[9px] rounded-full bg-safari-russet group-data-[on=false]:bg-safari-bark/20 transition-colors duration-500" />
              <div className="font-sans font-light text-xs tracking-[0.3em] uppercase mb-3.5 text-safari-russet group-data-[on=false]:text-safari-bark/40 transition-colors duration-500">
                {d.time}
              </div>
              <h3 className="m-0 mb-3.5 font-serif-luxury font-light text-[clamp(26px,2.6vw,36px)] leading-[1.16] tracking-[0.03em] text-safari-bark group-data-[on=false]:text-safari-bark/34 transition-colors duration-500">
                {d.title}
              </h3>
              <p className="m-0 font-sans font-light text-[15px] leading-[2] max-w-[520px] text-safari-bark/68 group-data-[on=false]:text-safari-bark/30 transition-colors duration-500">
                {d.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
