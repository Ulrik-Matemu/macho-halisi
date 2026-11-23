"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxItem {
  src: string;
  alt: string;
  title: string;
  place: string;
}

/**
 * Full-screen photo viewer: arrow keys / buttons / swipe to move, Escape or a
 * click on the backdrop to close. Locks page scroll while open, keeps focus
 * inside the dialog and hands it back to whatever opened it.
 */
export default function Lightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onChange: (next: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const item = items[index];
  const count = items.length;

  const prev = useCallback(() => onChange((index - 1 + count) % count), [index, count, onChange]);
  const next = useCallback(() => onChange((index + 1) % count), [index, count, onChange]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        // Keep Tab inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  if (!item) return null;

  // Neighbours are mounted but invisible so the browser has them ready
  // before the next arrow press.
  const preload = [items[(index + 1) % count], items[(index - 1 + count) % count]].filter((n) => n && n !== item);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}: ${item.title}`}
      data-lenis-prevent
      className="animate-modal-backdrop fixed inset-0 z-[70] flex flex-col bg-black/95 text-safari-cream"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <span className="font-sans font-light text-xs tracking-[0.3em] tabular-nums text-safari-cream/70">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-safari-cream/30 transition-colors hover:border-safari-gold hover:text-safari-gold cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0" onClick={onClose}>
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="100vw"
          quality={85}
          priority
          className="animate-image-settle object-contain px-2 sm:px-20"
          onClick={(e) => e.stopPropagation()}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-safari-cream/25 bg-black/40 backdrop-blur-sm transition-colors hover:border-safari-gold hover:text-safari-gold cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-safari-cream/25 bg-black/40 backdrop-blur-sm transition-colors hover:border-safari-gold hover:text-safari-gold cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="px-4 sm:px-8 py-5 text-center">
        <div className="font-serif-luxury text-xl sm:text-2xl font-light tracking-[0.14em] uppercase">{item.title}</div>
        <div className="mt-1 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-gold">{item.place}</div>
      </div>

      <div className="sr-only" aria-hidden="true">
        {preload.map((n) => (
          <Image key={n.src} src={n.src} alt="" width={1600} height={1000} quality={85} />
        ))}
      </div>
    </div>
  );
}
