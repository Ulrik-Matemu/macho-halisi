"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` OS setting, including live
 * changes (unlike the one-shot `matchMedia(...).matches` reads scattered
 * across SmoothScroll/ScrollReveal before this hook existed). Initializes to
 * `false` so the server render and the first client render agree — the
 * effect flips it to the real value immediately after mount, before paint
 * in practice since it runs on mount with no dependency on layout.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
