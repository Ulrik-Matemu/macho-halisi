"use client";

import { useEffect, useRef } from "react";

/** Desktop pointer with motion allowed — the only case the scroll-scrubbed effects run in. */
const MOTION_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** easeInOutQuad — the design's hero easing. */
export const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

/**
 * Shared driver for the experience page's scroll-scrubbed sections — the
 * same rAF-throttled scroll listener as ScrollProgressBar/DestinationHero,
 * factored out because six components here need it. `update` receives
 * `animate`: false below lg or under prefers-reduced-motion, where each
 * section should clear its inline styles and fall back to its static
 * (CSS-only) layout instead of scrubbing. Styles are written straight to
 * DOM refs, so scrolling never re-renders React.
 */
export function useScrollFrame(update: (animate: boolean) => void) {
  const updateRef = useRef(update);

  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    const query = window.matchMedia(MOTION_QUERY);
    let ticking = false;

    const run = () => {
      ticking = false;
      updateRef.current(query.matches);
    };
    const schedule = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };

    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    query.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, []);
}
