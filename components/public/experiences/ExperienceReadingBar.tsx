"use client";

import { useEffect, useRef, useState } from "react";
import { useNavbarVisibility } from "@/components/SiteChrome";
import { clamp01 } from "./useScrollFrame";

interface ExperienceReadingBarProps {
  /** Short experience name shown after "Safari Experiences ·". */
  short: string;
  /** id of the CTA section the "Plan this experience" button scrolls to. */
  planElementId: string;
}

/**
 * Same role as ItineraryReadingBar (components/public/itinerary/): a 2px
 * scroll-progress line plus a cream contextual bar that takes over from
 * the dark global Navbar once the hero has finished opening — hiding the
 * Navbar via useNavbarVisibility() while it shows, and always restoring it
 * on unmount. "Past hero" is read from the `[data-exp-hero]` section: when
 * it's the tall pinned version (desktop), that's 98% through the pin, as in
 * the design; when it's the plain 100svh version, once it has scrolled
 * nearly out of view.
 */
export default function ExperienceReadingBar({ short, planElementId }: ExperienceReadingBarProps) {
  const { setNavbarVisible } = useNavbarVisibility();
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      if (progressRef.current) {
        progressRef.current.style.width = `${(clamp01(window.scrollY / max) * 100).toFixed(2)}%`;
      }

      const hero = document.querySelector<HTMLElement>("[data-exp-hero]");
      if (!hero) {
        setPastHero(window.scrollY > 500);
        return;
      }
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinned = rect.height > vh * 1.2;
      const pinP = clamp01(-rect.top / Math.max(1, rect.height - vh));
      setPastHero(pinned ? pinP >= 0.98 : rect.bottom <= 80);
    };
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    setNavbarVisible(!pastHero);
  }, [pastHero, setNavbarVisible]);

  useEffect(() => {
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  const scrollToPlan = () => {
    document.getElementById(planElementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-[2px] bg-[#8A6A33] z-[60] pointer-events-none"
        style={{ width: 0 }}
      />

      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-[#F6F2EA]/95 backdrop-blur-md flex items-center justify-between gap-6 sm:gap-8 px-4 sm:px-12 py-4 transition-[opacity,transform] duration-[450ms] ease-out ${
          pastHero
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
        aria-hidden={!pastHero}
      >
        <div className="flex items-baseline gap-3 sm:gap-5 min-w-0">
          <span className="font-serif-luxury font-light text-base sm:text-lg tracking-[0.16em] uppercase text-[#1E1913] whitespace-nowrap">
            Macho Halisi
          </span>
          <span className="hidden sm:block font-sans font-light text-[10.5px] tracking-[0.28em] uppercase text-[#1E1913]/70 truncate">
            Safari Experiences · {short}
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToPlan}
          tabIndex={pastHero ? 0 : -1}
          className="shrink-0 inline-flex items-center justify-center font-sans font-light text-[10px] sm:text-[10.5px] tracking-[0.3em] uppercase text-[#F6F2EA] bg-[#1E1913] hover:bg-[#8A6A33] transition-colors px-5 sm:px-7 py-3 sm:py-3.5 rounded-[2px] whitespace-nowrap cursor-pointer"
        >
          Plan this experience
        </button>
      </div>
    </>
  );
}
