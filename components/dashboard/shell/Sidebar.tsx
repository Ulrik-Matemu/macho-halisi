"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AuthUser } from "@/lib/auth/types";
import { NAV_ITEMS, isNavItemActive } from "@/lib/dashboard/nav";
import UserMenu from "./UserMenu";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function NavLinks({ user, onNavigate }: { user: AuthUser; onNavigate?: () => void }) {
  const pathname = usePathname() || "";
  return (
    <nav aria-label="Dashboard" className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role)).map((item) => {
        const active = isNavItemActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className="dash-focusable flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors min-h-[44px]"
            style={{
              color: active ? "var(--dash-text)" : "var(--dash-text-muted)",
              background: active ? "var(--dash-surface-2)" : "transparent",
              fontWeight: active ? 500 : 400,
              borderLeft: active ? "2px solid var(--dash-accent)" : "2px solid transparent",
            }}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "var(--dash-accent)" : "currentColor" }} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="dash-focusable flex items-center gap-3 px-4 py-4 shrink-0">
      <div className="relative h-9 aspect-[180/94] rounded overflow-hidden shrink-0" style={{ border: "1px solid var(--dash-border-strong)" }}>
        <Image src="/media/macho-halisi-logo-2.jpg" alt="Macho Halisi logo" fill priority className="object-cover object-center" />
      </div>
      <span className="text-sm font-medium truncate" style={{ color: "var(--dash-text)" }}>
        Macho Halisi
      </span>
    </Link>
  );
}

interface SidebarProps {
  user: AuthUser;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * ≥1024px: a persistent sticky rail. Below that: an off-canvas drawer with
 * its own focus trap/Escape/scroll-lock, replacing the old top nav that was
 * simply `hidden md:flex` — below 768px there was previously NO way to
 * reach Itineraries, Destinations, or Users at all.
 */
export default function Sidebar({ user, mobileOpen, onCloseMobile }: SidebarProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    triggerRef.current = document.activeElement;
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile();
        return;
      }
      if (e.key !== "Tab" || !drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {/* Desktop persistent rail */}
      <aside
        className="hidden lg:flex flex-col shrink-0 sticky top-0"
        style={{
          width: "var(--dash-sidebar-w)",
          height: "100dvh",
          background: "var(--dash-surface-1)",
          borderRight: "1px solid var(--dash-border)",
        }}
      >
        <Brand />
        <NavLinks user={user} />
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--dash-border)" }}>
          <UserMenu user={user} />
        </div>
      </aside>

      {/* Mobile off-canvas drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{ background: "rgb(0 0 0 / 60%)" }}
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="absolute left-0 top-0 bottom-0 flex flex-col shadow-2xl"
            style={{ width: "min(85vw, 300px)", background: "var(--dash-surface-1)" }}
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation"
                className="dash-focusable mr-3 p-2 rounded-md shrink-0"
                style={{ color: "var(--dash-text-subtle)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavLinks user={user} onNavigate={onCloseMobile} />
            <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--dash-border)" }}>
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
