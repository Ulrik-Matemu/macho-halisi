"use client";

import { useRef, type ReactNode } from "react";
import { clamp01, useScrollFrame } from "./useScrollFrame";

interface ExperienceWordRevealProps {
  eyebrow: string;
  text: string;
  /** Rendered beneath the paragraph, inside the same section (the at-a-glance grid). */
  children?: ReactNode;
}

/**
 * The design's intro paragraph, which brightens word by word from 16% to
 * full opacity as the section scrolls up the viewport. Words sit at full
 * opacity by default (server render, below lg, reduced motion) — the dim
 * starting state is only applied once the scroll driver is active.
 */
export default function ExperienceWordReveal({ eyebrow, text, children }: ExperienceWordRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = text.split(" ");

  useScrollFrame((animate) => {
    const section = sectionRef.current;
    if (!section) return;
    const spans = wordRefs.current;

    if (!animate) {
      spans.forEach((el) => el && (el.style.opacity = ""));
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp01((vh * 0.82 - rect.top) / (rect.height * 0.55 + vh * 0.2));
    const n = spans.length;
    spans.forEach((el, i) => {
      if (el) el.style.opacity = (0.16 + 0.84 * clamp01(p * n * 1.1 - i)).toFixed(3);
    });
  });

  return (
    <section ref={sectionRef} className="max-w-[1160px] mx-auto px-6 sm:px-16 pt-24 sm:pt-36">
      <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-8">
        {eyebrow}
      </div>
      <p className="m-0 font-serif-luxury font-light text-[clamp(26px,3.5vw,52px)] leading-[1.36] tracking-[0.005em] text-safari-bark text-pretty">
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="transition-opacity duration-300 ease-out"
          >
            {word}{" "}
          </span>
        ))}
      </p>
      {children}
    </section>
  );
}
