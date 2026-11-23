"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { TimesFilm, TimesItem } from "@/data/timesData";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** A film at full size, with sound, one tap to pause and a thin scrubber. */
function FilmStage({ film }: { film: TimesFilm }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(film.seconds);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // The click that opened the viewer normally allows sound; if the browser
    // refuses, fall back to a muted start instead of a dead player.
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, []);

  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "m") {
        const v = ref.current;
        if (v) {
          v.muted = !v.muted;
          setMuted(v.muted);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <video
          ref={ref}
          src={film.src}
          poster={film.poster}
          playsInline
          loop
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || film.seconds)}
          className="animate-image-settle absolute inset-0 h-full w-full cursor-pointer object-contain"
          aria-label={`${film.title}, ${film.place}`}
        />
      </div>
      <div className="mx-auto flex w-full max-w-[760px] items-center gap-4 px-4 pb-1 pt-3 sm:px-8">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-safari-cream/80 transition-colors hover:text-safari-gold cursor-pointer"
        >
          {playing ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={time}
          aria-label="Seek"
          onChange={(e) => {
            const v = ref.current;
            if (v) v.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          className="times-range min-w-0 flex-1"
          style={{ "--times-progress": `${progress}%` } as CSSProperties}
        />
        <span className="w-[4.5rem] shrink-0 text-right font-sans font-light text-[11px] tabular-nums tracking-[0.12em] text-safari-cream/60">
          {fmt(time)} / {fmt(duration)}
        </span>
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-safari-cream/80 transition-colors hover:text-safari-gold cursor-pointer"
        >
          {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </div>
  );
}

/**
 * Full-screen viewer for the whole wall: films and photographs in page order.
 * Arrow keys / buttons / swipe to move, Escape or a click on the backdrop to
 * close. Locks page scroll while open, keeps focus inside, and returns it to
 * whatever opened it.
 */
export default function TimesViewer({
  items,
  index,
  onChange,
  onClose,
}: {
  items: TimesItem[];
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
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, input");
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

  // Neighbouring photographs are mounted but invisible so the next arrow press is instant.
  const preload = [items[(index + 1) % count], items[(index - 1 + count) % count]].filter(
    (n): n is Extract<TimesItem, { kind: "photo" }> => !!n && n.kind === "photo" && n !== item
  );

  const arrow =
    "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-safari-cream/25 bg-black/40 backdrop-blur-sm transition-colors hover:border-safari-gold hover:text-safari-gold cursor-pointer sm:flex";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.kind === "film" ? "Film" : "Photo"} ${index + 1} of ${count}: ${item.title}`}
      data-lenis-prevent
      className="animate-modal-backdrop fixed inset-0 z-[70] flex flex-col bg-black text-safari-cream"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 60) (dx > 0 ? prev : next)();
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="font-sans font-light text-xs tracking-[0.3em] tabular-nums text-safari-cream/60">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-safari-cream/30 transition-colors hover:border-safari-gold hover:text-safari-gold cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-2 sm:px-20" onClick={item.kind === "photo" ? onClose : undefined}>
        {item.kind === "film" ? (
          <FilmStage key={item.id} film={item} />
        ) : (
          <div className="relative h-full w-full">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              quality={85}
              priority
              className="animate-image-settle object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className={`${arrow} left-3 sm:left-5`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className={`${arrow} right-3 sm:right-5`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-5 text-center sm:px-8">
        <div className="font-serif-luxury text-lg font-light tracking-[0.14em] uppercase sm:text-xl">{item.title}</div>
        <div className="mt-1 font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-gold">{item.place}</div>
      </div>

      <div className="sr-only" aria-hidden="true">
        {preload.map((n) => (
          <Image key={n.src} src={n.src} alt="" width={1600} height={1000} quality={85} />
        ))}
      </div>
    </div>
  );
}
