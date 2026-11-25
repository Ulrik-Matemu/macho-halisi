"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TIMES_ORDER, type TimesFilm, type TimesItem } from "@/data/timesData";
import TimesViewer from "./TimesViewer";

/** Plays a silent loop only while at least a quarter of it is on screen. */
function LoopingFilm({ film, reduced, className }: { film: TimesFilm; reduced: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      src={film.src}
      poster={film.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    />
  );
}

/** One tile of the grid: a film or a photograph, cropped to a square. */
function WallTile({
  item,
  reduced,
  onOpen,
}: {
  item: TimesItem;
  reduced: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      aria-label={`${item.kind === "film" ? "Play film" : "View photo"}: ${item.title}, ${item.place}`}
      className="group relative block aspect-square w-full overflow-hidden bg-safari-bark text-left cursor-pointer"
    >
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
        {item.kind === "photo" ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="34vw"
            className="object-cover"
          />
        ) : (
          <>
            <Image src={item.poster} alt="" fill sizes="34vw" className="object-cover" />
            <LoopingFilm film={item} reduced={reduced} className="absolute inset-0 h-full w-full object-cover" />
          </>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-500 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 opacity-100 transition-opacity duration-500 sm:p-4 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="font-serif-luxury text-[14px] font-light tracking-[0.08em] text-safari-cream">{item.title}</span>
        <span className="font-sans font-light text-[9px] tracking-[0.28em] uppercase text-safari-champagne">{item.place}</span>
      </div>
    </button>
  );
}

type WallFilter = "all" | "film" | "photo";

const FILTERS: { id: WallFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "film", label: "Films" },
  { id: "photo", label: "Photographs" },
];

const COUNTS: Record<WallFilter, number> = {
  all: TIMES_ORDER.length,
  film: TIMES_ORDER.filter((i) => i.kind === "film").length,
  photo: TIMES_ORDER.filter((i) => i.kind === "photo").length,
};

/**
 * The wall of films and photographs: a plain, gapless grid running edge to
 * edge. It starts on everything, in order; a slim strip pinned to the top
 * of the screen narrows it to just films or just photographs. Anything opens
 * in the viewer, which pages through whatever is currently shown.
 */
export default function TimesWall() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState<WallFilter>("all");
  // Only fade the grid in after the visitor has switched filters, so the
  // first view is exactly the plain wall.
  const [switched, setSwitched] = useState(false);
  const wallRef = useRef<HTMLDivElement | null>(null);
  // The filter bar only shows while the wall is on screen.
  const [wallInView, setWallInView] = useState(false);

  const items = filter === "all" ? TIMES_ORDER : TIMES_ORDER.filter((i) => i.kind === filter);

  const openById = useCallback((id: string) => setOpen(items.findIndex((i) => i.id === id)), [items]);

  // Old links (/times#films, /times#stills) land on the matching filter.
  useEffect(() => {
    const hash = window.location.hash;
    const next: WallFilter | null = hash === "#films" ? "film" : hash === "#stills" ? "photo" : null;
    if (next) queueMicrotask(() => setFilter(next));
  }, []);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setWallInView(entry.isIntersecting), {
      rootMargin: "0px 0px -30% 0px",
    });
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  const choose = (next: WallFilter) => {
    if (next === filter) return;
    setFilter(next);
    setSwitched(true);
    // The strip is pinned, so the visitor is usually deep in the wall:
    // bring the new, shorter grid back to its top.
    const wall = wallRef.current;
    if (wall && wall.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: window.scrollY + wall.getBoundingClientRect().top, behavior: "auto" });
    }
  };

  return (
    <div ref={wallRef} className="bg-safari-linen">
      <div
        className={`fixed bottom-5 left-1/2 z-30 -translate-x-1/2 transition-[opacity,transform] duration-700 ease-out sm:bottom-7 ${
          wallInView && open === null ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div
          role="group"
          aria-label="Show on the wall"
          className="flex items-center gap-6 rounded border border-safari-cream/15 bg-safari-night/80 px-6 py-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md sm:gap-9 sm:px-8"
        >
          {FILTERS.map(({ id, label }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                tabIndex={wallInView && open === null ? 0 : -1}
                onClick={() => choose(id)}
                className={`relative cursor-pointer pb-1 font-sans text-[10px] font-light uppercase tracking-[0.3em] transition-colors duration-500 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-safari-champagne after:transition-transform after:duration-500 ${
                  active
                    ? "text-safari-cream after:scale-x-100"
                    : "text-safari-cream/55 hover:text-safari-cream after:scale-x-0"
                }`}
              >
                {label}
                <span className="ml-2 tabular-nums text-safari-cream/40">{COUNTS[id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div key={filter} className={`grid grid-cols-3 gap-0 ${switched ? "animate-times-fade" : ""}`}>
        {items.map((item) => (
          <WallTile key={item.id} item={item} reduced={reduced} onOpen={openById} />
        ))}
      </div>

      {open !== null && <TimesViewer items={items} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
