"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TIMES_DAY_FRAMES } from "@/data/timesData";

// Must match the `scrub` variant in globals.css: on desktop with motion
// allowed the section pins and scroll drives the strip sideways; everywhere
// else it is a plain swipeable, snap-scrolling row.
const SCRUB_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * "One day on the road": a scroll-scrubbed horizontal story. As the visitor
 * scrolls down, the section stays put and the frames travel sideways, with a
 * progress line and the time of day tracking along.
 */
export default function LongRoad() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!wrap || !track || !bar) return;
    const mq = window.matchMedia(SCRUB_QUERY);

    let ticking = false;
    let lastIndex = 0;
    const update = () => {
      ticking = false;
      if (!mq.matches) {
        track.style.transform = "";
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const scrollable = Math.max(1, wrap.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
      const idx = Math.min(TIMES_DAY_FRAMES.length - 1, Math.round(progress * (TIMES_DAY_FRAMES.length - 1)));
      if (idx !== lastIndex) {
        lastIndex = idx;
        setCurrent(idx);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  const frame = TIMES_DAY_FRAMES[current];

  return (
    <section ref={wrapRef} id="road" className="relative bg-safari-bark scrub:h-[420vh]">
      <div className="py-20 sm:py-28 scrub:sticky scrub:top-0 scrub:h-screen scrub:overflow-hidden scrub:py-0 scrub:flex scrub:flex-col scrub:justify-center">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-10 flex items-end justify-between gap-8 flex-wrap">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-4">The long road</div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[0.12em] text-safari-cream uppercase">
              One day on safari
            </h2>
          </div>
          <div className="hidden scrub:block text-right" aria-hidden="true">
            <div className="font-serif-luxury text-5xl font-light text-safari-champagne tabular-nums">
              {String(current + 1).padStart(2, "0")}
              <span className="text-safari-cream/35"> / {String(TIMES_DAY_FRAMES.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-1 font-sans font-light text-[11px] tracking-[0.34em] uppercase text-safari-gold">{frame.time}</div>
          </div>
        </div>

        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="One day on safari, in six frames. Scroll sideways."
          className="flex gap-5 sm:gap-8 overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 lg:px-12 pb-4 custom-scrollbar scrub:overflow-visible scrub:snap-none scrub:w-max scrub:pb-0 will-change-transform"
        >
          {TIMES_DAY_FRAMES.map((f, i) => (
            <figure
              key={f.title}
              className="w-[84vw] sm:w-[62vw] lg:w-[44vw] max-w-[860px] shrink-0 snap-center"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-safari-night">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 62vw, 44vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 font-serif-luxury text-3xl sm:text-4xl font-light text-safari-cream/90 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <figcaption className="mt-5 pr-6">
                <div className="font-sans font-light text-[11px] tracking-[0.34em] uppercase text-safari-gold">{f.time}</div>
                <div className="mt-2 font-serif-luxury text-2xl sm:text-[1.7rem] font-light tracking-[0.06em] text-safari-cream">{f.title}</div>
                <p className="mt-2 max-w-md font-sans font-light text-sm leading-[1.9] text-safari-cream/70">{f.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="hidden scrub:block max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 mt-10" aria-hidden="true">
          <div className="h-px w-full bg-safari-cream/20">
            <div ref={barRef} className="h-px origin-left bg-safari-gold" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
