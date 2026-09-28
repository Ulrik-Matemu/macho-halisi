"use client";

import { useRef } from "react";
import Image from "next/image";
import { clamp01, easeInOut, useScrollFrame } from "./useScrollFrame";

interface ExperienceHeroProps {
  image: string;
  imageAlt: string;
  badge: string;
  line1: string;
  /** Italic second line; omitted for single-line titles. */
  line2?: string;
  tagline: string;
  /** e.g. "01 / 05" */
  counter: string;
  /** Top-right running label, before the counter. */
  label?: string;
}

/**
 * The design's "opening" hero: a 230vh section whose sticky viewport holds
 * a cream title card with the photo clipped to a small window in its
 * centre. Scrolling through the section opens the clip to full bleed while
 * the photo settles from 1.18x to 1x and the shade deepens. Below lg and
 * under reduced motion the section collapses to a plain 100svh full-bleed
 * hero (CSS only — the clip/scale classes are desktop-motion variants).
 */
export default function ExperienceHero({
  image,
  imageAlt,
  badge,
  line1,
  line2,
  tagline,
  counter,
  label = "Safari Experiences",
}: ExperienceHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const clipRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cueRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame((animate) => {
    const section = sectionRef.current;
    const clip = clipRef.current;
    const scale = scaleRef.current;
    const shade = shadeRef.current;
    if (!section || !clip || !scale || !shade) return;

    if (!animate) {
      clip.style.clipPath = "";
      scale.style.scale = "";
      shade.style.opacity = "";
      titleRefs.current.forEach((el) => el && (el.style.transform = ""));
      cueRefs.current.forEach((el) => el && (el.style.opacity = ""));
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp01(-rect.top / Math.max(1, rect.height - vh));
    const hp = easeInOut(Math.min(1, p / 0.85));

    const insetY = (22 * (1 - hp)).toFixed(2);
    const insetX = (31 * (1 - hp)).toFixed(2);
    clip.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
    scale.style.scale = (1.18 - 0.18 * hp).toFixed(4);
    shade.style.opacity = (0.12 + 0.3 * hp).toFixed(3);
    const titleY = `translateY(${(-hp * 30).toFixed(1)}px)`;
    titleRefs.current.forEach((el) => el && (el.style.transform = titleY));
    const cue = Math.max(0, 1 - p * 5).toFixed(2);
    cueRefs.current.forEach((el) => el && (el.style.opacity = cue));
  });

  const layer = (tone: "cream" | "photo") => {
    const onPhoto = tone === "photo";
    const idx = onPhoto ? 1 : 0;
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12">
        <div
          className={`absolute top-28 sm:top-32 left-6 right-6 sm:left-12 sm:right-12 flex justify-between font-sans font-light text-[10px] sm:text-[10.5px] tracking-[0.32em] uppercase ${
            onPhoto ? "text-[#FBF7F0]" : "text-[#1E1913]"
          }`}
        >
          <span>Macho Halisi</span>
          <span>{label} · {counter}</span>
        </div>
        <div
          ref={(el) => {
            titleRefs.current[idx] = el;
          }}
        >
          <div
            className={`font-sans font-light text-[11px] tracking-[0.46em] uppercase mb-7 ${
              onPhoto ? "text-[#E3C99A]" : "text-[#8A6A33]"
            }`}
          >
            {badge}
          </div>
          {(() => {
            const Heading = onPhoto ? "div" : "h1";
            return (
              <Heading
                aria-hidden={onPhoto || undefined}
                className={`m-0 font-serif-luxury font-light text-[clamp(44px,9vw,150px)] leading-[0.94] tracking-[0.01em] ${
                  onPhoto ? "text-[#FBF7F0]" : "text-[#1E1913]"
                }`}
              >
                {line1}
                {line2 && (
                  <>
                    <br />
                    <em className="italic font-light">{line2}</em>
                  </>
                )}
              </Heading>
            );
          })()}
          <p
            className={`mt-8 mx-auto max-w-[520px] font-sans font-light text-[11px] sm:text-xs tracking-[0.34em] uppercase ${
              onPhoto ? "text-[#FBF7F0]/90" : "text-[#1E1913]/72"
            }`}
            aria-hidden={onPhoto || undefined}
          >
            {tagline}
          </p>
        </div>
       
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      data-exp-hero
      className="relative h-[100svh] scrub:h-[230vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#F6F2EA]">
        {layer("cream")}

        <div
          ref={clipRef}
          className="absolute inset-0 scrub:will-change-[clip-path] scrub:[clip-path:inset(22%_31%_22%_31%)]"
        >
          <div
            ref={scaleRef}
            className="absolute inset-0 scrub:scale-[1.18]"
          >
            <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
          </div>
          <div
            ref={shadeRef}
            className="absolute inset-0 bg-[#120E0A] opacity-[0.42] scrub:opacity-[0.12]"
          />
          {layer("photo")}
        </div>
      </div>
    </section>
  );
}
