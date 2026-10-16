"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEnquiry } from "@/components/EnquiryProvider";

interface HeroProps {
  onVideoReady?: () => void;
}

const HERO_VIDEO = "/media/hero-vids/new-cheetah-vid.mp4";

// First frame of HERO_VIDEO, so the poster hands off to playback with no
// visible jump.
const HERO_POSTER = "/media/hero-vids/new-cheetah-poster.webp";

// 24px-wide extract of the poster frame, upscaled — already soft enough to
// read as a blurred placeholder with no CSS filter needed. Paints with the
// HTML (0 requests) so there is never a black rectangle before the poster
// or video arrives, even on a throttled connection.
const HERO_LQIP =
  "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAwCdASoYAA4APtFUo0uoJKMhsAgBABoJZwAAPv0ShnsPvcA4eO1kAP6l+GXgUjQZBXAUiPfO4cexClAqE+tXwkYBRuzfeMAZW+WMfOH7h2kD9t1SOCM0l7AxteOaZ9sOBBAZEuioVo+NEotZGpJ2u17N+8AD9GU/chpwAAA=";

/** Minimum time each phase stays on screen before the next can start (ms). */
const PHASE_DWELL_MS = 900;

export default function Hero({ onVideoReady }: HeroProps) {
  const { openEnquiry } = useEnquiry();
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();

  const [isEntered, setIsEntered] = useState(false);
  const hasNotifiedReadyRef = useRef(false);

  // Scroll tracking across the 220vh hero storytelling range. rAF-throttled
  // (mirrors Navbar.tsx's pattern) and quantized to 3 decimal places so
  // Lenis's per-frame scroll events don't re-render this tree on every
  // pixel of movement — only when the rounded progress actually changes.
  const [scrollProgress, setScrollProgress] = useState(0);

  // The first-screen story plays as three discrete PHASES rather than
  // tracking scroll position 1:1 — a half-faded line while the visitor
  // pauses to read is the awkward feeling this avoids.
  //   0 = title alone, 1 = title + offer/CTAs, 2 = the story panel.
  // Scroll only *selects* a phase (with hysteresis, so hovering at a
  // threshold can't flicker); the phase itself plays as a timed, eased
  // transition. A short dwell between steps means a hard flick still
  // lands on every phase in turn instead of skipping the offer entirely.
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const phaseLockedUntilRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      ticking = false;
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const raw = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      const progress = Math.round(raw * 1000) / 1000;
      setScrollProgress((prev) => (prev === progress ? prev : progress));
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    measure();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger entrance animation smoothly on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const notifyVideoReady = useCallback(() => {
    if (!hasNotifiedReadyRef.current) {
      hasNotifiedReadyRef.current = true;
      onVideoReady?.();
    }
  }, [onVideoReady]);

  // Initial video setup & autoplay handling. Skipped entirely under
  // prefers-reduced-motion: the video stays paused on its poster frame
  // rather than looping motion nobody asked for.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    video.defaultMuted = true;
    video.muted = true;

    if (video.readyState >= 3) {
      notifyVideoReady();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay deferred, waiting for user gesture:", err);
        const handleInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("touchstart", handleInteraction);
          window.removeEventListener("scroll", handleInteraction);
        };
        window.addEventListener("click", handleInteraction, { once: true });
        window.addEventListener("touchstart", handleInteraction, { once: true });
        window.addEventListener("scroll", handleInteraction, { once: true });
      });
    }
  }, [notifyVideoReady, reducedMotion]);

  // Which phase the current scroll position asks for. Advance and retreat
  // thresholds differ (hysteresis): 0.05 / 0.03 for the offer, 0.30 / 0.26
  // for the story.
  let targetPhase: 0 | 1 | 2 = phase;
  if (phase === 0 && scrollProgress >= 0.05) targetPhase = 1;
  if (phase <= 1 && scrollProgress >= 0.3) targetPhase = 2;
  if (phase === 1 && scrollProgress < 0.03) targetPhase = 0;
  if (phase === 2 && scrollProgress < 0.26) targetPhase = scrollProgress < 0.03 ? 0 : 1;

  useEffect(() => {
    if (targetPhase === phase) return;
    // One step at a time, no sooner than PHASE_DWELL_MS after the last
    // change, so each phase gets to be read.
    const wait = reducedMotion ? 0 : Math.max(0, phaseLockedUntilRef.current - Date.now());
    const timer = setTimeout(() => {
      phaseLockedUntilRef.current = Date.now() + PHASE_DWELL_MS;
      setPhase((cur) => (cur === targetPhase ? cur : ((cur + Math.sign(targetPhase - cur)) as 0 | 1 | 2)));
    }, wait);
    return () => clearTimeout(timer);
  }, [targetPhase, phase, reducedMotion]);

  const offerOn = reducedMotion || phase >= 1;
  const stage1Out = phase >= 2;

  // Stage 2 Interpolations (Bottom Right): Rises up into position on scroll,
  // holds at full visibility for a wide plateau, then fades back out with
  // enough clearance before the hero releases that the narrative panel is
  // fully gone before FeaturedItineraries' curtain-reveal (its negative
  // top margin, ~15-18% of this range) starts sliding up over the sticky
  // video underneath.
  //
  // Arrives earlier and holds far longer than it used to (0.10–0.38 fade
  // in, then a 0.27-wide plateau at full opacity/no motion) — the previous
  // curve only arrived at 0.65 and started leaving at 0.85, a 0.20 window
  // that read as a blip easy to scroll straight through rather than an
  // intentional reveal.
  const stage2FadeOutT = Math.min(1, Math.max(0, (scrollProgress - 0.65) / 0.13));
  const stage2Opacity = 1 - stage2FadeOutT;
  const stage2TranslateY = -stage2FadeOutT * 24;
  const stage2Blur = stage2FadeOutT * 6;

  // Scroll-linked opacity is driven by the user's own scroll input, not a
  // vestibular trigger, so it stays for reduced-motion users. Parallax
  // translation and blur are exactly that trigger, so both are neutralized.

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-[220vh] bg-safari-night select-none"
    >
      {/* Sticky Viewport: Keeps Background Video & Layout Continuous */}
      <div
        className="sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-end"
        style={{ backgroundImage: `url(${HERO_LQIP})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Background video — carries the poster frame, so a paused/loading
            state (including reduced-motion, which never calls .play())
            always shows a real graded still instead of black. */}
        <div
          className={`absolute inset-0 w-full h-full z-0 overflow-hidden transition-all duration-1000 transition-luxury ${
            isEntered ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
          }`}
        >
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay={!reducedMotion}
            loop
            muted
            playsInline
            preload="auto"
            // @ts-expect-error -- fetchPriority is a valid HTML/DOM attribute
            // (React types haven't caught up); it's the same signal
            // <link rel="preload" fetchpriority="high"> gives the poster
            // below, telling the browser's request scheduler this is the
            // first thing to fetch, not just another background asset.
            fetchPriority="high"
            aria-hidden="true"
            onLoadedData={notifyVideoReady}
            onCanPlayThrough={notifyVideoReady}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Bottom-only scrim for the type; the top of the footage stays untouched */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />
        </div>

        {/* STAGE 1: Left-Corner Aligned Brand Mark + offer (phases 0-1). Leaves
            as a timed transition when phase 2 begins. */}
        <div
          style={{
            opacity: stage1Out ? 0 : 1,
            transform: reducedMotion ? "none" : stage1Out ? "translateY(-28px)" : "translateY(0)",
            filter: reducedMotion ? "none" : stage1Out ? "blur(8px)" : "blur(0)",
            pointerEvents: stage1Out ? "none" : "auto",
          }}
          className="relative z-30 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-[clamp(2rem,8dvh,6rem)] sm:pb-6 lg:pb-8 flex flex-col items-start text-left transition-[opacity,transform,filter] duration-1000 transition-luxury motion-reduce:transition-none"
        >
          {/* Brand title: two stacked lines, Helvetica Bold, bottom-left */}
          <h1
            className={`font-bold uppercase text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.04em] leading-[0.92] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)] transition-all duration-1100 transition-luxury delay-700 ${
              isEntered
                ? "opacity-100 translate-y-0 blur-0"
                : "opacity-0 translate-y-6 blur-[8px]"
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <span className="block">Macho</span>
            <span className="block">Halisi</span>
          </h1>

          {/* Phase 1 — the offer. The title above lands alone on load. On
              the visitor's first deliberate scroll this unfolds beneath it
              (grid row 0fr -> 1fr, so the title glides up to make room
              rather than jumping), a gold hairline draws, then the line and
              the calls to action rise in one after the other. */}
          <div
            className="grid w-full transition-[grid-template-rows] duration-1200 transition-luxury motion-reduce:transition-none"
            style={{ gridTemplateRows: offerOn ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pt-5 sm:pt-6 pb-1">
                <p
                  className="max-w-xl font-sans font-light text-sm sm:text-lg text-white/90 tracking-[0.04em] leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-1000 delay-400 transition-luxury motion-reduce:transition-none"
                  style={{ opacity: offerOn ? 1 : 0, transform: `translateY(${offerOn ? 0 : 12}px)` }}
                >
                  Private Tanzania safaris, led by local Tanzanian guides.
                </p>
                <div
                  className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 transition-[opacity,transform] duration-1000 delay-700 transition-luxury motion-reduce:transition-none"
                  style={{
                    opacity: offerOn ? 1 : 0,
                    transform: `translateY(${offerOn ? 0 : 12}px)`,
                    pointerEvents: offerOn && !stage1Out ? "auto" : "none",
                  }}
                >
                  <button
                    type="button"
                    tabIndex={offerOn ? 0 : -1}
                    onClick={() => openEnquiry()}
                    className="group inline-flex items-center gap-3 px-6 py-3 border border-safari-gold/70 hover:border-safari-gold hover:bg-safari-gold/15 text-white font-serif-luxury text-xs sm:text-[13px] tracking-[0.28em] uppercase rounded transition-colors cursor-pointer"
                  >
                    Enquire
                    <ArrowRight className="w-3.5 h-3.5 text-safari-gold transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                  <Link
                    href="/itineraries"
                    tabIndex={offerOn ? 0 : -1}
                    className="group relative py-2 text-white/85 hover:text-safari-gold font-serif-luxury text-xs sm:text-[13px] tracking-[0.28em] uppercase transition-colors"
                  >
                    View Itineraries
                    <span
                      aria-hidden="true"
                      className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-safari-gold transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue — the hero is a 220vh scroll story; without this, a
            visitor who never scrolls past the first screen never sees
            Stage 2 at all. Purely decorative, so aria-hidden; fades out
            the instant scrolling starts rather than lingering. */}
       

        {/* STAGE 2 (phase 2): the story. Outer layer = timed phase entrance
            (fade + rise + de-blur, starting a beat after Stage 1 leaves);
            inner layer = scroll-linked exit, so the panel is gone before
            the Featured Itineraries curtain slides over the sticky video. */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: reducedMotion ? "none" : phase >= 2 ? "translateY(0)" : "translateY(36px)",
            filter: reducedMotion ? "none" : phase >= 2 ? "blur(0)" : "blur(8px)",
            pointerEvents: phase >= 2 && stage2FadeOutT < 1 ? "auto" : "none",
            transitionDelay: phase >= 2 ? "350ms" : "0ms",
          }}
          className="absolute inset-0 z-30 transition-[opacity,transform,filter] duration-1200 transition-luxury motion-reduce:transition-none"
        >
        <div
          style={{
            opacity: stage2Opacity,
            transform: reducedMotion ? "none" : `translateY(${stage2TranslateY}px)`,
            filter: reducedMotion ? "none" : `blur(${stage2Blur}px)`,
          }}
          className="absolute inset-0 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20 lg:pb-24 flex flex-col justify-end items-end text-right transition-all duration-150 pointer-events-none"
        >
          <div className="max-w-2xl border-r-2 border-safari-ochre/75 pr-6 sm:pr-8 py-2">
            <h2 className="font-serif-luxury font-medium text-lg sm:text-2xl md:text-3xl text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              Private safaris led by native Tanzanian guides
            </h2>
            <p className=" text-xs sm:text-sm tracking-[0.28em] uppercase text-safari-sand mt-2 mb-4 sm:mb-5">
              – YOUR EYES ON TANZANIA –
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/90 font-sans font-light leading-relaxed mb-3 drop-shadow">
              Macho Halisi <span className="font-serif-italic text-safari-champagne">(true eyes in Swahili)</span> is a long term provider of safaris in Tanzania. Locally owned and operated, we are native Tanzanians who are proud of our country and love to share our knowledge and passion for safari with you. A safari with Macho Halisi will be the trip of a lifetime, forging memories and experiences that will change you forever.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-sans font-light leading-relaxed drop-shadow">
              We look forward to showing you the interesting cultures, stunning landscapes and masses of wildlife that make our home, Tanzania, such an alluring destination.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
