"use client";

import React, { useEffect, useState } from "react";
import { TRAVEL_TOPICS } from "@/data/travelInfoData";

export default function TravelInfoStickyNav() {
  const [activeId, setActiveId] = useState(TRAVEL_TOPICS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = TRAVEL_TOPICS.length - 1; i >= 0; i--) {
        const el = document.getElementById(TRAVEL_TOPICS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(TRAVEL_TOPICS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-[#F6F2EA]/95 backdrop-blur-md border-y border-[#1E1913]/10 py-3 mb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8A6A33] shrink-0 hidden sm:inline-block">
          Field Guide Index:
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {TRAVEL_TOPICS.map((topic) => {
            const isActive = topic.id === activeId;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => scrollTo(topic.id)}
                className={`px-3 py-1.5 rounded text-xs font-sans tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1E1913] text-[#FBF7F0] font-medium shadow-sm"
                    : "text-[#1E1913]/70 hover:text-[#1E1913] hover:bg-black/5"
                }`}
              >
                {topic.shortTitle}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
