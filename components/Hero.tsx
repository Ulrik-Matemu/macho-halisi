"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface HeroProps {
  onOpenMenu?: () => void;
  onOpenEnquiry?: () => void;
  onVideoReady?: () => void;
  isLoaded?: boolean;
}

const HERO_VIDEOS = [
  { id: "lion", src: "/media/hero-vids/lion.mp4", duration: 12.8 },
  { id: "landscape", src: "/media/hero-vids/5214258-sd_960_540_25fps.mp4", duration: 21.48 },
];

export default function Hero({ onVideoReady, isLoaded }: HeroProps) {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layerASrc, setLayerASrc] = useState(HERO_VIDEOS[0].src);
  const [layerBSrc, setLayerBSrc] = useState(HERO_VIDEOS[1].src);

  const isTransitioningRef = useRef(false);
  const [isEntered, setIsEntered] = useState(false);
  const hasNotifiedReadyRef = useRef(false);

  // Synchronize entrance animation with loader completion
  useEffect(() => {
    if (isLoaded !== undefined) {
      if (isLoaded) {
        const timer = setTimeout(() => setIsEntered(true), 150);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => setIsEntered(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

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
        // Switched to B, so Layer A now prepares the subsequent video
        setLayerASrc(HERO_VIDEOS[futureIndex].src);
      } else {
        // Switched to A, so Layer B now prepares the subsequent video
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
    // Cross-fade when 1.5s remains in the active video
    if (timeLeft <= 1.5 && timeLeft > 0) {
      triggerTransition();
    }
  };

  const handleEnded = (layer: "A" | "B") => {
    if (layer === activeLayer && !isTransitioningRef.current) {
      triggerTransition();
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden select-none bg-[#050505]">
      {/* Background Dual-Video Player with Luxurious Cross-Fade Transitions */}
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
          preload="auto"
          onTimeUpdate={() => handleTimeUpdate("B")}
          onEnded={() => handleEnded("B")}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ease-in-out ${
            activeLayer === "B"
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-[1.02] z-0 pointer-events-none"
          }`}
        />

        {/* Cinematic dark overlay to make white typography stand out */}
        <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-20 pointer-events-none" />
      </div>

      {/* Center Hero Content: Orchestrated Subtle Cinematic Entry */}
      <div className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-8 w-full text-center flex flex-col items-center justify-center">
        {/* Pre-title Tagline: Step 1 */}
        <div
          className={`flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 transition-all duration-900 transition-luxury delay-300 ${
            isEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span
            className={`h-[1px] bg-[#e0ac69]/50 transition-all duration-900 transition-luxury delay-300 ${
              isEntered ? "w-8 sm:w-12" : "w-0"
            }`}
          />
          <p className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[#f1c27d] font-sans font-medium">
            WELCOME TO TANZANIA
          </p>
          <span
            className={`h-[1px] bg-[#e0ac69]/50 transition-all duration-900 transition-luxury delay-300 ${
              isEntered ? "w-8 sm:w-12" : "w-0"
            }`}
          />
        </div>

        {/* Monumental Editorial Brand Title: Step 2 with Soft Focus Dissipation */}
        <h1
          className={`font-serif-luxury text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-[0.2em] sm:tracking-[0.28em] uppercase drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)] leading-none transition-all duration-1100 transition-luxury delay-700 ${
            isEntered
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-6 blur-[8px]"
          }`}
        >
          MACHO HALISI
        </h1>
      </div>
    </section>
  );
}
