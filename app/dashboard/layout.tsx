import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Macho Halisi",
  description: "Internal operations and management dashboard for Macho Halisi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f4f4f0] flex flex-col font-sans selection:bg-[#8d5524] selection:text-[#ffdbac]">
      {children}
    </div>
  );
}
