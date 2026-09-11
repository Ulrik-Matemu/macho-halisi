"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Sleek, subtle inertia smooth-scrolling for the homepage — mouse-wheel
 * scroll eases to a stop instead of jumping instantly. Renders nothing;
 * it's a pure side-effect component, mounted once alongside <Hero /> in
 * app/page.tsx (not in SiteChrome — this is a homepage-only touch, not a
 * site-wide one).
 *
 * Two deliberate opt-outs keep this "optimized on any device" rather than
 * just on the machine it was built on:
 *   - `pointer: coarse` (touch devices) skip it entirely and get native
 *     scroll. Phones already have excellent native momentum scrolling;
 *     layering a JS-driven RAF loop on top of it burns battery and tends
 *     to feel worse, not better, especially on lower-end hardware — the
 *     "any device" win here is leaving touch devices alone.
 *   - `prefers-reduced-motion: reduce` skips it too, for visitors who've
 *     asked their OS for less animation.
 *
 * Lenis (not a transform-based "virtual scroll" library) keeps updating
 * the real `window.scrollY` and dispatches real `scroll` events under the
 * hood, so every scroll-position-dependent piece already on this page
 * (Navbar's scroll state, Hero's own scroll-progress storytelling,
 * position:sticky throughout) keeps working unmodified — this only
 * changes the easing of how scroll position gets there.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic — quick to respond, gentle stop
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
