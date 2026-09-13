"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const BASE =
  "dash-focusable inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const SIZE_CLASS: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2.5 text-sm",
};

/**
 * Enforces the fixed accent fill/on-fill contrast pair everywhere instead
 * of the previous ad-hoc mix (`text-[#ffdbac]` on gold measured 2.32:1;
 * `text-[#080808]` on the same gold, used elsewhere, measured 6.57:1) —
 * this component only ever emits the passing pair.
 */
export default function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const variantStyle: React.CSSProperties =
    variant === "primary"
      ? { background: "var(--dash-accent-fill)", color: "var(--dash-accent-on-fill)" }
      : variant === "danger"
      ? { background: "var(--dash-status-danger)", color: "#2a0805" }
      : variant === "ghost"
      ? { background: "transparent", color: "var(--dash-text-muted)" }
      : { background: "var(--dash-surface-2)", color: "var(--dash-text)", border: "1px solid var(--dash-border-strong)" };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      style={{ ...variantStyle, ...style }}
      className={`${BASE} ${SIZE_CLASS[size]} ${fullWidth ? "w-full" : ""}`}
      onMouseEnter={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "var(--dash-accent-fill-hover)";
        else if (variant === "ghost") e.currentTarget.style.color = "var(--dash-text)";
        else if (variant === "secondary") e.currentTarget.style.background = "var(--dash-surface-3)";
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyle);
      }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}
