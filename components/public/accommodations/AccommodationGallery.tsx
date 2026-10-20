"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PublicAccommodationImage } from "@/lib/public/types";

interface AccommodationGalleryProps {
  images: PublicAccommodationImage[];
  /** Fallback alt text for images without one. */
  name: string;
}

// The mosaic shows at most MAX_TILES photos; anything beyond that is reached
// through the lightbox via a "+N" tile on the last one. Each photo count
// from 1 to MAX_TILES has its own layout, so the grid never has holes or
// stretched singles however many images were uploaded. Below `sm` every
// layout collapses to a plain 2-column grid (the first tile spans the full
// width when the count is odd, so the last row is never half-empty).
const LAYOUTS: Record<number, { container: string; tiles: string[] }> = {
  1: { container: "sm:aspect-[16/9]", tiles: ["col-span-2"] },
  2: { container: "sm:aspect-[2/1]", tiles: ["", ""] },
  3: {
    container: "sm:grid-rows-2 sm:aspect-[16/10]",
    tiles: ["col-span-2 sm:col-span-1 sm:row-span-2", "", ""],
  },
  4: {
    container: "sm:grid-cols-3 sm:grid-rows-[2fr_1fr] sm:aspect-[3/2]",
    tiles: ["sm:col-span-3", "", "", ""],
  },
  5: {
    container: "sm:grid-cols-4 sm:grid-rows-2 sm:aspect-[2/1]",
    tiles: ["col-span-2 sm:row-span-2", "", "", "", ""],
  },
};
const MAX_TILES = 5;

export default function AccommodationGallery({ images, name }: AccommodationGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const count = images.length;
  const tileCount = Math.min(count, MAX_TILES);
  const hidden = count - tileCount;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, step]);

  if (count === 0) return null;

  const layout = LAYOUTS[tileCount];
  const active = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div className={`grid grid-cols-2 gap-2 sm:gap-3 ${layout.container}`}>
        {images.slice(0, tileCount).map((img, i) => {
          const isLastWithMore = hidden > 0 && i === tileCount - 1;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={isLastWithMore ? `View all ${count} photos` : `Open photo ${i + 1} of ${count}`}
              className={`group relative overflow-hidden bg-black/40 aspect-[4/3] sm:aspect-auto cursor-zoom-in ${layout.tiles[i]}`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${name} — photo ${i + 1}`}
                fill
                sizes={i === 0 && tileCount > 1 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 33vw"}
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              {isLastWithMore && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <span className="font-serif-luxury font-light text-2xl sm:text-3xl text-white tracking-wide">
                    +{hidden}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {count > tileCount && (
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="mt-4 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-gold hover:text-safari-champagne transition-colors cursor-pointer"
        >
          View all {count} photos
        </button>
      )}

      {active && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo gallery`}
          className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 text-white/70">
            <span className="font-sans font-light text-[11px] tracking-[0.3em] uppercase">
              {openIndex + 1} / {count}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="w-10 h-10 rounded-full border border-white/25 hover:border-safari-gold hover:text-safari-gold flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 mx-4 sm:mx-16 mb-6" onClick={(e) => e.stopPropagation()}>
            <Image
              key={active.id}
              src={active.url}
              alt={active.altText || `${name} — photo ${openIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/25 bg-black/40 text-white hover:border-safari-gold hover:text-safari-gold flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/25 bg-black/40 text-white hover:border-safari-gold hover:text-safari-gold flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
