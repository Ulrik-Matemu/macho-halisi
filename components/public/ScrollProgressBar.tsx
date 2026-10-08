"use client";

import { useEffect, useRef } from "react";

/**
 * Thin fixed bar tracking overall page scroll progress. Same rAF-throttled
 * scroll-listener pattern as DestinationHero's parallax effect, just driving
 * a width percentage instead of a transform.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollTop = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / max));
      el.style.width = `${(progress * 100).toFixed(2)}%`;
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

  return (
    <div className="fixed top-0 left-0 h-[2px] bg-safari-russet z-[60]" ref={barRef} style={{ width: 0 }} />
  );
}
