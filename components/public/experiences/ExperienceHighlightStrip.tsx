"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { ExperienceHighlight } from "@/data/experiences";
import { clamp01, useScrollFrame } from "./useScrollFrame";

interface ExperienceHighlightStripProps {
  highlights: ExperienceHighlight[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "What sets it apart" — on desktop with motion, a tall section whose
 * sticky viewport slides a horizontal track sideways as the visitor scrolls
 * down, with an "01 / 03" counter and progress line pinned to the bottom.
 * Everywhere else (the `scrub:` variant off) it's a plain vertical stack.
 */
export default function ExperienceHighlightStrip({ highlights }: ExperienceHighlightStripProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const n = highlights.length;

  useScrollFrame((animate) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    if (!animate) {
      track.style.transform = "";
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp01(-rect.top / Math.max(1, rect.height - vh));
    const max = Math.max(0, track.scrollWidth - window.innerWidth);
    track.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;

    const active = Math.min(n, Math.max(1, Math.ceil(p * (n + 1) - 0.5)));
    if (counterRef.current) counterRef.current.textContent = `${pad(active)} / ${pad(n)}`;
    if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(2)}%`;
  });

  return (
    <section
      ref={sectionRef}
      className="relative mt-24 sm:mt-36 scrub:h-[var(--strip-h)]"
      style={{ "--strip-h": `${100 + n * 90}vh` } as CSSProperties}
    >
      <div className="scrub:sticky scrub:top-0 scrub:h-screen scrub:overflow-hidden flex flex-col justify-center">
        <div
          ref={trackRef}
          className="flex flex-col gap-16 px-6 sm:px-16 max-w-[1240px] mx-auto scrub:max-w-none scrub:mx-0 scrub:flex-row scrub:items-center scrub:gap-[72px] scrub:w-max scrub:will-change-transform"
        >
          <div className="scrub:w-[min(34vw,440px)] flex-none">
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-5">
              What sets it apart
            </div>
            <h2 className="m-0 mb-7 font-serif-luxury font-light text-[clamp(36px,4.6vw,66px)] leading-[1.02] tracking-[0.02em] text-safari-bark">
              Three things you
              <br />
              <em>will not forget</em>
            </h2>
            <p className="hidden scrub:block m-0 font-sans font-light text-[15px] leading-[2] text-safari-bark/68 max-w-[360px]">
              Keep scrolling — the page moves sideways through each one.
            </p>
          </div>

          {highlights.map((h, i) => (
            <article
              key={h.title}
              className="flex-none grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] sm:gap-12 sm:items-end scrub:w-[min(66vw,900px)]"
            >
              <div className="relative h-[52vh] sm:h-[min(62vh,560px)] overflow-hidden bg-safari-champagne">
                <Image
                  src={h.image.url}
                  alt={h.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
              </div>
              <div className="sm:pb-2.5">
                <div className="font-serif-luxury font-light text-[clamp(56px,6vw,96px)] leading-none text-safari-gold mb-5">
                  {pad(i + 1)}
                </div>
                <h3 className="m-0 mb-4 font-serif-luxury font-light text-[clamp(26px,2.5vw,36px)] leading-[1.16] tracking-[0.03em] text-safari-bark">
                  {h.title}
                </h3>
                <p className="m-0 font-sans font-light text-[15px] leading-[2] text-safari-bark/68">{h.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden scrub:flex absolute left-16 right-16 bottom-11 items-center gap-6" aria-hidden>
          <span
            ref={counterRef}
            className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark whitespace-nowrap"
          >
            {`01 / ${pad(n)}`}
          </span>
          <span className="flex-1 h-px bg-safari-bark/16 relative">
            <span ref={barRef} className="absolute left-0 top-0 h-px bg-safari-russet" style={{ width: 0 }} />
          </span>
        </div>
      </div>
    </section>
  );
}
