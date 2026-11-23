"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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
  type WallSlot,
} from "@/data/timesData";
import TimesViewer from "./TimesViewer";
import TimesCursor from "./TimesCursor";

// Must match the `scrub` variant in globals.css: on desktop with motion
// allowed the expanding film pins and scroll drives it; elsewhere it is a
// plain full-width film.
const SCRUB_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

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

/** One piece of the wall: a film or a photograph, unmasked as it arrives. */
function WallItem({
  item,
  slot,
  position,
  reduced,
  onOpen,
}: {
  item: TimesItem;
  slot: WallSlot;
  position: number;
  reduced: boolean;
  onOpen: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const portrait = item.height > item.width;
  // Phones: a clean single column — portraits narrower, alternating sides.
  const phoneWidth = portrait ? "w-[80%]" : "w-full";
  const phoneSide = position % 2 === 0 ? "self-start" : "self-end";

  const sizes =
    item.kind === "photo"
      ? `(max-width: 1024px) ${portrait ? "80vw" : "100vw"}, ${Math.round((slot.span / 12) * 100)}vw`
      : undefined;

  return (
    <div
      ref={rootRef}
      data-px-wrap
      className={`times-item ${phoneWidth} ${phoneSide} lg:w-auto lg:self-auto lg:[grid-column:var(--col)] lg:mt-[var(--top)]`}
      style={{ "--col": `${slot.col} / span ${slot.span}`, "--top": `${slot.top ?? 0}vh` } as CSSProperties}
    >
      <div data-px={slot.speed ?? 0} className="will-change-transform">
        <button
          type="button"
          onClick={() => onOpen(item.id)}
          data-times-cursor={item.kind === "film" ? "Play" : "View"}
          aria-label={`${item.kind === "film" ? "Play film" : "View photo"}: ${item.title}, ${item.place}`}
          className="group block w-full text-left cursor-pointer"
        >
          <div className="times-reveal overflow-hidden bg-safari-bark" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
            <div className="times-media relative h-full w-full">
              <div className="relative h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
                {item.kind === "photo" ? (
                  <Image src={item.src} alt={item.alt} fill sizes={sizes} className="object-cover" />
                ) : (
                  <>
                    <Image src={item.poster} alt="" fill sizes={sizes ?? "(max-width: 1024px) 80vw, 40vw"} className="object-cover" />
                    <LoopingFilm film={item} reduced={reduced} className="absolute inset-0 h-full w-full object-cover" />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="times-cap mt-3 flex items-baseline justify-between gap-4">
            <span className="font-serif-luxury text-[15px] font-light tracking-[0.08em] text-safari-cream/90">{item.title}</span>
            <span className="font-sans font-light text-[10px] tracking-[0.28em] uppercase text-safari-gold/75">{item.place}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

/**
 * The pinned film. On desktop the section holds the screen while the picture
 * opens from a small window to nearly full-bleed (and settles from a slight
 * zoom); everywhere else it is a normal full-width film.
 */
function ExpandFilm({ film, reduced, onOpen }: { film: TimesFilm; reduced: boolean; onOpen: (id: string) => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const cap = capRef.current;
    if (!wrap || !frame || !media || !cap) return;
    const mq = window.matchMedia(SCRUB_QUERY);

    let ticking = false;
    const update = () => {
      ticking = false;
      if (!mq.matches) {
        frame.style.clipPath = "";
        media.style.transform = "";
        cap.style.opacity = "";
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const scrollable = Math.max(1, wrap.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      // Opens over the first 60% of the pin, then holds.
      const t = Math.min(1, p / 0.6);
      const e = 1 - Math.pow(1 - t, 3);
      frame.style.clipPath = `inset(${((1 - e) * 22 + 6).toFixed(2)}vh ${((1 - e) * 30 + 6).toFixed(2)}vw)`;
      media.style.transform = `scale(${(1.22 - 0.22 * e).toFixed(4)})`;
      cap.style.opacity = String(Math.max(0, Math.min(1, (e - 0.7) / 0.3)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-screen ml-[calc(50%-50vw)] scrub:h-[230vh]">
      <div className="scrub:sticky scrub:top-0 scrub:h-screen">
        <button
          type="button"
          onClick={() => onOpen(film.id)}
          data-times-cursor="Play"
          aria-label={`Play film: ${film.title}, ${film.place}`}
          className="group relative block aspect-video w-full cursor-pointer scrub:h-full scrub:aspect-auto"
        >
          <div ref={frameRef} className="absolute inset-0 overflow-hidden bg-safari-bark">
            <div ref={mediaRef} className="absolute inset-0 will-change-transform">
              <Image src={film.poster} alt="" fill sizes="100vw" className="object-cover" />
              <LoopingFilm film={film} reduced={reduced} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          <div
            ref={capRef}
            className="pointer-events-none absolute bottom-[8vh] left-0 right-0 flex items-baseline justify-between px-[9vw] sm:px-[8vw] scrub:bottom-[10vh]"
          >
            <span className="font-serif-luxury text-lg font-light tracking-[0.1em] text-safari-cream sm:text-2xl">{film.title}</span>
            <span className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-champagne">{film.place}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

/**
 * The wall of films and photographs, laid out as scattered scenes, drifting at
 * their own speeds as you scroll. Anything opens in the viewer, which pages
 * through the whole wall in order.
 */
export default function TimesWall() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const openById = useCallback((id: string) => setOpen(timesIndex(id)), []);

  // One shared scroll loop drives every piece's drift: each piece's own
  // wrapper (never transformed) is measured, its inner layer is moved.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-px]"));

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const layer of layers) {
        if (!mq.matches) {
          layer.style.transform = "";
          continue;
        }
        const wrap = layer.parentElement;
        if (!wrap) continue;
        const rect = wrap.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const speed = Number(layer.dataset.px) || 0;
        const delta = rect.top + rect.height / 2 - vh / 2;
        layer.style.transform = `translate3d(0, ${(delta * speed).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <div className="overflow-x-clip bg-safari-night px-4 sm:px-8 lg:px-12 py-[14vh]">
      <div ref={rootRef} className="mx-auto flex max-w-[1500px] flex-col gap-[22vw] sm:gap-[18vw] lg:gap-[20vh]">
        {TIMES_SCENES.map((scene, i) => {
          if (scene.kind === "expand") {
            return <ExpandFilm key={`expand-${i}`} film={TIMES_FILMS[scene.id]} reduced={reduced} onOpen={openById} />;
          }
          return (
            <div
              key={i}
              id={scene.anchor}
              className="scroll-mt-24 flex flex-col gap-[16vw] sm:gap-[12vw] lg:grid lg:grid-cols-12 lg:gap-x-6 lg:items-start"
            >
              {scene.slots.map((slot, si) => {
                const item = TIMES_FILMS[slot.id] ?? TIMES_PHOTOS[slot.id];
                return <WallItem key={slot.id} item={item} slot={slot} position={i + si} reduced={reduced} onOpen={openById} />;
              })}
            </div>
          );
        })}
      </div>

      <TimesCursor />
      {open !== null && <TimesViewer items={TIMES_ORDER} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
