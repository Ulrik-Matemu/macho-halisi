import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Macho Halisi",
  description: "Internal operations and management dashboard for Macho Halisi",
  // Staff-only: keep it out of search results even if a URL leaks.
  robots: { index: false, follow: false },
};

// Thin wrapper only — chrome (sidebar/topbar/auth) lives in
// (shell)/layout.tsx via DashboardShell, so the bare /dashboard/login
// route (outside that group) isn't forced into the app shell.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen font-sans">{children}</div>;
}
