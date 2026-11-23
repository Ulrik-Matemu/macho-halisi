"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";
import Lightbox from "./Lightbox";
import { PHOTO_CHAPTERS, TIMES_PHOTOS, type PhotoChapter } from "@/data/timesData";

/**
 * The photo journal: a masonry of frames filtered by chapter. Choosing a
 * chapter re-deals the wall with a quick cascade; any frame opens in the
 * full-screen viewer, which pages through just the frames currently shown.
 */
export default function PhotoJournal() {
  const [chapter, setChapter] = useState<PhotoChapter | "all">("all");
  const [open, setOpen] = useState<number | null>(null);

  const photos = useMemo(
    () => (chapter === "all" ? TIMES_PHOTOS : TIMES_PHOTOS.filter((p) => p.chapter === chapter)),
    [chapter]
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: TIMES_PHOTOS.length };
    for (const p of TIMES_PHOTOS) c[p.chapter] = (c[p.chapter] ?? 0) + 1;
    return c;
  }, []);

  return (
    <section id="journal" className="scroll-mt-20 bg-safari-night px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1600px] mx-auto">
        <ScrollReveal>
          <div className="mb-10 sm:mb-14">
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-4">The photo journal</div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[0.12em] text-safari-cream uppercase">
              Frames from the field
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={80} size="lift">
          <div role="tablist" aria-label="Photo chapters" className="mb-10 flex flex-wrap gap-2 sm:gap-3">
            {PHOTO_CHAPTERS.map((c) => {
              const active = c.id === chapter;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setChapter(c.id)}
                  className={`rounded px-4 py-2.5 font-sans font-light text-[11px] tracking-[0.24em] uppercase transition-colors cursor-pointer border ${
                    active
                      ? "bg-safari-ochre border-safari-ochre text-safari-bark"
                      : "border-safari-cream/25 text-safari-cream/80 hover:border-safari-gold hover:text-safari-gold"
                  }`}
                >
                  {c.label}
                  <span className={`ml-2 tabular-nums ${active ? "text-safari-bark/70" : "text-safari-cream/45"}`}>{counts[c.id] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* key re-mounts the wall when the chapter changes, replaying the cascade */}
        <div key={chapter} role="tabpanel" className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              className="animate-nav-cascade mb-4 sm:mb-5 break-inside-avoid"
              style={{ animationDelay: `${Math.min(i, 14) * 45}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${photo.title}, ${photo.place}`}
                className="group relative block w-full overflow-hidden bg-safari-bark cursor-pointer"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-80 lg:opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100" />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left translate-y-0 lg:translate-y-3 opacity-100 lg:opacity-0 transition-all duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                  <div className="font-serif-luxury text-lg font-light tracking-[0.1em] uppercase text-safari-cream">{photo.title}</div>
                  <div className="mt-1 font-sans font-light text-[10px] tracking-[0.28em] uppercase text-safari-gold">{photo.place}</div>
                </figcaption>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-safari-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </figure>
          ))}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          items={photos}
          index={open}
          onChange={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
