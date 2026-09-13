"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthUser } from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** Re-runs the /api/auth/me check — call after an action that might change the session. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Single source of truth for the signed-in dashboard user. Previously each
 * of the five dashboard pages ran its own `/api/auth/me` effect and its own
 * `router.push("/dashboard/login?from=...")` redirect, so the header (and
 * therefore all navigation) popped in late on every route change. This
 * fetches once per shell mount and every page reads it via `useAuth()`.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.status === "ok" && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        router.push(`/dashboard/login?from=${encodeURIComponent(pathname || "/dashboard")}`);
      }
    } catch (err) {
      console.error("Failed to load session:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
    // pathname intentionally excluded — this only re-runs via refresh(),
    // not on every navigation, so the redirect target is the path at the
    // time refresh() is called (mount time).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh: load }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within the dashboard's AuthProvider");
  }
  return ctx;
}
