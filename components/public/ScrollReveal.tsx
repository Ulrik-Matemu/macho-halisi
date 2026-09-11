"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Extra delay (ms) before this instance's reveal starts — how a group staggers into a cascade. */
  delayMs?: number;
  /** "rise" = 14px lift, 0.45s — headings and larger blocks. "lift" = 8px, 0.35s — smaller/nested items. */
  size?: "rise" | "lift";
  className?: string;
}

/**
 * Scroll-into-view reveal for the footer (see Footer.tsx) — deliberately
 * reuses the exact cascade keyframes/timing/easing already defined for the
 * fullscreen nav menu (animate-nav-cascade / animate-sub-cascade in
 * globals.css, both riding the site's .transition-luxury cubic-bezier) so
 * this reads as the same considered motion language already established
 * elsewhere, not a new one invented just for the footer.
 *
 * Triggers once via IntersectionObserver and never re-plays on scrolling
 * back past it — a reveal that replays every time feels like a gimmick,
 * not a considered detail. Renders inert (opacity-0) until triggered, so
 * there's no flash of fully-visible content before the observer's first
 * callback, and backs off entirely for prefers-reduced-motion (content
 * simply present, no animation).
 */
export default function ScrollReveal({ children, delayMs = 0, size = "rise", className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred rather than called directly in the effect body, so this
      // is a follow-up update rather than a synchronous render-in-render.
      queueMicrotask(() => {
        setSkipAnimation(true);
        setInView(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animationClass = size === "rise" ? "animate-nav-cascade" : "animate-sub-cascade";

  return (
    <div
      ref={ref}
      style={inView && !skipAnimation && delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
      className={`${skipAnimation ? "" : inView ? animationClass : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
