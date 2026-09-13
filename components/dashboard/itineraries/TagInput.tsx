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
      className="min-h-[46px] p-2 rounded-md flex flex-wrap items-center gap-2 transition-colors"
      style={{
        background: "var(--dash-surface-2)",
        border: `1px solid ${disabled ? "var(--dash-border)" : "var(--dash-border-strong)"}`,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="animate-in fade-in inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
          style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(idx)}
              aria-label={`Remove ${tag}`}
              className="dash-focusable p-0.5 rounded transition-colors"
              style={{ color: "var(--dash-accent)" }}
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
            className="dash-focusable w-full bg-transparent text-sm py-1 rounded"
            style={{ color: "var(--dash-text)" }}
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputVal)}
              aria-label="Add tag"
              className="dash-focusable p-1 rounded"
              style={{ background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
