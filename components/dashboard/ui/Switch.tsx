"use client";

import React, { useId } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

/**
 * Replaces the peer-checkbox toggles (OverviewTab price-on-request,
 * new-itinerary form) that used `sr-only` + `peer-focus:outline-none`,
 * which suppresses the focus ring entirely for keyboard users — this
 * keeps the input visually hidden but lets :focus-visible reach the
 * visible track via the sibling selector below.
 */
export default function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between gap-4 ${disabled ? "opacity-60" : "cursor-pointer"}`}
    >
      <span>
        <span className="text-sm block" style={{ color: "var(--dash-text)" }}>
          {label}
        </span>
        {description && (
          <span className="text-xs block mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            {description}
          </span>
        )}
      </span>
      <span className="relative inline-flex items-center shrink-0">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="w-11 h-6 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
          style={{
            background: checked ? "var(--dash-accent-fill)" : "var(--dash-surface-3)",
            outlineColor: "var(--dash-focus-ring)",
          }}
        >
          <span
            className="block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform"
            style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
          />
        </span>
      </span>
    </label>
  );
}
