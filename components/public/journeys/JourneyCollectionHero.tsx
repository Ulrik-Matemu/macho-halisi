"use client";

import { useRef } from "react";
import ExperienceMaskImage from "@/components/public/experiences/ExperienceMaskImage";
import { useScrollFrame } from "@/components/public/experiences/useScrollFrame";
import type { JourneyCollection } from "@/data/journeys";

type JourneyCollectionHeroProps = Pick<
  JourneyCollection,
  "line1" | "line2" | "eyebrow" | "lead" | "facts" | "caption" | "heroImage"
> & {
  /** e.g. "26" */
  count: string;
};

/**
 * Editorial split hero: title, lead and key facts on the left, a photo on
 * the right that unmasks on load and drifts down at 0.12x scroll (capped at
 * 90px). The drift only runs on desktop with motion allowed — see
 * useScrollFrame.
 */
export default function JourneyCollectionHero({
  line1,
  line2,
  eyebrow,
  lead,
  facts,
  caption,
  heroImage,
  count,
}: JourneyCollectionHeroProps) {
  const shiftRef = useRef<HTMLDivElement | null>(null);

  useScrollFrame((animate) => {
    const el = shiftRef.current;
    if (!el) return;
    el.style.transform = animate ? `translateY(${Math.min(window.scrollY * 0.12, 90).toFixed(1)}px)` : "";
  });

  return (
    <section className="max-w-[1340px] mx-auto px-6 sm:px-16 pt-12 sm:pt-[72px]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-stretch lg:min-h-[74vh]">
        <div className="flex flex-col justify-between pt-5 pb-1.5">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.44em] text-[#8A6A33] uppercase mb-[30px]">
              Journeys · {eyebrow}
            </div>
            <h1 className="m-0 mb-9 font-serif-luxury font-light text-[clamp(56px,8.4vw,138px)] leading-[0.92] tracking-[0.005em] text-[#1E1913]">
              {line1}
              <br />
              <em className="italic text-[#8A6A33]">{line2}</em>
            </h1>
            <p className="m-0 max-w-[520px] font-serif-luxury font-light text-[clamp(19px,1.7vw,23px)] leading-[1.62] text-[#1E1913]/80 text-pretty">
              {lead}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-x-12 gap-y-7 mt-14 pt-[26px] border-t border-[#1E1913]/[0.18]">
            <div>
              <div className="font-serif-luxury font-light text-[clamp(54px,5.6vw,84px)] leading-[0.9] text-[#1E1913]">
                {count}
              </div>
              <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase mt-2.5">
                Journeys
              </div>
            </div>
            {facts.map((f) => (
              <div key={f.label} className="pb-1">
                <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase mb-[9px]">
                  {f.label}
                </div>
                <div className="font-serif-luxury font-light text-xl tracking-[0.04em]">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[520px] overflow-hidden">
          <div ref={shiftRef} className="absolute inset-x-0 -inset-y-[6%] will-change-transform">
            <ExperienceMaskImage image={heroImage} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div className="absolute left-6 bottom-[22px] font-sans font-light text-[10.5px] tracking-[0.3em] text-[#FBF7F0] uppercase [text-shadow:0_1px_12px_rgba(18,14,10,.7)] pointer-events-none">
            {caption}
          </div>
        </div>
      </div>
    </section>
  );
}
