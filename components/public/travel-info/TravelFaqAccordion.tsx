"use client";

import React, { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { TRAVEL_FAQS, TravelFaq } from "@/data/travelInfoData";

export default function TravelFaqAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFaqs = TRAVEL_FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="faqs" className="py-16 sm:py-24">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#C9A46A]" />
          <span>Clarity in the Details</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1E1913]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#1E1913]/70 font-sans mt-2">
          Everything you need to know about visas, health, money, electrical outlets, and park rules.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="max-w-3xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E1913]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. 'visas', 'yellow fever', 'tipping', 'drones')..."
            className="w-full bg-white border border-[#1E1913]/15 pl-11 pr-4 py-3 text-sm text-[#1E1913] placeholder-[#1E1913]/40 focus:border-[#8A6A33] focus:outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: "all", label: "All Topics" },
            { key: "visas", label: "Visas & Passports" },
            { key: "health", label: "Health & Vaccines" },
            { key: "gear", label: "Luggage & Gear" },
            { key: "money", label: "Money & Tipping" },
            { key: "etiquette", label: "Bush Etiquette" },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded text-xs font-sans whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat.key
                  ? "bg-[#1E1913] text-[#FBF7F0] font-medium"
                  : "bg-white/60 hover:bg-white text-[#1E1913]/70 border border-[#1E1913]/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-dashed border-[#1E1913]/20 text-sm text-[#1E1913]/60">
            No questions matched your search query. Please contact our safari directors directly.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="bg-white/80 border border-[#1E1913]/10 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02]"
                >
                  <span className="font-serif-luxury text-base sm:text-lg text-[#1E1913] font-normal leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A6A33] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm sm:text-[14.5px] font-sans font-light text-[#1E1913]/75 leading-relaxed border-t border-[#1E1913]/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
