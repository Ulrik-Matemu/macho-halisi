"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenEnquiry: () => void;
  onOpenSearch?: () => void;
  isVisible?: boolean;
}

export default function Navbar({
  onOpenMenu,
  onOpenEnquiry,
  onOpenSearch,
  isVisible = true,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 transition-luxury ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-6 pointer-events-none"
      } ${
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-md py-3 border-b border-white/10 shadow-2xl"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Logo (without accompanying text) */}
        <Link
          href="/"
          className="flex items-center group transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative h-10 sm:h-12 aspect-[180/94] rounded overflow-hidden border border-white/20 bg-black shadow-md transition-colors duration-300 group-hover:border-[#c68642]/60">
            <Image
              src="/media/macho-halisi-logo.jpg"
              alt="Macho Halisi Logo"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </Link>

        {/* Right: Hamburger Menu, Search & Enquiry CTA */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Hamburger Menu Trigger */}
          
          {/* Search Button */}
          <button
            onClick={onOpenSearch || onOpenMenu}
            aria-label="Search"
            className="p-2 text-white/80 hover:text-[#e0ac69] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
          </button>

          {/* Enquire CTA Button */}
          <button
            onClick={onOpenEnquiry}
            className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-transparent border border-white/40 hover:border-[#c68642] hover:bg-[#c68642] text-white hover:text-[#ffdbac] text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 rounded shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.3)] hover:scale-[1.02] cursor-pointer"
          >
            ENQUIRE
          </button>
          <button
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="group flex items-center gap-3 text-white focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 flex flex-col justify-center gap-2.5 transition-all duration-300 group-hover:scale-105">
              <span className="w-10 h-[2px] bg-white transition-all duration-400 group-hover:bg-[#c68642] group-hover:w-12" />
              <span className="w-8 h-[2px] bg-white transition-all duration-400 group-hover:bg-[#c68642] group-hover:w-10" />
              <span className="w-6 h-[2px] bg-white transition-all duration-400 group-hover:bg-[#c68642] group-hover:w-8" />
            </div>
          </button>

        </div>
      </div>
    </header>
  );
}
