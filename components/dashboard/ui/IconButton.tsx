"use client";

import React from "react";

type Tone = "default" | "danger" | "warning" | "success" | "info";

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /** Required — becomes both the accessible name and the visible tooltip (title). */
  label: string;
  tone?: Tone;
  children: React.ReactNode;
}

const TONE_COLOR: Record<Tone, string> = {
  default: "var(--dash-text-subtle)",
  danger: "var(--dash-status-danger)",
  warning: "var(--dash-status-draft)",
  success: "var(--dash-status-published)",
  info: "var(--dash-status-review)",
};

/**
 * Row-action buttons across Itineraries/Users previously carried only a
 * `title` attribute (no visible label, no reliable accessible name) and
 * were sized ~28px (`p-1.5`), under the 44px touch-target floor. This
 * requires a `label`, wires it to both `aria-label` and `title`, and pads
 * to a real touch target.
 */
export default function IconButton({ label, tone = "default", children, disabled, style, ...rest }: IconButtonProps) {
  const color = TONE_COLOR[tone];
  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{ color, ...style }}
      className="dash-focusable min-w-[38px] min-h-[38px] flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "var(--dash-surface-3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}
