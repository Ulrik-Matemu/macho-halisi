"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useEnquiry } from "./EnquiryProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface HeroProps {
  onVideoReady?: () => void;
}

const HERO_VIDEOS = [
  { id: "landscape", src: "/media/hero-vids/elephant.mp4", duration: 24.6 },
  { id: "lion", src: "/media/hero-vids/lion.mp4", duration: 12.8 },
];

const HERO_POSTER = "/media/hero-vids/elephant-poster.webp";

// 24px-wide extract of the poster frame, upscaled — already soft enough to
// read as a blurred placeholder with no CSS filter needed. Paints with the
// HTML (0 requests) so there is never a black rectangle before the poster
// or video arrives, even on a throttled connection.
const HERO_LQIP =
  "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAQBACdASoYAA4APrVInkmnJCKhMAgA4BaJYwC7ACHcGmnyMREwcsD0MAD+VdqWFu+sPam+vwrsI+q/YdgBPPuUq7s2u8APD5ofozZBzysZTjCaSc9RRRt/5PjNH0EjGLbdllPyHe41LmBnUsRQW5kf6zDAAA==";

export default function Hero({ onVideoReady }: HeroProps) {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const { openEnquiry } = useEnquiry();
  const reducedMotion = useReducedMotion();

  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layerASrc, setLayerASrc] = useState(HERO_VIDEOS[0].src);
  const [layerBSrc, setLayerBSrc] = useState(HERO_VIDEOS[1].src);

  const isTransitioningRef = useRef(false);
  const [isEntered, setIsEntered] = useState(false);
  const hasNotifiedReadyRef = useRef(false);

  // Scroll tracking across the 220vh hero storytelling range. rAF-throttled
  // (mirrors Navbar.tsx's pattern) and quantized to 3 decimal places so
  // Lenis's per-frame scroll events don't re-render this tree on every
  // pixel of movement — only when the rounded progress actually changes.
  const [scrollProgress, setScrollProgress] = useState(0);

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
  // (set below) rather than a hard cross-fade loop nobody asked for.
  useEffect(() => {
    const videoA = videoRefA.current;
    if (!videoA || reducedMotion) return;

    videoA.defaultMuted = true;
    videoA.muted = true;

    const playVideo = () => {
      const playPromise = videoA.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay deferred, waiting for user gesture:", err);
          const handleInteraction = () => {
            const currentActive = activeLayer === "A" ? videoRefA.current : videoRefB.current;
            currentActive?.play().catch(() => {});
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("scroll", handleInteraction);
          };
          window.addEventListener("click", handleInteraction, { once: true });
          window.addEventListener("touchstart", handleInteraction, { once: true });
          window.addEventListener("scroll", handleInteraction, { once: true });
        });
      }
    };

    if (videoA.readyState >= 3) {
      notifyVideoReady();
    }

    playVideo();
  }, [notifyVideoReady, activeLayer, reducedMotion]);

  // Handle transition trigger between players
  const triggerTransition = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
    const targetLayer = activeLayer === "A" ? "B" : "A";
    const targetVideo = targetLayer === "A" ? videoRefA.current : videoRefB.current;
    const currentVideo = activeLayer === "A" ? videoRefA.current : videoRefB.current;

    if (targetVideo) {
      targetVideo.currentTime = 0;
      targetVideo.defaultMuted = true;
      targetVideo.muted = true;
      const playPromise = targetVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn("Video play error:", err));
      }
    }

    // Switch active layer to initiate smooth CSS cross-dissolve
    setActiveLayer(targetLayer);
    setCurrentIndex(nextIndex);

    // After 1500ms cross-fade completes, pause previous layer and preload next-next video
    setTimeout(() => {
      if (currentVideo) {
        currentVideo.pause();
      }
      const futureIndex = (nextIndex + 1) % HERO_VIDEOS.length;
      if (targetLayer === "B") {
        setLayerASrc(HERO_VIDEOS[futureIndex].src);
      } else {
        setLayerBSrc(HERO_VIDEOS[futureIndex].src);
      }
      isTransitioningRef.current = false;
    }, 1550);
  }, [activeLayer, currentIndex]);

  const handleTimeUpdate = (layer: "A" | "B") => {
    if (reducedMotion || layer !== activeLayer || isTransitioningRef.current) return;
    const currentVideo = layer === "A" ? videoRefA.current : videoRefB.current;
    if (!currentVideo || !currentVideo.duration) return;

    const timeLeft = currentVideo.duration - currentVideo.currentTime;
    if (timeLeft <= 1.5 && timeLeft > 0) {
      triggerTransition();
    }
  };

  const handleEnded = (layer: "A" | "B") => {
    if (!reducedMotion && layer === activeLayer && !isTransitioningRef.current) {
      triggerTransition();
    }
  };

  // Stage 1 Interpolations (Bottom Left): Fades up and dissolves out on initial scroll
  const stage1Opacity = Math.max(0, 1 - scrollProgress * 3.2);
  const stage1TranslateY = -scrollProgress * 65;
  const stage1Blur = scrollProgress * 10;

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
  const stage2T = Math.min(1, Math.max(0, (scrollProgress - 0.1) / 0.28));
  const stage2FadeOutT = Math.min(1, Math.max(0, (scrollProgress - 0.65) / 0.13));
  const stage2Opacity = stage2T * (1 - stage2FadeOutT);
  const stage2TranslateY = (1 - stage2T) * 40 - stage2FadeOutT * 24;
  const stage2Blur = (1 - stage2T) * 8 + stage2FadeOutT * 6;

  // Scroll-linked opacity is driven by the user's own scroll input, not a
  // vestibular trigger, so it stays for reduced-motion users. Parallax
  // translation and blur are exactly that trigger, so both are neutralized.
  const stage1TransformValue = reducedMotion ? "none" : `translateY(${stage1TranslateY}px)`;
  const stage1FilterValue = reducedMotion ? "none" : `blur(${stage1Blur}px)`;
  const stage2TransformValue = reducedMotion ? "none" : `translateY(${stage2TranslateY}px)`;
  const stage2FilterValue = reducedMotion ? "none" : `blur(${stage2Blur}px)`;

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-[220vh] bg-[#050505] select-none"
    >
      {/* Sticky Viewport: Keeps Background Video & Layout Continuous */}
      <div
        className="sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-end"
        style={{ backgroundImage: `url(${HERO_LQIP})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Background Dual-Video Player with Cross-Fade Transitions */}
        <div
          className={`absolute inset-0 w-full h-full z-0 overflow-hidden transition-all duration-1000 transition-luxury ${
            isEntered ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
          }`}
        >
          {/* Video Layer A — carries the poster frame, so a paused/loading
              state (including reduced-motion, which never calls .play())
              always shows a real graded still instead of black. */}
          <video
            ref={videoRefA}
            src={layerASrc}
            poster={HERO_POSTER}
            autoPlay={!reducedMotion}
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
            onTimeUpdate={() => handleTimeUpdate("A")}
            onEnded={() => handleEnded("A")}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ease-in-out ${
              activeLayer === "A"
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-[1.02] z-0 pointer-events-none"
            }`}
          />

          {/* Video Layer B — no poster: it would flash the wrong still
              under the cross-fade, and this layer is opacity-0 until it
              plays anyway. */}
          <video
            ref={videoRefB}
            src={layerBSrc}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            onTimeUpdate={() => handleTimeUpdate("B")}
            onEnded={() => handleEnded("B")}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ease-in-out ${
              activeLayer === "B"
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-[1.02] z-0 pointer-events-none"
            }`}
          />

          {/* Cinematic dark overlays to balance both left & right typography */}
          <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50 z-20 pointer-events-none" />
        </div>

        {/* STAGE 1: Left-Corner Aligned Brand Mark (Fades upward on scroll) */}
        <div
          style={{
            opacity: stage1Opacity,
            transform: stage1TransformValue,
            filter: stage1FilterValue,
            pointerEvents: scrollProgress > 0.25 ? "none" : "auto",
          }}
          className="relative z-30 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-[clamp(4.5rem,20dvh,12rem)] sm:pb-16 lg:pb-20 flex flex-col items-start text-left transition-all duration-150"
        >
          {/* Pre-title Tagline */}
          <div
            className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 transition-all duration-900 transition-luxury delay-300 ${
              isEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className={`h-[1px] bg-[#e0ac69]/60 transition-all duration-900 transition-luxury delay-300 ${
                isEntered ? "w-54 sm:w-98" : "w-0"
              }`}
            />
          </div>

          {/* Monumental Left-Aligned Editorial Brand Title */}
          <h1
            className={`font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.14em] sm:tracking-[0.18em] uppercase drop-shadow-[0_4px_40px_rgba(0,0,0,0.85)] leading-[0.95] transition-all duration-1100 transition-luxury delay-700 ${
              isEntered
                ? "opacity-100 translate-y-0 blur-0"
                : "opacity-0 translate-y-6 blur-[8px]"
            }`}
          >
            MACHO HALISI
          </h1>

          {/* Primary/secondary CTAs — the only calls to action above the
              fold besides the Navbar's ENQUIRE, which auto-hides on scroll.
              Inherit the same fade/guard as the rest of Stage 1 via the
              parent's inline style and pointerEvents above. */}
         
        </div>

        {/* Scroll cue — the hero is a 220vh scroll story; without this, a
            visitor who never scrolls past the first screen never sees
            Stage 2 at all. Purely decorative, so aria-hidden; fades out
            the instant scrolling starts rather than lingering. */}
       

        {/* STAGE 2: Right-Corner Aligned Narrative Storytelling (Reveals on scroll) */}
        <div
          style={{
            opacity: stage2Opacity,
            transform: stage2TransformValue,
            filter: stage2FilterValue,
            pointerEvents: scrollProgress > 0.3 && stage2FadeOutT < 1 ? "auto" : "none",
          }}
          className="absolute inset-0 z-30 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20 lg:pb-24 flex flex-col justify-end items-end text-right transition-all duration-150 pointer-events-none"
        >
          <div className="max-w-2xl border-r-2 border-[#c68642]/75 pr-6 sm:pr-8 py-2">
            <h2 className="font-serif-luxury font-medium text-lg sm:text-2xl md:text-3xl text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              MACHO HALISI - SAFARI AND TOUR OPERATOR TANZANIA
            </h2>
            <p className=" text-xs sm:text-sm tracking-[0.28em] uppercase text-[#f1c27d] mt-2 mb-4 sm:mb-5">
              – YOUR EYES ON TANZANIA –
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/90 font-sans font-light leading-relaxed mb-3 drop-shadow">
              Macho Halisi <span className="font-serif-italic text-[#ffdbac]">(true eyes in Swahili)</span> is a long term provider of safaris in Tanzania. Locally owned and operated, we are native Tanzanians who are proud of our country and love to share our knowledge and passion for safari with you. A safari with Macho Halisi will be the trip of a lifetime, forging memories and experiences that will change you forever.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-sans font-light leading-relaxed drop-shadow">
              We look forward to showing you the interesting cultures, stunning landscapes and masses of wildlife that make our home, Tanzania, such an alluring destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
