"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/dashboard/auth-context";
import { BreadcrumbProvider, useBreadcrumbLabel } from "@/lib/dashboard/breadcrumb-context";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SkipLink from "./SkipLink";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const trailingLabel = useBreadcrumbLabel();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--dash-bg)" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--dash-accent)" }} />
        <span className="sr-only">Loading dashboard</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <SkipLink />
      <Sidebar user={user} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} trailingLabel={trailingLabel} />
        <main id="main-content" className="flex-1 min-w-0">
          <div className="mx-auto w-full px-4 sm:px-6 py-8" style={{ maxWidth: "var(--dash-content)" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Single mount point for the dashboard's chrome. Wraps every page under
 * app/dashboard/(shell)/ — auth is fetched once here (see auth-context.tsx)
 * instead of once per page, so the sidebar/topbar render immediately
 * rather than popping in after each page's own /api/auth/me effect
 * resolves.
 */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-app="dashboard">
      <AuthProvider>
        <BreadcrumbProvider>
          <ShellInner>{children}</ShellInner>
        </BreadcrumbProvider>
      </AuthProvider>
    </div>
  );
}
