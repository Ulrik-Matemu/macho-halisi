"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { DestinationFaq as DestinationFaqEntry } from "@/data/destinations";

interface DestinationFaqProps {
  faqs: DestinationFaqEntry[];
}

/** Plain useState disclosure accordion — no accordion primitive exists yet in this codebase. */
export default function DestinationFaq({ faqs }: DestinationFaqProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-safari-bark/[0.12] border-t border-b border-safari-bark/[0.12]">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer group"
            >
              <span className="font-serif-luxury font-light text-lg sm:text-xl tracking-[0.02em] text-safari-bark group-hover:text-safari-russet transition-colors">
                {faq.question}
              </span>
              <Plus
                className={`w-4 h-4 shrink-0 mt-1.5 text-safari-russet transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="font-sans font-light text-[15px] leading-[1.9] text-safari-bark/72 pb-6 max-w-2xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
