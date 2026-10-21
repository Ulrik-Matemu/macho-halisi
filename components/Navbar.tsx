"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenEnquiry: () => void;
  isVisible?: boolean;
  scrollThreshold?: number;
}

export default function Navbar({
  onOpenMenu,
  onOpenEnquiry,
  isVisible = true,
  scrollThreshold = Number.POSITIVE_INFINITY,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollThreshold === Number.POSITIVE_INFINITY) {
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const isScrolled = scrollThreshold !== Number.POSITIVE_INFINITY && scrolled;
  // Transparent (light text, no bar) while a full-bleed hero (marked
  // data-navbar-hero) is still behind the bar, solid tan otherwise. Measured
  // from the hero's real position rather than a fixed scroll distance, so a
  // restored scroll position on reload can't flip it to tan over the footage.
  const [overPageHero, setOverPageHero] = useState(pathname === "/");
  useEffect(() => {
    const BAR_HEIGHT = 90;
    const check = () => {
      const hero = document.querySelector("[data-navbar-hero]");
      const rect = hero?.getBoundingClientRect();
      // The homepage hero is pinned for 220vh and the next section slides
      // up over its tail, so the bar leaves the footage when that section
      // reaches it, not when the hero's own box ends.
      const bottom = pathname === "/" ? (hero?.nextElementSibling?.getBoundingClientRect().top ?? rect?.bottom ?? 0) : rect?.bottom ?? 0;
      const over = !!rect && rect.top <= 0 && bottom > BAR_HEIGHT;
      setOverPageHero((prev) => (prev === over ? prev : over));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);
  const overHero = overPageHero;

  // Auto-hide on scroll direction: down hides it, any upward movement
  // reveals it immediately — composes with (never overrides) `isVisible`,
  // which stays the page-level escape hatch (e.g. the itinerary detail
  // page's ItineraryReadingBar takes over the top bar entirely once
  // scrolled past its hero, via useNavbarVisibility()). Two guards keep it
  // from feeling twitchy: a minimum scroll distance below the very top of
  // the page before auto-hide can kick in at all, so the navbar is always
  // present on load and right after a scroll-to-top, and a small dead
  // zone on the delta itself so trackpad/mouse-wheel jitter can't flicker
  // it. Reuses the same opacity/translate-y transition already driving
  // `isVisible` below, so both hide the exact same elegant way.
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let ticking = false;

    const REVEAL_ZONE = 120; // px from the top where the navbar always stays visible
    const DIRECTION_DEAD_ZONE = 6; // px of scroll delta to ignore as jitter

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollYRef.current;

        if (Math.abs(delta) > DIRECTION_DEAD_ZONE) {
          if (delta > 0 && currentY > REVEAL_ZONE) {
            setHiddenByScroll(true);
          } else if (delta < 0) {
            setHiddenByScroll(false);
          }
          lastScrollYRef.current = currentY;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectiveVisible = isVisible && !hiddenByScroll;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 transition-luxury ${
        effectiveVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-6 pointer-events-none"
      } ${
        overHero
          ? "bg-transparent py-5 sm:py-6"
          : `bg-safari-tan/95 backdrop-blur-md border-b border-safari-night/15 shadow-lg ${isScrolled ? "py-3" : "py-5 sm:py-6"}`
      }`}
    >
      <div className="w-full pl-3 pr-4 sm:pl-5 sm:pr-8 lg:pl-6 lg:pr-12 flex items-center justify-between">
        {/* Left: Brand Logo (without accompanying text) */}
        <Link
          href="/"
          className="flex items-center group transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative lg:h-14 h-12 aspect-[180/94] rounded overflow-hidden border border-safari-night/20 bg-black shadow-md transition-colors duration-300 group-hover:border-safari-ochre/60">
            <Image
              src="/media/latest-logo.jpg"
              alt="Macho Halisi Logo"
              fill
              priority
              sizes="112px"
              className="object-cover object-center"
            />
          </div>
        </Link>

        {/* Right: Hamburger Menu & Enquiry CTA */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Hamburger Menu Trigger */}
          
          {/* Enquire CTA Button */}
          <button
            onClick={onOpenEnquiry}
            className={`relative px-4 sm:px-6 py-2.5 sm:py-3 bg-transparent border ${overHero ? "border-white/60 text-white" : "border-safari-night/60 text-safari-night"} hover:border-safari-night hover:bg-safari-night hover:text-safari-champagne font-serif-luxury text-xs sm:text-sm font-normal tracking-[0.22em] uppercase transition-all duration-300 rounded shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.3)] hover:scale-[1.02] cursor-pointer`}
          >
            <span className="sm:hidden">ENQUIRE</span>
            <span className="hidden sm:inline">ENQUIRE</span>
          </button>
          <button
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className={`group flex items-center gap-3 ${overHero ? "text-white" : "text-safari-night"} rounded cursor-pointer`}
          >
            <div className="w-10 h-10 flex flex-col justify-center gap-2.5 transition-all duration-300 group-hover:scale-105">
              <span className={`w-10 h-[2px] ${overHero ? "bg-white" : "bg-safari-night"} transition-all duration-400 group-hover:bg-safari-ochre group-hover:w-12`} />
              <span className={`w-8 h-[2px] ${overHero ? "bg-white" : "bg-safari-night"} transition-all duration-400 group-hover:bg-safari-ochre group-hover:w-10`} />
              <span className={`w-6 h-[2px] ${overHero ? "bg-white" : "bg-safari-night"} transition-all duration-400 group-hover:bg-safari-ochre group-hover:w-8`} />
            </div>
          </button>

        </div>
      </div>
    </header>
  );
}
