"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Search } from "lucide-react";
import { navigationData, NavCategory, NavSubItem } from "../data/navigationData";

interface FullscreenNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: () => void;
}

export default function FullscreenNavMenu({
  isOpen,
  onClose,
  onOpenEnquiry,
}: FullscreenNavMenuProps) {
  // Progressive disclosure navigation state
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<NavSubItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileStep, setMobileStep] = useState<"categories" | "subItems" | "preview">("categories");

  // Timer reference for safe hover travel between columns
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cancelResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const scheduleReset = useCallback((delay = 320) => {
    cancelResetTimer();
    resetTimerRef.current = setTimeout(() => {
      setHoveredCategoryId(null);
      setHoveredSubItem(null);
    }, delay);
  }, [cancelResetTimer]);

  // Synchronize body scroll with isOpen
  useEffect(() => {
    if (isOpen) {
      cancelResetTimer();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, cancelResetTimer]);

  // Graceful close handler
  const handleClose = useCallback(() => {
    cancelResetTimer();
    setHoveredCategoryId(null);
    setHoveredSubItem(null);
    setSearchQuery("");
    setMobileStep("categories");
    onClose();
  }, [cancelResetTimer, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const activeCategory: NavCategory | undefined = navigationData.find(
    (cat) => cat.id === hoveredCategoryId
  );

  // Hovering category in Column 1
  const handleCategoryHover = (categoryId: string) => {
    cancelResetTimer();
    if (hoveredCategoryId !== categoryId) {
      setHoveredCategoryId(categoryId);
      setHoveredSubItem(null);
    }
  };

  // Hovering sub-item in Column 2
  const handleSubItemHover = (subItem: NavSubItem) => {
    cancelResetTimer();
    setHoveredSubItem(subItem);
  };

  // Search filtering
  const isSearching = searchQuery.trim().length > 0;
  const searchResults: { categoryTitle: string; item: NavSubItem }[] = [];
  if (isSearching) {
    const query = searchQuery.toLowerCase();
    navigationData.forEach((cat) => {
      cat.subItems.forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tagline?.toLowerCase().includes(query)
        ) {
          searchResults.push({ categoryTitle: cat.title, item });
        }
      });
    });
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 bg-[#050505] text-white flex flex-col select-none transition-curtain ${
        isOpen ? "curtain-open pointer-events-auto" : "curtain-closed pointer-events-none"
      } border-b border-[#c68642]/50 shadow-[0_12px_40px_rgba(198,134,66,0.22)]`}
      onMouseLeave={() => scheduleReset(200)}
    >
      {/* Inner Content Layer: Fades in after curtain unfurls, dissolves upward during curtain retraction */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all ${
          isOpen
            ? "opacity-100 translate-y-0 duration-400 delay-150 transition-luxury"
            : "opacity-0 -translate-y-3 duration-200 ease-in pointer-events-none"
        }`}
      >
        {/* Top Bar with Staggered Header Descent */}
        <header
          onMouseEnter={cancelResetTimer}
          className="border-b border-white/10 bg-[#050505] py-5 sm:py-6 animate-in fade-in slide-in-from-top-3 duration-500"
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            {/* Left: Brand Logo (matching Navbar) */}
            <Link
              href="/"
              onClick={handleClose}
              className="flex items-center group transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative lg:h-14 h-12 aspect-[180/94] rounded overflow-hidden border border-white/20 bg-black shadow-md transition-colors duration-300 group-hover:border-[#c68642]/60">
                <Image
                  src="/media/macho-halisi-logo-2.jpg"
                  alt="Macho Halisi Logo"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </Link>

            {/* Right: Close Menu Trigger, Search & Enquire CTA */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Close Menu Trigger - Positioned to resonate with the hamburger button in Navbar */}
              

              {/* Search destinations input */}
              <div className="relative hidden md:block w-48 lg:w-60">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-sm md:h-10 pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c68642] transition-colors"
                />
              </div>

              {/* Enquire CTA Button */}
              <button
                onClick={() => {
                  handleClose();
                  onOpenEnquiry();
                }}
                className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs sm:text-sm font-normal tracking-[0.22em] uppercase transition-all duration-300 rounded cursor-pointer shadow-md hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(198,134,66,0.35)]"
              >
                ENQUIRE
              </button>
              <button
                onClick={handleClose}
                aria-label="Close menu"
                className="group flex items-center gap-2.5 sm:gap-3 text-white focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#c68642] group-hover:scale-105 group-hover:bg-[#8d5524]/20">
                  <X className="w-4 h-4 text-white group-hover:text-[#e0ac69] transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* If user is actively searching */}
          {isSearching ? (
            <div className="max-w-[1400px] mx-auto p-6 sm:p-12 animate-in fade-in duration-300">
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#e0ac69] mb-6">
                Found {searchResults.length} destination(s) for &quot;{searchQuery}&quot;
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(({ categoryTitle, item }, idx) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleClose();
                    }}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className="p-5 border border-white/10 hover:border-[#c68642] transition-all duration-300 rounded bg-white/[0.02] cursor-pointer group flex flex-col justify-between animate-nav-cascade hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.25em] text-[#e0ac69] uppercase block mb-1">
                        {categoryTitle}
                      </span>
                      <h4 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#ffdbac] transition-colors tracking-wide">
                        {item.title}
                      </h4>
                      {item.tagline && (
                        <p className="font-serif-italic text-xs text-[#e0ac69]/80 mt-1">
                          {item.tagline}
                        </p>
                      )}
                      <p className="text-xs text-white/60 line-clamp-2 mt-2 font-sans leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#e0ac69]">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Split Panel Navigation with Full-Height Top-Border Flush Preview */
            <div className="w-full flex-1 flex flex-col lg:flex-row h-full min-h-[calc(100vh-85px)]">
              {/* Left & Middle: Columns 1 & 2 in an elegant padded container */}
              <div
                onMouseEnter={cancelResetTimer}
                className={`w-full lg:w-7/12 xl:w-2/3 py-8 sm:py-10 lg:py-14 px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
                  mobileStep === "preview" ? "hidden lg:grid" : "grid"
                }`}
              >
                {/* COLUMN 1 (LEFT): Main Categories with Staggered Cascading Entrance */}
                <div
                  onMouseEnter={cancelResetTimer}
                  onMouseLeave={() => scheduleReset(320)}
                  className={`flex flex-col justify-start space-y-0 ${
                    mobileStep !== "categories" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {navigationData.map((category, index) => {
                    const isHovered = category.id === hoveredCategoryId;
                    return (
                      <div
                        key={category.id}
                        style={{ animationDelay: `${index * 45}ms` }}
                        onMouseEnter={() => handleCategoryHover(category.id)}
                        onClick={() => {
                          handleCategoryHover(category.id);
                          setMobileStep("subItems");
                        }}
                        className={`group w-full py-4 sm:py-5 px-2 flex items-center justify-between border-b cursor-pointer transition-all duration-300 animate-nav-cascade ${
                          isHovered
                            ? "border-[#c68642] text-white"
                            : "border-white/10 text-white/60 hover:text-[#ffdbac] hover:border-white/20"
                        }`}
                      >
                        <span className="font-serif-luxury text-sm sm:text-base lg:text-lg tracking-[0.14em] uppercase font-light transition-transform duration-300 group-hover:translate-x-2">
                          {category.title}
                        </span>
                        {/* Orange Arrow on active/hovered state with smooth slide-in */}
                        <ArrowRight
                          className={`w-4 h-4 text-[#e0ac69] transition-all duration-300 ${
                            isHovered
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-3 group-hover:opacity-40 group-hover:-translate-x-1"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* COLUMN 2 (MIDDLE): Sub-Items with Rapid Micro-Cascade */}
                <div
                  onMouseEnter={cancelResetTimer}
                  onMouseLeave={() => scheduleReset(320)}
                  className={`flex flex-col justify-start space-y-0 ${
                    mobileStep === "subItems" ? "flex" : "hidden lg:flex"
                  }`}
                >
                  {/* Mobile Back to Categories */}
                  <div className="lg:hidden mb-4">
                    <button
                      onClick={() => {
                        setMobileStep("categories");
                        setHoveredCategoryId(null);
                        setHoveredSubItem(null);
                      }}
                      className="flex items-center gap-2 text-xs text-[#e0ac69] uppercase tracking-widest py-2"
                    >
                      ← Back to Menu
                    </button>
                  </div>

                  {/* Render middle column content ONLY if a category on the left is hovered */}
                  {activeCategory ? (
                    <div key={activeCategory.id} className="space-y-0">
                      {activeCategory.subItems.map((subItem, idx) => {
                        const isSubHovered = hoveredSubItem?.id === subItem.id;
                        return (
                          <div
                            key={subItem.id}
                            style={{ animationDelay: `${idx * 30}ms` }}
                            onMouseEnter={() => handleSubItemHover(subItem)}
                            onClick={() => {
                              handleSubItemHover(subItem);
                              setMobileStep("preview");
                            }}
                            className={`group w-full py-4 sm:py-5 px-2 flex items-center justify-between border-b cursor-pointer transition-all duration-200 animate-sub-cascade ${
                              isSubHovered
                                ? "border-[#c68642] text-white"
                                : "border-white/10 text-white/60 hover:text-[#ffdbac] hover:border-white/20"
                            }`}
                          >
                            <span className="font-serif-luxury text-xs sm:text-sm tracking-[0.12em] uppercase font-light transition-transform duration-200 group-hover:translate-x-2">
                              {subItem.title}
                            </span>
                            {/* Indicator Pip on Hover */}
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-[#e0ac69] transition-all duration-200 ${
                                isSubHovered
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-50"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Blank state when no category is hovered (matching nav-1.png) */
                    <div className="hidden lg:block" />
                  )}
                </div>
              </div>

              {/* COLUMN 3 (RIGHT): Full-Height Top-Border Flush Preview Panel with Persistent Top Crown */}
              <div
                onMouseEnter={cancelResetTimer}
                onMouseLeave={() => scheduleReset(320)}
                className={`w-full lg:w-5/12 xl:w-1/3 border-t lg:border-t-0 lg:border-l border-white/10 relative flex flex-col overflow-hidden ${
                  mobileStep === "preview"
                    ? "flex min-h-[calc(100vh-140px)]"
                    : "hidden lg:flex min-h-full"
                }`}
              >
                {/* Mobile Back to Sub-items */}
                <div className="lg:hidden p-4 bg-black/60 backdrop-blur-md z-40">
                  <button
                    onClick={() => setMobileStep("subItems")}
                    className="flex items-center gap-2 text-xs text-[#e0ac69] uppercase tracking-widest py-1"
                  >
                    ← Back to {activeCategory?.title || "List"}
                  </button>
                </div>

                {/* Persistent Brand Crown - Stuck at the top of it all across destinations */}
                <div className="absolute top-8 sm:top-12 inset-x-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                  <span className="font-serif-luxury font-light text-xs sm:text-sm tracking-[0.42em] uppercase text-[#ffdbac] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                    MACHO HALISI
                  </span>
                  <span className="h-[1px] w-8 sm:w-10 bg-[#e0ac69]/60 mt-2" />
                </div>

                {/* Render right column content ONLY if a sub-item in the middle is hovered */}
                {hoveredSubItem ? (
                  <Link
                    key={hoveredSubItem.id}
                    href={hoveredSubItem.href}
                    onClick={handleClose}
                    className="group relative w-full h-full flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-12 overflow-hidden cursor-pointer animate-image-settle"
                  >
                    {/* Full-bleed background destination image with slow-motion optical zoom */}
                    <Image
                      src={hoveredSubItem.image}
                      alt={hoveredSubItem.title}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                    />

                    {/* Cinematic Contrast Overlays */}
                    <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/35 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

                    {/* Sole Text Element: Destination Name */}
                    <div className="relative z-20 flex flex-col items-center justify-center max-w-lg px-6 text-center">
                      <h3 className="font-serif-luxury font-light text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#ffdbac] transition-colors duration-300 tracking-[0.16em] uppercase leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                        {hoveredSubItem.title}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  /* Blank state when no sub-item is hovered (matching nav-1.png & nav-2.png) */
                  <div className="hidden lg:flex w-full h-full items-center justify-center bg-black/[0.08]" />
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  </div>
);
}
