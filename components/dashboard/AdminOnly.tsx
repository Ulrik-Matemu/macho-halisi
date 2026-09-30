"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import EmptyState from "@/components/dashboard/ui/EmptyState";

/**
 * Renders children only for ADMIN users. This is presentation only — the
 * backend's requireRole(ADMIN) on every analytics/monitoring/enquiry route
 * is the actual enforcement.
 */
export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "ADMIN") {
    return <EmptyState icon={ShieldAlert} title="Admins only" description="This area is restricted to administrator accounts." />;
  }
  return <>{children}</>;
}
