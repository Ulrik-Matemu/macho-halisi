"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ItineraryDay, ItineraryImage } from "@/lib/itineraries/types";
import ItineraryMap from "./ItineraryMap";
import type { ItineraryMapPin } from "@/lib/public/api";

interface ItineraryRouteSectionProps {
  days: ItineraryDay[];
  /** Full image list (cover included) — cycled per day by index, wrapping. */
  images: ItineraryImage[];
  routeMapUrl: string | null;
  /** Same pin list the journey overview map uses — see getItineraryMapPins. */
  mapPins: ItineraryMapPin[];
}

/**
 * "The route" — day-by-day section with a sticky panel that cross-fades as
 * the visitor scrolls through day entries. The panel can show either the
 * itinerary's photos (default) or a live map whose camera flies to each
 * day's pin as it becomes active — both driven off the same scroll-tracked
 * `activeIndex`, which is also why this stays one client component rather
 * than splitting the panel from the day list.
 *
 * Per-day images: a day with its own `heroImage` set uses that photo for
 * its panel slot; otherwise it falls back to `images[dayIndex %
 * images.length]`, which degrades gracefully to a single static image
 * when there's only one photo (or none, in which case a placeholder
 * gradient fills the panel).
 */
export default function ItineraryRouteSection({ days, images, routeMapUrl, mapPins }: ItineraryRouteSectionProps) {
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelView, setPanelView] = useState<"photo" | "map">("photo");
  const hasMap = mapPins.length >= 2;

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
  // mapPins is keyed by day order, same as `days` — but a day without
  // coordinates is skipped when building mapPins, so the two arrays can
  // diverge in length/order. Map by dayNumber rather than assuming index
  // parity, so the flown-to pin always matches the day actually in view.
  const activeMapPinIndex = mapPins.findIndex((p) => p.dayNumber === activeDayNumber);

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
        <div className="flex items-center gap-6">
          {hasMap && (
            <div className="flex items-center gap-0.5 rounded-full border border-[#1E1913]/[0.18] p-0.5">
              {(["photo", "map"] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setPanelView(view)}
                  className={`px-3.5 py-1.5 rounded-full font-sans font-light text-[10px] tracking-[0.24em] uppercase transition-colors cursor-pointer ${
                    panelView === view
                      ? "bg-[#1E1913] text-[#F6F2EA]"
                      : "text-[#1E1913]/60 hover:text-[#1E1913]"
                  }`}
                >
                  {view === "photo" ? "Photos" : "Map"}
                </button>
              ))}
            </div>
          )}
          <span className="font-sans font-light text-[11px] tracking-[0.28em] text-[#1E1913]/70 uppercase whitespace-nowrap">
            Day {String(activeDayNumber).padStart(2, "0")} of {String(days.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-16 items-start">
        {/* Sticky panel: photo cross-fade or live map */}
        <div className="lg:sticky lg:top-28">
          <div className="relative w-full aspect-[4/5] rounded overflow-hidden bg-[#E7DFD1]">
            {panelView === "map" && hasMap ? (
              <ItineraryMap
                pins={mapPins}
                activeIndex={activeMapPinIndex >= 0 ? activeMapPinIndex : undefined}
                className="absolute inset-0"
              />
            ) : images.length > 0 ? (
              images.map((img, idx) => {
                const activeDay = days[activeIndex];
                const slotImage = activeDay?.heroImage && idx === activeIndex % images.length
                  ? activeDay.heroImage
                  : img;
                return (
                  <div
                    key={img.id}
                    className="absolute inset-0 transition-opacity duration-700 ease-out"
                    style={{ opacity: idx === activeIndex % images.length ? 1 : 0 }}
                  >
                    <Image
                      src={slotImage.url}
                      alt={slotImage.altText || `Day ${idx + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                );
              })
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

        {/* Day list, with a progress rail tracking scroll position */}
        <div className="flex gap-5">
          <div className="hidden sm:flex flex-col items-center pt-1 w-3 shrink-0">
            <div className="relative w-px flex-1 bg-[#1E1913]/[0.14]">
              <div
                className="absolute top-0 left-0 w-px bg-[#8A6A33] transition-all duration-300 ease-out"
                style={{ height: `${(activeIndex / Math.max(days.length - 1, 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {days.map((day, idx) => (
              <div
                key={day.id ?? day.dayNumber}
                id={`day-${day.dayNumber}`}
                ref={(el) => {
                  dayRefs.current[idx] = el;
                }}
                className={`py-7 sm:py-9 scroll-mt-28 ${idx > 0 ? "border-t border-[#1E1913]/[0.14]" : "pt-1"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-sans font-light text-xs tracking-[0.24em] text-[#8A6A33]">
                    {String(day.dayNumber).padStart(2, "0")}
                  </span>
                  {day.highlight && (
                    <span className="font-sans font-light text-[9px] tracking-[0.24em] text-[#8A6A33] uppercase border border-[#8A6A33]/40 rounded-full px-2.5 py-1">
                      Signature moment
                    </span>
                  )}
                </div>

                {day.title && (
                  <h3
                    className={`font-serif-luxury font-light leading-[1.2] tracking-[0.03em] text-[#1E1913] mb-4 ${
                      day.highlight ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                    }`}
                  >
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
      </div>
    </section>
  );
}
