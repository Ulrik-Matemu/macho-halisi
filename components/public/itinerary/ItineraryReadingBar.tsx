"use client";

import { useEffect, useState } from "react";
import { useNavbarVisibility } from "@/components/SiteChrome";
import EnquireButton from "../EnquireButton";

interface ItineraryReadingBarProps {
  itineraryId: string;
  title: string;
  /** Compact form, e.g. "8D / 7N" — null when nights is unset. */
  durationLabel: string | null;
  /** Pre-formatted, e.g. "From $6,450 pp", "Price on request", or "". */
  priceLabel: string;
  /** id of the hero <section> — this bar detects "past hero" via its DOM position. */
  heroElementId: string;
}

/**
 * Design source: Claude Design project 97cc8521-65d3-4bbc-9442-088e8a572c22,
 * "Itinerary Page.dc.html". Two elements sharing one scroll listener: a 2px
 * scroll-progress bar (always mounted, width driven by scroll fraction) and
 * a cream contextual bar (title · duration · price · Enquire) that fades in
 * once the hero has scrolled past.
 *
 * The global Navbar (rendered by SiteChrome, always dark) would otherwise
 * sit permanently on top of this cream page — so while the contextual bar
 * is visible, this component hides the Navbar via useNavbarVisibility(),
 * and always restores it on unmount so navigating away can never leave it
 * hidden on another page.
 */
export default function ItineraryReadingBar({
  itineraryId,
  title,
  durationLabel,
  priceLabel,
  heroElementId,
}: ItineraryReadingBarProps) {
  const { setNavbarVisible } = useNavbarVisibility();
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, window.scrollY / maxScroll));

      const heroEl = document.getElementById(heroElementId);
      setPastHero(heroEl ? heroEl.getBoundingClientRect().bottom <= 0 : window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroElementId]);

  useEffect(() => {
    setNavbarVisible(!pastHero);
  }, [pastHero, setNavbarVisible]);

  useEffect(() => {
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2px] bg-[#8A6A33] z-[60] pointer-events-none"
        style={{ width: `${progress * 100}%` }}
      />

      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-[#F6F2EA]/95 backdrop-blur-md flex items-center justify-between gap-6 sm:gap-10 px-4 sm:px-12 py-4 transition-opacity duration-500 ${
          pastHero ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-baseline gap-3 sm:gap-5 min-w-0">
          <span className="font-serif-luxury font-light text-base tracking-[0.16em] uppercase text-[#1E1913] whitespace-nowrap">
            Macho Halisi
          </span>
          <span className="hidden sm:block font-sans font-light text-[10.5px] tracking-[0.28em] uppercase text-[#1E1913]/70 truncate">
            {title}
            {durationLabel ? ` · ${durationLabel}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-7 shrink-0">
          {priceLabel && (
            <span className="hidden sm:block font-serif-luxury font-light text-base tracking-[0.06em] text-[#8A6A33] whitespace-nowrap">
              {priceLabel}
            </span>
          )}
          <EnquireButton
            itineraryId={itineraryId}
            itineraryTitle={title}
            label="Enquire Now"
            showIcon={false}
            className="inline-flex items-center justify-center font-sans font-light text-[10px] sm:text-[10.5px] tracking-[0.3em] uppercase text-[#F6F2EA] bg-[#1E1913] hover:bg-[#8A6A33] transition-colors px-5 sm:px-7 py-3 sm:py-3.5 rounded whitespace-nowrap cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}
