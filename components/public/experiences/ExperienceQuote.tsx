"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ExperienceImage } from "@/data/experiences";
import { clamp01, useScrollFrame } from "./useScrollFrame";

interface ExperienceQuoteProps {
  quote: string;
  quoteBy: string;
  image: ExperienceImage;
}

/**
 * Full-bleed mood image behind a guide's quote. The photo settles from
 * 1.16x to 1x across the whole time the band is on screen.
 */
export default function ExperienceQuote({ quote, quoteBy, image }: ExperienceQuoteProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);

  useScrollFrame((animate) => {
    const section = sectionRef.current;
    const scale = scaleRef.current;
    if (!section || !scale) return;

    if (!animate) {
      scale.style.scale = "";
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp01((vh - rect.top) / (rect.height + vh));
    scale.style.scale = (1.16 - 0.16 * p).toFixed(4);
  });

  return (
    <section ref={sectionRef} className="relative mt-16 h-[72vh] sm:h-[88vh] min-h-[480px] sm:min-h-[540px] overflow-hidden">
      <div ref={scaleRef} className="absolute inset-0 scrub:scale-[1.16] scrub:will-change-transform">
        <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-[#120E0A]/[0.42] pointer-events-none" />
      <figure className="absolute inset-0 m-0 flex flex-col items-center justify-center px-6 sm:px-16 text-center pointer-events-none">
        <blockquote className="m-0 mb-6 max-w-[960px] font-serif-luxury font-light italic text-[clamp(26px,3.4vw,50px)] leading-[1.42] text-safari-cream text-balance">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="font-sans font-light text-[10.5px] tracking-[0.34em] text-safari-sand uppercase">
          {quoteBy}
        </figcaption>
      </figure>
    </section>
  );
}
