"use client";

import React, { useState } from "react";
import { Check, CheckSquare, RotateCcw, Copy, Sparkles } from "lucide-react";
import { PACKING_ITEMS, PackingItem } from "@/data/travelInfoData";

export default function PackingChecklist() {
  const [selectedTripType, setSelectedTripType] = useState<"safari" | "kili" | "beach">("safari");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Filter items matching the selected trip type
  const relevantItems = PACKING_ITEMS.filter((item) =>
    item.tripTypes.includes(selectedTripType)
  );

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCheckedIds(new Set());
  };

  const handleCopyList = () => {
    const listText = relevantItems
      .map(
        (item) =>
          `[${checkedIds.has(item.id) ? "x" : " "}] ${item.name} (${item.notes})`
      )
      .join("\n");

    navigator.clipboard.writeText(
      `Macho Halisi Safari Packing Checklist (${selectedTripType.toUpperCase()}):\n\n${listText}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { key: "clothing", label: "Safari Attire & Footwear" },
    { key: "optics-tech", label: "Optics, Cameras & Electronics" },
    { key: "health-toiletries", label: "Health, Protection & Toiletries" },
    { key: "documents", label: "Passports, Cash & Critical Documents" },
  ];

  const totalCount = relevantItems.length;
  const checkedCount = relevantItems.filter((i) => checkedIds.has(i.id)).length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  return (
    <section id="packing" className="py-16 sm:py-24 border-b border-safari-bark/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-safari-gold" />
            <span>Interactive Preparation Tool</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-safari-bark">
            Curated Packing Assistant
          </h2>
          <p className="text-sm text-safari-bark/70 font-sans mt-2 max-w-xl">
            Choose your safari style to tailor the packing checklist. Check off items as you prepare
            your soft duffel bag.
          </p>
        </div>

        {/* Trip Type Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE4D7] border border-safari-bark/10">
          {[
            { key: "safari", label: "Classic Wildlife Safari" },
            { key: "kili", label: "Kilimanjaro Trek" },
            { key: "beach", label: "Bush & Zanzibar Coast" },
          ].map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setSelectedTripType(type.key as any)}
              className={`px-3.5 py-2 rounded text-xs font-sans transition-all cursor-pointer ${
                selectedTripType === type.key
                  ? "bg-safari-bark text-safari-cream font-medium shadow-sm"
                  : "text-safari-bark/70 hover:text-safari-bark"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Actions Bar */}
      <div className="bg-white/70 border border-safari-bark/10 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="font-mono text-xs text-safari-russet">
            {checkedCount} / {totalCount} Packed ({progressPercent}%)
          </div>
          <div className="flex-1 max-w-xs h-2 bg-safari-bark/10 overflow-hidden">
            <div
              className="h-full bg-safari-russet transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded bg-safari-bark/5 hover:bg-safari-bark/10 text-safari-bark transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied to Clipboard!" : "Copy Checklist"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded bg-safari-bark/5 hover:bg-safari-bark/10 text-safari-bark transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Grouped Checklist */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const itemsInCat = relevantItems.filter((i) => i.category === cat.key);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={cat.key} className="bg-white/70 border border-safari-bark/10 p-6 sm:p-8">
              <h3 className="font-serif-luxury text-xl text-safari-bark mb-4 pb-3 border-b border-safari-bark/10 flex items-center justify-between">
                <span>{cat.label}</span>
                <span className="text-xs font-mono text-safari-russet font-normal">
                  {itemsInCat.filter((i) => checkedIds.has(i.id)).length} / {itemsInCat.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {itemsInCat.map((item) => {
                  const isChecked = checkedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-3.5 border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/50 border-emerald-300/80 text-emerald-950"
                          : "bg-white hover:bg-safari-cream border-safari-bark/10 text-safari-bark"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-safari-bark/30 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-sans text-sm font-medium leading-snug ${
                            isChecked ? "line-through text-emerald-900/60" : "text-safari-bark"
                          }`}
                        >
                          {item.name}
                        </div>
                        <div
                          className={`font-sans text-xs mt-0.5 leading-relaxed ${
                            isChecked ? "text-emerald-800/60" : "text-safari-bark/60"
                          }`}
                        >
                          {item.notes}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
