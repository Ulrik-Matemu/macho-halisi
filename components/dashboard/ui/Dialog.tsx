"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** "sm" ~ 28rem, "md" ~ 32rem (default), "lg" ~ 42rem */
  size?: "sm" | "md" | "lg";
  /** Widens further and scrolls internally — for content-heavy dialogs like PublishChangesModal. */
  scrollable?: boolean;
}

const SIZE_CLASS: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal foundation replacing the 8 hand-rolled
 * `fixed inset-0 ... bg-black/80` divs across the dashboard, none of which
 * had role="dialog", a focus trap, Escape-to-close, focus restore, or a
 * body scroll lock. Every dashboard modal (confirm dialogs, the mobile nav
 * drawer, publish/archive/delete, create-user, reset-password, review-diff)
 * renders through this.
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  scrollable = false,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Focus enter + restore-on-close.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel)?.focus();

    return () => {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  // Escape to close + focus trap + body scroll lock.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgb(0 0 0 / 65%)", backdropFilter: "blur(2px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`w-full ${SIZE_CLASS[size]} rounded-xl p-6 sm:p-7 space-y-5 shadow-2xl outline-none ${
          scrollable ? "max-h-[85vh] overflow-y-auto" : ""
        }`}
        style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-strong)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <h2 id={titleId} className="dash-title" style={{ color: "var(--dash-text)" }}>
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm leading-relaxed" style={{ color: "var(--dash-text-muted)" }}>
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="dash-focusable p-1.5 rounded-md shrink-0 transition-colors"
            style={{ color: "var(--dash-text-subtle)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--dash-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dash-text-subtle)")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm" style={{ color: "var(--dash-text)" }}>
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">{footer}</div>
        )}
      </div>
    </div>
  );
}
