"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ItineraryDay, ItineraryImage } from "@/lib/itineraries/types";

interface ItineraryRouteSectionProps {
  days: ItineraryDay[];
  /** Full image list (cover included) — cycled per day by index, wrapping. */
  images: ItineraryImage[];
  routeMapUrl: string | null;
}

/**
 * "The route" — day-by-day section with a sticky image panel that
 * cross-fades as the visitor scrolls through day entries. There is no
 * per-day image field, so the design's cycling is driven off the
 * itinerary's own gallery: `images[dayIndex % images.length]`, which
 * degrades gracefully to a single static image when there's only one
 * photo (or none, in which case a placeholder gradient fills the panel).
 *
 * A single client component rather than splitting the panel from the day
 * list, because the "Day N of M" counter in the header, the panel
 * cross-fade, and which day entry is "active" are all driven by the same
 * scroll-tracked state.
 */
export default function ItineraryRouteSection({ days, images, routeMapUrl }: ItineraryRouteSectionProps) {
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const mid = window.innerHeight * 0.45;
      let next = 0;
      dayRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom > 80) {
          next = idx;
        }
      });
      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (days.length === 0) {
    return null;
  }

  const activeDayNumber = days[activeIndex]?.dayNumber ?? days[0]!.dayNumber;

  return (
    <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
      <div className="flex items-end justify-between gap-10 mb-14 flex-wrap">
        <div>
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-4">
            Day by day
          </div>
          <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-[#1E1913] uppercase">
            The route
          </h2>
        </div>
        <span className="font-sans font-light text-[11px] tracking-[0.28em] text-[#1E1913]/70 uppercase whitespace-nowrap">
          Day {String(activeDayNumber).padStart(2, "0")} of {String(days.length).padStart(2, "0")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-16 items-start">
        {/* Sticky image panel */}
        <div className="lg:sticky lg:top-28">
          <div className="relative w-full aspect-[4/5] rounded overflow-hidden bg-[#E7DFD1]">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div
                  key={img.id}
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{ opacity: idx === activeIndex % images.length ? 1 : 0 }}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `Day ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#E7DFD1] to-[#D8CDB8]" />
            )}
          </div>

          {routeMapUrl && (
            <div className="flex items-center gap-3.5 mt-5">
              <span className="font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase whitespace-nowrap">
                Route map
              </span>
              <span className="flex-1 h-px bg-[#1E1913]/[0.18]" />
              <a
                href={routeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-[#1E1913] hover:text-[#8A6A33] transition-colors whitespace-nowrap"
              >
                Open ↗
              </a>
            </div>
          )}
        </div>

        {/* Day list */}
        <div className="flex flex-col">
          {days.map((day, idx) => (
            <div
              key={day.id ?? day.dayNumber}
              ref={(el) => {
                dayRefs.current[idx] = el;
              }}
              className={`py-7 sm:py-9 ${idx > 0 ? "border-t border-[#1E1913]/[0.14]" : "pt-1"}`}
            >
              <span className="font-sans font-light text-xs tracking-[0.24em] text-[#8A6A33] block mb-4">
                {String(day.dayNumber).padStart(2, "0")}
              </span>

              {day.title && (
                <h3 className="font-serif-luxury font-light text-2xl sm:text-3xl leading-[1.2] tracking-[0.03em] text-[#1E1913] mb-4">
                  {day.title}
                </h3>
              )}

              {day.description && (
                <p className="font-sans font-light text-sm leading-[1.98] text-[#1E1913]/66 mb-5">
                  {day.description}
                </p>
              )}

              {(day.accommodation || day.activities.length > 0) && (
                <div className="flex gap-x-7 gap-y-2 flex-wrap font-sans font-light text-[11px] tracking-[0.18em] text-[#1E1913]/70 uppercase">
                  {day.accommodation && <span>{day.accommodation}</span>}
                  {day.activities.map((activity, actIdx) => (
                    <span key={actIdx}>{activity}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
