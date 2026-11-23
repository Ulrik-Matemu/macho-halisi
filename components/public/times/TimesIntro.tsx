"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/public/ScrollReveal";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Counts up to `to` the first time it scrolls into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      queueMicrotask(() => setValue(to));
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const DURATION = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduced]);

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}

const STATS = [
  { to: 17, suffix: "+", label: "Years guiding in Tanzania" },
  { to: 20, suffix: "", label: "Custom-built safari vehicles" },
  { to: 100, suffix: "%", label: "Tanzanian-owned" },
];

/** The editor's note under the masthead, with three counting-up facts. */
export default function TimesIntro() {
  return (
    <section className="bg-safari-night px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.6fr] gap-12 lg:gap-24">
        <ScrollReveal>
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">From the editor</div>
          <div className="h-px w-16 bg-safari-gold/60" />
        </ScrollReveal>
        <div>
          <ScrollReveal delayMs={100}>
            <p className="font-serif-luxury font-light text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.28] tracking-[0.02em] text-safari-cream text-balance">
              Macho Halisi means <span className="text-safari-gold">“true eyes”</span>. This is where we keep what ours have seen.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={220} size="lift">
            <p className="mt-8 max-w-2xl font-sans font-light text-[15px] sm:text-base leading-[2] text-safari-cream/80">
              A river crossing at first light, a cheetah on the roof of a safari vehicle, a sundowner that lasts until the stars come
              out. These are the films and photographs from our journeys across Tanzania, gathered in one place and added to as
              the seasons turn.
            </p>
          </ScrollReveal>
          <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 border-t border-safari-cream/15 pt-10">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delayMs={300 + i * 100} size="lift">
                <div className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl text-safari-champagne tabular-nums">
                  <CountUp to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="mt-3 font-sans font-light text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-safari-cream/70 leading-relaxed">
                  {stat.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
