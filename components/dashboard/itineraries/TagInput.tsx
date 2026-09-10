"use client";

import React, { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}

export default function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter...",
  disabled = false,
  maxTags,
}: TagInputProps) {
  const [inputVal, setInputVal] = useState("");

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setInputVal("");
      return;
    }
    if (maxTags && tags.length >= maxTags) return;

    onChange([...tags, trimmed]);
    setInputVal("");
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) return;
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      className={`min-h-[46px] p-2 bg-[#121212] border rounded flex flex-wrap items-center gap-2 transition-colors ${
        disabled
          ? "border-white/10 opacity-70 cursor-not-allowed"
          : "border-white/15 focus-within:border-[#c68642]"
      }`}
    >
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f1a14] border border-[#c68642]/40 text-[#ffdbac] text-xs font-sans animate-in fade-in duration-150"
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(idx)}
              aria-label={`Remove ${tag}`}
              className="p-0.5 text-[#ffdbac]/60 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <div className="flex-1 min-w-[140px] flex items-center gap-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputVal && addTag(inputVal)}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none py-1"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputVal)}
              className="p-1 rounded bg-[#c68642]/20 text-[#ffdbac] hover:bg-[#c68642]/30 text-xs flex items-center"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
