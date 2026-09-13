"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, LogOut, ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";
import { AuthUser } from "@/lib/auth/types";

export default function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      router.push("/dashboard/login");
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="dash-focusable w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors"
        style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--dash-surface-3)", color: "var(--dash-accent)" }}
        >
          <UserIcon className="w-4 h-4" />
        </span>
        <span className="min-w-0 text-left flex-1">
          <span className="block text-sm truncate" style={{ color: "var(--dash-text)" }}>
            {user.email}
          </span>
          <span className="block text-xs" style={{ color: "var(--dash-text-subtle)" }}>
            {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          </span>
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "" : "rotate-180"}`}
          style={{ color: "var(--dash-text-subtle)" }}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-2 rounded-md shadow-xl overflow-hidden"
          style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)" }}
        >
          <div className="px-3.5 py-3 flex items-center gap-2 text-xs" style={{ borderBottom: "1px solid var(--dash-border)" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--dash-accent)" }} />
            <span style={{ color: "var(--dash-text-muted)" }}>Two-factor authentication enforced</span>
          </div>
          <button
            role="menuitem"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="dash-focusable w-full flex items-center gap-2.5 px-3.5 py-3 text-sm text-left transition-colors disabled:opacity-60"
            style={{ color: "var(--dash-text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dash-surface-3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
