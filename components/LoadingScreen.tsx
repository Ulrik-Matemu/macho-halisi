"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  isReady: boolean;
  onComplete: () => void;
  backgroundColor?: string;
}

export default function LoadingScreen({
  isReady,
  onComplete,
  backgroundColor = "#dfdad3",
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const startTime = performance.now();
    const minDuration = 1800; // minimum duration in ms for luxury perception
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      setProgress((prev) => {
        if (hasFinishedRef.current) return 100;

        let target = 0;
        if (!isReady) {
          // While video is still buffering, smoothly ease up to ~80%
          target = Math.min(timeRatio * 75 + Math.sin(elapsed / 250) * 2, 85);
        } else {
          // Video is ready: smoothly drive to 100%
          const remainingFactor = (elapsed / (minDuration * 1.1));
          target = Math.min(Math.max(prev + 2.5, remainingFactor * 100), 100);
        }

        const nextVal = Math.min(Math.max(prev, target), 100);

        if (nextVal >= 100 && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsExited(true);
              onComplete();
            }, 900);
          }, 300);
          return 100;
        }

        return nextVal;
      });

      if (!hasFinishedRef.current) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    // Hard fallback: never leave user stuck longer than 4.5s
    const fallbackTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setProgress(100);
        setIsExiting(true);
        setTimeout(() => {
          setIsExited(true);
          onComplete();
        }, 900);
      }
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
    };
  }, [isReady, onComplete]);

  if (isExited) return null;

  return (
    <div
      style={{ backgroundColor }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-900 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isExiting
          ? "opacity-0 scale-[1.03] pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* Subtle radial ambient atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.06)_100%)] pointer-events-none" />

      {/* Center Logo Display: Solo Emblem with Filling Animation */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Dual-Layer Logo Container with Refined Proportions */}
        <div className="relative w-52 sm:w-64 md:w-72 aspect-[1737/906] rounded overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
          {/* Base Ghost Layer: Faded Silhouette */}
          <div className="absolute inset-0 opacity-20 filter grayscale contrast-125 brightness-95">
            <Image
              src="/media/macho-halisi-logo-for-loader.webp"
              alt="Macho Halisi Silhouette"
              fill
              priority
              className="object-contain object-center"
            />
          </div>

          {/* Luminous Fill Layer: Ascends smoothly from bottom to top */}
          <div
            className="absolute inset-0 transition-all duration-75 ease-out"
            style={{
              clipPath: `inset(${Math.max(0, 100 - progress)}% 0 0 0)`,
            }}
          >
            <Image
              src="/media/macho-halisi-logo-for-loader.webp"
              alt="Macho Halisi Logo"
              fill
              priority
              className="object-contain object-center drop-shadow-md"
            />

            {/* Glowing Golden Waterline / Shimmer along the fill threshold */}
            {progress > 3 && progress < 99 && (
              <div
                style={{ top: `${Math.max(0, 100 - progress)}%` }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e0ac69] to-transparent shadow-[0_0_12px_#c68642] pointer-events-none -translate-y-1/2"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
