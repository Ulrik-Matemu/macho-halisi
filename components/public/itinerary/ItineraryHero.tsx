"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ItineraryHeroCoverImage {
  url: string;
  altText: string | null;
}

interface ItineraryHeroProps {
  elementId: string;
  coverImage: ItineraryHeroCoverImage | null;
  title: string;
  destinationNames: string[];
  nights: number | null;
  price: string | null;
  priceOnRequest: boolean;
  bestMonths: string | null;
}

/**
 * The hero banner, split out from the page as a client component purely
 * to drive a subtle scroll parallax on the cover image (translate + scale)
 * — a small, presentational-only enhancement with no data dependency, so
 * it doesn't cost the page its server-rendered content or metadata.
 */
export default function ItineraryHero({
  elementId,
  coverImage,
  title,
  destinationNames,
  nights,
  price,
  priceOnRequest,
  bestMonths,
}: ItineraryHeroProps) {
  const imageWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = imageWrapRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = window.scrollY;
      // Capped so the image never drifts far enough to reveal its edges,
      // and stops moving once the hero has scrolled out of view.
      const translate = Math.min(offset * 0.25, 160);
      el.style.transform = `translate3d(0, ${translate}px, 0) scale(1.08)`;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id={elementId} className="relative h-[88vh] min-h-[620px] overflow-hidden">
      <div ref={imageWrapRef} className="absolute inset-0 will-change-transform">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.altText || title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a2f22] to-[#181410]" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />

      <div className="absolute inset-x-0 bottom-0 px-6 sm:px-16 pb-14 sm:pb-16">
        <div className="max-w-[1240px] mx-auto">
          {destinationNames.length > 0 && (
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#E3C99A] uppercase mb-5">
              {destinationNames.join(" · ")}
            </div>
          )}
          <h1 className="font-serif-luxury font-light text-2xl md:text-3xl leading-[1.02] tracking-[0.08em] sm:tracking-[0.1em] text-[#FBF7F0] uppercase mb-7 max-w-5xl">
            {title}
          </h1>

          <div className="flex flex-wrap gap-x-10 gap-y-6 items-baseline">
            {nights !== null && (
              <div>
                <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/75 uppercase mb-2">
                  Duration
                </div>
                <div className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#FBF7F0]">
                  {nights + 1} Days / {nights} Nights
                </div>
              </div>
            )}
            {(priceOnRequest || price) && (
              <div>
                <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/75 uppercase mb-2">
                  From
                </div>
                <div className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#E3C99A]">
                  {priceOnRequest ? "On Request" : `$${price} pp`}
                </div>
              </div>
            )}
            {bestMonths && (
              <div>
                <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/75 uppercase mb-2">
                  Best months
                </div>
                <div className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#FBF7F0]">
                  {bestMonths}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
