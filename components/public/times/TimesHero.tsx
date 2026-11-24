"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TIMES_HERO_FILM } from "@/data/timesData";

const WORD = "TIMES";

/**
 * The masthead: a muted film behind one word. Scrolling lifts the film away
 * slowly while the word drifts up, swells and fades.
 */
export default function TimesHero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const title = titleRef.current;
    const media = mediaRef.current;
    if (!title || !media) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const y = Math.min(window.scrollY, vh * 1.2);
      const p = Math.min(1, y / (vh * 0.8));
      title.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0) scale(${(1 + p * 0.1).toFixed(4)})`;
      title.style.opacity = String(Math.max(0, 1 - p * 1.25));
      media.style.transform = `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  // Decorative and there is a lot of video below: stop it once out of view.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reduced || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section ref={sectionRef} data-navbar-hero className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-black">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 animate-times-pushin">
          <Image src={TIMES_HERO_FILM.poster} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          {!reduced && (
            <video
              ref={videoRef}
              src={TIMES_HERO_FILM.src}
              poster={TIMES_HERO_FILM.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/45" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div ref={titleRef} className="text-center will-change-transform">
          <h1 className="text-safari-cream">
            <span className="sr-only">Macho Halisi Times</span>
            <span
              aria-hidden="true"
              className="animate-times-fade block font-sans font-light text-[11px] sm:text-xs tracking-[0.7em] pl-[0.7em] text-safari-champagne"
              style={{ animationDelay: "250ms" }}
            >
              MACHO HALISI
            </span>
            <span
              aria-hidden="true"
              className="mt-3 sm:mt-5 block font-serif-luxury font-light text-[clamp(4.2rem,19vw,17rem)] leading-none tracking-[0.1em] pl-[0.1em] drop-shadow-[0_6px_50px_rgba(0,0,0,0.5)]"
            >
              {WORD.split("").map((ch, i) => (
                <span key={i} className="animate-times-letter" style={{ animationDelay: `${500 + i * 90}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

      <div className="animate-times-fade absolute bottom-7 left-4 right-4 z-10 flex items-end justify-between sm:left-8 sm:right-8 lg:left-12 lg:right-12" style={{ animationDelay: "1600ms" }}>
        <span className="hidden sm:block w-40 font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-cream/60">Films &amp; stills</span>
        <span aria-hidden="true" className="block h-14 w-px overflow-hidden bg-safari-cream/15">
          <span className="animate-times-line block h-full w-px bg-safari-champagne" />
        </span>
        <span className="w-40 text-right font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-cream/60">
          {TIMES_HERO_FILM.place}
        </span>
      </div>
    </section>
  );
}
