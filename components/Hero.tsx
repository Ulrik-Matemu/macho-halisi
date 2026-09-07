"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface HeroProps {
  onOpenMenu?: () => void;
  onOpenEnquiry?: () => void;
  onVideoReady?: () => void;
}

const HERO_VIDEOS = [
  { id: "lion", src: "/media/hero-vids/lion.mp4", duration: 12.8 },
  { id: "landscape", src: "/media/hero-vids/5214258-sd_960_540_25fps.mp4", duration: 21.48 },
];

export default function Hero({ onVideoReady }: HeroProps) {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layerASrc, setLayerASrc] = useState(HERO_VIDEOS[0].src);
  const [layerBSrc, setLayerBSrc] = useState(HERO_VIDEOS[1].src);

  const isTransitioningRef = useRef(false);
  const [isEntered, setIsEntered] = useState(false);
  const hasNotifiedReadyRef = useRef(false);

  // Scroll tracking across the 220vh hero storytelling range
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

  // Initial video setup & autoplay handling
  useEffect(() => {
    const videoA = videoRefA.current;
    if (!videoA) return;

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
  }, [notifyVideoReady, activeLayer]);

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
    if (layer !== activeLayer || isTransitioningRef.current) return;
    const currentVideo = layer === "A" ? videoRefA.current : videoRefB.current;
    if (!currentVideo || !currentVideo.duration) return;

    const timeLeft = currentVideo.duration - currentVideo.currentTime;
    if (timeLeft <= 1.5 && timeLeft > 0) {
      triggerTransition();
    }
  };

  const handleEnded = (layer: "A" | "B") => {
    if (layer === activeLayer && !isTransitioningRef.current) {
      triggerTransition();
    }
  };

  // Stage 1 Interpolations (Bottom Left): Fades up and dissolves out on initial scroll
  const stage1Opacity = Math.max(0, 1 - scrollProgress * 3.2);
  const stage1TranslateY = -scrollProgress * 65;
  const stage1Blur = scrollProgress * 10;

  // Stage 2 Interpolations (Bottom Right): Rises up into position on scroll
  const stage2T = Math.min(1, Math.max(0, (scrollProgress - 0.2) / 0.45));
  const stage2Opacity = stage2T;
  const stage2TranslateY = (1 - stage2T) * 40;
  const stage2Blur = (1 - stage2T) * 8;

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-[220vh] bg-[#050505] select-none"
    >
      {/* Sticky Viewport: Keeps Background Video & Layout Continuous */}
      <div className="sticky top-0 h-screen h-dvh w-full overflow-hidden flex flex-col justify-end">
        {/* Background Dual-Video Player with Cross-Fade Transitions */}
        <div
          className={`absolute inset-0 w-full h-full z-0 overflow-hidden transition-all duration-1000 transition-luxury ${
            isEntered ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
          }`}
        >
          {/* Video Layer A */}
          <video
            ref={videoRefA}
            src={layerASrc}
            autoPlay
            muted
            playsInline
            preload="auto"
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

          {/* Video Layer B */}
          <video
            ref={videoRefB}
            src={layerBSrc}
            muted
            playsInline
            preload="none"
            onTimeUpdate={() => handleTimeUpdate("B")}
            onEnded={() => handleEnded("B")}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ease-in-out ${
              activeLayer === "B"
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-[1.02] z-0 pointer-events-none"
            }`}
          />

          {/* Cinematic dark overlays to balance both left & right typography */}
          <div className="absolute inset-0 bg-black/35 z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50 z-20 pointer-events-none" />
        </div>

        {/* STAGE 1: Left-Corner Aligned Brand Mark (Fades upward on scroll) */}
        <div
          style={{
            opacity: stage1Opacity,
            transform: `translateY(${stage1TranslateY}px)`,
            filter: `blur(${stage1Blur}px)`,
            pointerEvents: scrollProgress > 0.25 ? "none" : "auto",
          }}
          className="relative z-30 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-[clamp(5.5rem,24dvh,14rem)] sm:pb-20 lg:pb-24 flex flex-col items-start text-left transition-all duration-150"
        >
          {/* Pre-title Tagline */}
          <div
            className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 transition-all duration-900 transition-luxury delay-300 ${
              isEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className={`h-[1px] bg-[#e0ac69]/60 transition-all duration-900 transition-luxury delay-300 ${
                isEntered ? "w-8 sm:w-14" : "w-0"
              }`}
            />
            <p className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[#f1c27d] font-sans font-medium">
              WELCOME TO TANZANIA
            </p>
          </div>

          {/* Monumental Left-Aligned Editorial Brand Title */}
          <h1
            className={`font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white tracking-[0.14em] sm:tracking-[0.18em] uppercase drop-shadow-[0_4px_40px_rgba(0,0,0,0.85)] leading-[0.95] transition-all duration-1100 transition-luxury delay-700 ${
              isEntered
                ? "opacity-100 translate-y-0 blur-0"
                : "opacity-0 translate-y-6 blur-[8px]"
            }`}
          >
            MACHO HALISI
          </h1>
        </div>

        {/* STAGE 2: Right-Corner Aligned Narrative Storytelling (Reveals on scroll) */}
        <div
          style={{
            opacity: stage2Opacity,
            transform: `translateY(${stage2TranslateY}px)`,
            filter: `blur(${stage2Blur}px)`,
            pointerEvents: scrollProgress > 0.3 ? "auto" : "none",
          }}
          className="absolute inset-0 z-30 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20 lg:pb-24 flex flex-col justify-end items-end text-right transition-all duration-150 pointer-events-none"
        >
          <div className="max-w-2xl border-r-2 border-[#c68642]/75 pr-6 sm:pr-8 py-2">
            <h2 className="font-serif-luxury font-light text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
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
