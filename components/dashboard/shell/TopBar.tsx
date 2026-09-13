"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/dashboard/nav";

interface Crumb {
  label: string;
  href?: string;
}

function buildCrumbs(pathname: string, trailingLabel?: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/dashboard" }];
  if (pathname === "/dashboard") return crumbs;

  const section = NAV_ITEMS.find((item) => item.href !== "/dashboard" && pathname.startsWith(item.href));
  if (section) {
    const isExactly = pathname === section.href;
    crumbs.push({ label: section.label, href: isExactly ? undefined : section.href });
  }

  if (trailingLabel) {
    crumbs.push({ label: trailingLabel });
  } else if (pathname.endsWith("/new")) {
    crumbs.push({ label: "New" });
  }

  return crumbs;
}

interface TopBarProps {
  onOpenMobileNav: () => void;
  /** Overrides the final breadcrumb segment — e.g. the itinerary's title on the editor page. */
  trailingLabel?: string;
}

/**
 * Sticky top strip carrying the mobile hamburger and a breadcrumb trail.
 * Its height is published as --dash-topbar-h so nested sticky bars (the
 * itinerary editor's autosave strip) can anchor to it instead of the
 * magic-number `top-[69px]` the old header used.
 */
export default function TopBar({ onOpenMobileNav, trailingLabel }: TopBarProps) {
  const pathname = usePathname() || "/dashboard";
  const crumbs = buildCrumbs(pathname, trailingLabel);

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6"
      style={{
        height: "var(--dash-topbar-h)",
        background: "color-mix(in srgb, var(--dash-bg) 92%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--dash-border)",
      }}
    >
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="dash-focusable lg:hidden p-2 -ml-2 rounded-md shrink-0"
        style={{ color: "var(--dash-text-muted)" }}
      >
        <Menu className="w-5 h-5" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
        <ol className="flex items-center gap-1.5 text-sm truncate">
          {crumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-1.5 min-w-0">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--dash-text-subtle)" }} />}
              {crumb.href ? (
                <Link href={crumb.href} className="dash-focusable rounded truncate" style={{ color: "var(--dash-text-subtle)" }}>
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate" aria-current="page" style={{ color: "var(--dash-text)" }}>
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
