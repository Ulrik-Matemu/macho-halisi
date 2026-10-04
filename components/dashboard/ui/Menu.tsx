"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MenuEntry =
  | { kind?: "item"; label: string; icon?: React.ReactNode; onSelect: () => void; danger?: boolean; disabled?: boolean; hint?: string }
  | { kind: "heading"; label: string }
  | { kind: "separator" };

interface TriggerProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
}

const WIDTH = 232;

/**
 * Dropdown menu for row and toolbar actions. It renders in a portal (inside
 * the dashboard root, so the --dash-* tokens still apply) so a table's
 * `overflow-hidden` can't clip it, and flips above the trigger near the
 * bottom of the viewport. Arrow keys / Home / End move between items;
 * Escape, Tab, outside click and scroll close it.
 */
export default function Menu({
  label,
  items,
  renderTrigger,
  align = "end",
}: {
  /** Accessible name for the menu, e.g. "Actions for Jane Doe". */
  label: string;
  items: MenuEntry[];
  renderTrigger: (props: TriggerProps) => React.ReactNode;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    setPos(null);
    if (restoreFocus) anchorRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, []);

  // Position after the menu has rendered, so its real height is known.
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !menuRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const h = menuRef.current.offsetHeight;
    const below = r.bottom + 4 + h <= window.innerHeight - 8;
    const left = align === "end" ? r.right - WIDTH : r.left;
    setPos({
      top: below ? r.bottom + 4 : Math.max(8, r.top - 4 - h),
      left: Math.min(Math.max(8, left), window.innerWidth - WIDTH - 8),
    });
    menuRef.current.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus();
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !anchorRef.current?.contains(t)) close(false);
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) close(false);
    };
    const onResize = () => close(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const els = [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])];
    const i = els.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      els[(i + 1) % els.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      els[(i - 1 + els.length) % els.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      els[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      els[els.length - 1]?.focus();
    }
  };

  // Reads the DOM from the event rather than a ref, since this handler is
  // handed to renderTrigger during render.
  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    if (open) {
      setOpen(false);
      setPos(null);
      return;
    }
    setRoot(e.currentTarget.closest<HTMLElement>('[data-app="dashboard"]') ?? document.body);
    setOpen(true);
  };

  return (
    <span ref={anchorRef} className="inline-flex">
      {renderTrigger({ onClick: toggle, "aria-haspopup": "menu", "aria-expanded": open })}
      {open &&
        root &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            onKeyDown={onKeyDown}
            className="fixed z-[70] rounded-md shadow-xl py-1 overflow-y-auto"
            style={{
              width: WIDTH,
              maxHeight: "min(70vh, 480px)",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              background: "var(--dash-surface-2)",
              border: "1px solid var(--dash-border-strong)",
            }}
          >
            {items.map((item, idx) => {
              if (item.kind === "separator") return <div key={idx} role="separator" className="my-1 h-px" style={{ background: "var(--dash-border)" }} />;
              if (item.kind === "heading")
                return (
                  <div key={idx} className="dash-label px-3.5 pt-2 pb-1" style={{ color: "var(--dash-text-subtle)" }}>
                    {item.label}
                  </div>
                );
              const color = item.danger ? "var(--dash-status-danger)" : "var(--dash-text)";
              return (
                <button
                  key={idx}
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className="dash-focusable w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none focus:bg-[var(--dash-surface-3)] hover:bg-[var(--dash-surface-3)]"
                  style={{ color }}
                >
                  {item.icon && (
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center" style={{ color: item.danger ? color : "var(--dash-text-subtle)" }} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                      {item.hint}
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          root
        )}
    </span>
  );
}
