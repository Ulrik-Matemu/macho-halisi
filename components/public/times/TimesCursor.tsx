"use client";

import { useEffect, useRef } from "react";

/**
 * A small label that trails the pointer over anything marked
 * `data-times-cursor="Play"` (or "View"). Only runs with a real mouse and
 * motion allowed; elsewhere it renders nothing visible and the normal cursor
 * stays. It sets `data-times-cursor-on` on <html> only while active, which
 * is what hides the native cursor over those elements (see globals.css).
 */
export default function TimesCursor() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!wrap || !dot || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const root = document.documentElement;
    root.dataset.timesCursorOn = "";

    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let raf = 0;
    let current: string | null = null;

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      wrap.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      kick();
    };
    const setLabel = (text: string | null) => {
      if (text === current) return;
      current = text;
      if (text) label.textContent = text;
      dot.style.transform = text ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)";
      dot.style.opacity = text ? "1" : "0";
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-times-cursor]");
      setLabel(el ? el.getAttribute("data-times-cursor") : null);
    };
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete root.dataset.timesCursorOn;
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]">
      <div
        ref={dotRef}
        className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-safari-cream/60 bg-safari-bark/60 backdrop-blur-sm transition-[transform,opacity] duration-300 ease-out"
        style={{ transform: "translate(-50%, -50%) scale(0)", opacity: 0 }}
      >
        <span ref={labelRef} className="font-sans font-light text-[10px] tracking-[0.3em] pl-[0.3em] uppercase text-safari-cream" />
      </div>
    </div>
  );
}
