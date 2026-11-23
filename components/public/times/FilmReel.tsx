"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";
import { useNearViewport } from "@/lib/useNearViewport";
import { TIMES_FILMS, type TimesFilm } from "@/data/timesData";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/** Frame shown before a clip plays: `#t=` makes browsers paint that frame. */
const withStill = (film: TimesFilm) => `${film.src}#t=${film.still ?? 0.5}`;

function EqBars() {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-full w-[2px] bg-safari-gold animate-times-eq" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}

/**
 * Playlist tile. Shows a still of the clip; on a pointer device hovering it
 * plays a silent preview, and clicking hands the film to the main stage.
 */
function FilmTile({
  film,
  index,
  active,
  ready,
  onSelect,
}: {
  film: TimesFilm;
  index: number;
  active: boolean;
  ready: boolean;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startPreview = () => {
    const v = videoRef.current;
    if (!v || active) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const stopPreview = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = film.still ?? 0.5;
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      aria-label={`Play ${film.title}, ${fmt(film.seconds)}`}
      aria-current={active ? "true" : undefined}
      className={`group relative w-[220px] sm:w-[250px] shrink-0 snap-start text-left cursor-pointer border transition-colors duration-300 ${
        active ? "border-safari-gold" : "border-safari-cream/15 hover:border-safari-gold/70"
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-safari-bark">
        {ready && (
          <video
            ref={videoRef}
            src={withStill(film)}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              active ? "opacity-60" : ""
            }`}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
        <span className="absolute left-3 top-3 font-serif-luxury text-sm tracking-[0.2em] text-safari-cream/90">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-3 top-3 bg-black/60 px-2 py-0.5 font-sans text-[10px] tracking-[0.15em] text-safari-cream tabular-nums rounded">
          {fmt(film.seconds)}
        </span>
        {film.orientation === "portrait" && (
          <span className="absolute bottom-3 right-3 border border-safari-cream/40 px-1.5 py-0.5 font-sans text-[9px] tracking-[0.2em] uppercase text-safari-cream/90 rounded">
            Vertical
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {active ? (
            <EqBars />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-safari-cream/90 text-safari-bark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Play className="h-3 w-3 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className={`font-serif-luxury text-sm tracking-[0.12em] uppercase ${active ? "text-safari-gold" : "text-safari-cream"}`}>
          {film.title}
        </div>
        <p className="mt-1 line-clamp-2 font-sans font-light text-xs leading-relaxed text-safari-cream/65">{film.caption}</p>
      </div>
    </button>
  );
}

/**
 * The film reel: one large cinema stage with custom controls (play, scrub,
 * sound, full screen, keyboard shortcuts) above a playlist rail. A finished
 * film rolls on to the next, like a programme.
 */
export default function FilmReel() {
  const [sectionRef, near] = useNearViewport<HTMLElement>("500px");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wantsPlayRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(TIMES_FILMS[0].seconds);
  const [controlsVisible, setControlsVisible] = useState(true);

  const film = TIMES_FILMS[index];

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2600);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // The poster frame comes from a #t= fragment; begin the film at 0.
      if (!started && v.currentTime < 1) v.currentTime = 0;
      setStarted(true);
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [started]);

  const select = useCallback((i: number, autoplay = true) => {
    wantsPlayRef.current = autoplay;
    setIndex(i);
    setTime(0);
    setDuration(TIMES_FILMS[i].seconds);
    setPlaying(false);
    if (autoplay) setStarted(true);
  }, []);

  // When the film changes, start it if the viewer asked for that.
  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || film.seconds);
    if (wantsPlayRef.current) {
      wantsPlayRef.current = false;
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const onEnded = () => {
    setPlaying(false);
    if (index < TIMES_FILMS.length - 1) select(index + 1, true);
    else setControlsVisible(true);
  };

  const seek = (to: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || duration, to));
    setTime(v.currentTime);
  };

  const goFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Don't hijack keys while the scrubber (a range input) or a button has focus.
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "BUTTON") return;
    const v = videoRef.current;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "m":
        setMuted((m) => !m);
        break;
      case "f":
        goFullscreen();
        break;
      case "ArrowRight":
        if (v) seek(v.currentTime + 5);
        break;
      case "ArrowLeft":
        if (v) seek(v.currentTime - 5);
        break;
      default:
        return;
    }
    revealControls();
  };

  const progress = duration ? (time / duration) * 100 : 0;
  const showControls = controlsVisible || !playing;

  return (
    <section ref={sectionRef} id="films" className="scroll-mt-20 bg-safari-bark px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-8 flex-wrap mb-10 sm:mb-14">
            <div>
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-4">The film reel</div>
              <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[0.12em] text-safari-cream uppercase">
                Press play
              </h2>
            </div>
            <p className="max-w-sm font-sans font-light text-[14px] leading-[1.9] text-safari-cream/70">
              {TIMES_FILMS.length} short films from the road. Pick one, or let the reel run: each film rolls into the next.
            </p>
          </div>
        </ScrollReveal>

        {/* Stage */}
        <ScrollReveal delayMs={100} size="lift">
          <div
            ref={stageRef}
            tabIndex={0}
            role="group"
            aria-label={`Film player: ${film.title}. Space to play or pause, M to mute, F for full screen.`}
            onKeyDown={onKeyDown}
            onMouseMove={revealControls}
            onPointerDown={revealControls}
            onMouseLeave={() => playing && setControlsVisible(false)}
            className="group/stage relative mx-auto aspect-video max-h-[78vh] w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#2a1c10_0%,#0a0603_100%)] outline-offset-4 border border-safari-cream/15"
          >
            {near && (
              <video
                key={film.id}
                ref={videoRef}
                src={withStill(film)}
                muted={muted}
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onLoadedMetadata={onLoadedMetadata}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onEnded={onEnded}
                className="absolute inset-0 h-full w-full cursor-pointer object-contain"
              />
            )}

            {/* Big play button before the first play / while paused */}
            {!playing && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label={`Play ${film.title}`}
                className="absolute inset-0 m-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-safari-cream/70 bg-black/35 text-safari-cream backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-safari-gold hover:text-safari-gold cursor-pointer"
              >
                <Play className="h-8 w-8 translate-x-[2px]" fill="currentColor" aria-hidden="true" />
              </button>
            )}

            {/* Title card (before first play) */}
            {!started && (
              <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-5 sm:p-7">
                <div className="font-sans font-light text-[10px] tracking-[0.34em] uppercase text-safari-gold">Now showing</div>
                <div className="mt-1 font-serif-luxury text-xl sm:text-2xl tracking-[0.12em] uppercase text-safari-cream">{film.title}</div>
              </div>
            )}

            {/* Controls */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-10 sm:px-6 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
                className="times-range w-full"
                style={{ ["--times-progress" as string]: `${progress}%` }}
              />
              <div className="mt-1 flex items-center gap-4 text-safari-cream">
                <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="cursor-pointer p-1 hover:text-safari-gold transition-colors">
                  {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
                </button>
                <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="cursor-pointer p-1 hover:text-safari-gold transition-colors">
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <span className="font-sans text-xs tracking-[0.1em] tabular-nums text-safari-cream/85">
                  {fmt(time)} / {fmt(duration)}
                </span>
                <span className="ml-auto hidden sm:block font-serif-luxury text-sm tracking-[0.18em] uppercase text-safari-cream/85">{film.title}</span>
                <button type="button" onClick={goFullscreen} aria-label="Full screen" className="cursor-pointer p-1 hover:text-safari-gold transition-colors sm:ml-2 ml-auto">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-5 flex items-start justify-between gap-6 flex-wrap">
          <p className="max-w-xl font-sans font-light text-sm leading-[1.9] text-safari-cream/75">
            <span className="font-serif-luxury tracking-[0.14em] uppercase text-safari-gold mr-3">{film.title}</span>
            {film.caption}
          </p>
          <p className="hidden md:block font-sans font-light text-[11px] tracking-[0.22em] uppercase text-safari-cream/45">
            Space · play &nbsp;/&nbsp; M · sound &nbsp;/&nbsp; F · full screen
          </p>
        </div>

        {/* Playlist */}
        <ScrollReveal delayMs={150} size="lift">
          <div
            className="mt-10 -mx-4 sm:-mx-8 lg:mx-0 flex gap-4 overflow-x-auto snap-x px-4 sm:px-8 lg:px-0 pb-4 custom-scrollbar"
            role="list"
            aria-label="Films"
          >
            {TIMES_FILMS.map((f, i) => (
              <div role="listitem" key={f.id}>
                <FilmTile film={f} index={i} active={i === index} ready={near} onSelect={() => (i === index ? togglePlay() : select(i, true))} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
