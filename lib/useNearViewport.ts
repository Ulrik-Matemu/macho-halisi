"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the referenced element is within `margin` of the viewport, and
 * stays true afterwards. Lets heavy widgets (the Mapbox maps) load only when
 * the visitor scrolls close to them instead of at page load.
 */
export function useNearViewport<T extends Element>(margin = "600px") {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer support: fall back to loading straight away.
      const timer = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, margin]);

  return [ref, near] as const;
}
