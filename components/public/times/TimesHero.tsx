"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TIMES_HERO_FILM, TIMES_HERO_POSTER } from "@/data/timesData";

const TITLE_LINES = ["MACHO HALISI", "TIMES"];

/** Smooth-scrolls to a section by id (honouring reduced motion). */
export function scrollToSection(id: string, reduced: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/**
 * Full-viewport masthead: a muted looping film behind a newspaper-style
 * title whose letters settle in one by one, with a scroll parallax that
 * drifts the title up and fades it while the film slowly pushes in.
 */
export default function TimesHero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Scroll parallax — rAF-throttled, same pattern as ScrollProgressBar.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    const media = mediaRef.current;
    if (!section || !content || !media) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      const progress = Math.min(1, y / (window.innerHeight * 0.85));
      content.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0)`;
      content.style.opacity = String(1 - progress * 1.15 > 0 ? 1 - progress * 1.15 : 0);
      media.style.transform = `translate3d(0, ${(y * 0.14).toFixed(1)}px, 0)`;
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

  // Pause the background film once the hero is off-screen — it is decorative
  // and there is a lot of page (and more video) below.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  let letterIndex = 0;

  return (
    <section ref={sectionRef} data-navbar-hero className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-black">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 animate-times-pushin">
          <Image src={TIMES_HERO_POSTER} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          {!reduced && (
            <video
              ref={videoRef}
              src={TIMES_HERO_FILM.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      <div ref={contentRef} className="relative z-10 flex h-full flex-col justify-between will-change-transform">
        {/* Masthead strip */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32">
          <div
            className="animate-times-fade flex items-center justify-between gap-6 border-y border-safari-cream/30 py-3 font-sans font-light text-[10px] sm:text-[11px] tracking-[0.34em] uppercase text-safari-cream/85"
            style={{ animationDelay: "200ms" }}
          >
            <span>Issue Nº 01</span>
            <span className="hidden sm:inline">Films · Frames · Field notes</span>
            <span>Karatu, Tanzania</span>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24">
          <h1 className="font-serif-luxury font-light text-safari-cream leading-[0.98] tracking-[0.08em] sm:tracking-[0.1em] text-[clamp(2.6rem,9.5vw,9rem)] drop-shadow-[0_6px_40px_rgba(0,0,0,0.65)]">
            <span className="sr-only">Macho Halisi Times</span>
            <span aria-hidden="true" className="block">
              {TITLE_LINES.map((line, li) => (
                <span key={line} className={`block ${li === 1 ? "text-safari-gold" : ""}`}>
                  {line.split("").map((ch, ci) => {
                    const delay = 350 + letterIndex++ * 55;
                    return (
                      <span key={`${li}-${ci}`} className="animate-times-letter" style={{ animationDelay: `${delay}ms` }}>
                        {ch === " " ? " " : ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="animate-times-fade mt-6 sm:mt-8 max-w-xl font-sans font-light text-[15px] sm:text-base leading-[1.9] text-safari-cream/90"
            style={{ animationDelay: "1500ms" }}
          >
            The films, photographs and field notes behind every Macho Halisi journey, gathered from the road by the people who drive it.
          </p>

          <div className="animate-times-fade mt-9 flex flex-wrap items-center gap-4 sm:gap-6" style={{ animationDelay: "1750ms" }}>
            <button
              type="button"
              onClick={() => scrollToSection("films", reduced)}
              className="font-sans font-light text-[11px] tracking-[0.3em] uppercase bg-safari-ochre hover:bg-safari-gold text-safari-bark px-8 py-4 rounded transition-colors cursor-pointer"
            >
              Watch the reel
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("journal", reduced)}
              className="font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-cream border border-safari-cream/40 hover:border-safari-gold hover:text-safari-gold px-8 py-4 rounded transition-colors cursor-pointer"
            >
              Browse the journal
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-safari-cream/70">
        <ArrowDown className="h-5 w-5 animate-scroll-cue" aria-hidden="true" />
      </div>
    </section>
  );
}
