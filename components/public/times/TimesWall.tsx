"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  TIMES_FILMS,
  TIMES_ORDER,
  TIMES_PHOTOS,
  TIMES_SCENES,
  timesIndex,
  type TimesFilm,
  type TimesItem,
} from "@/data/timesData";
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
  anchor,
  reduced,
  onOpen,
}: {
  item: TimesItem;
  anchor?: string;
  reduced: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      id={anchor}
      onClick={() => onOpen(item.id)}
      aria-label={`${item.kind === "film" ? "Play film" : "View photo"}: ${item.title}, ${item.place}`}
      className="group relative block aspect-square w-full scroll-mt-24 overflow-hidden bg-safari-bark text-left cursor-pointer"
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

/**
 * The wall of films and photographs: a plain, gapless grid running edge to
 * edge. Anything opens in the viewer, which pages through the whole wall in
 * order.
 */
export default function TimesWall() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  const openById = useCallback((id: string) => setOpen(timesIndex(id)), []);

  return (
    <div className="bg-safari-linen">
      <div className="grid grid-cols-3 gap-0">
        {TIMES_SCENES.flatMap((scene, i) => {
          if (scene.kind === "expand") {
            return [<WallTile key={`expand-${i}`} item={TIMES_FILMS[scene.id]} reduced={reduced} onOpen={openById} />];
          }
          return scene.slots.map((slot, si) => (
            <WallTile
              key={slot.id}
              item={TIMES_FILMS[slot.id] ?? TIMES_PHOTOS[slot.id]}
              anchor={si === 0 ? scene.anchor : undefined}
              reduced={reduced}
              onOpen={openById}
            />
          ));
        })}
      </div>

      {open !== null && <TimesViewer items={TIMES_ORDER} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
