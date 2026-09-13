import React from "react";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
