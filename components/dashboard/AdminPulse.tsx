"use client";

import React from "react";
import Link from "next/link";
import { Activity, BarChart3, Inbox, type LucideIcon } from "lucide-react";
import { useReport } from "@/lib/dashboard/useReport";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import type { AnalyticsOverview } from "@/lib/analytics/types";
import type { EnquiryStats } from "@/lib/enquiries/types";
import type { UptimeReport } from "@/lib/monitoring/types";
import { formatNumber } from "@/lib/dashboard/format";

function PulseTile({ href, icon: Icon, label, value, detail }: { href: string; icon: LucideIcon; label: string; value: React.ReactNode; detail?: string }) {
  return (
    <Link
      href={href}
      className="dash-focusable p-4 rounded-xl transition-colors"
      style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--dash-border-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--dash-border)")}
    >
      <Icon className="w-4 h-4 mb-3" style={{ color: "var(--dash-accent)" }} />
      <div className="dash-title" style={{ color: "var(--dash-text)" }}>
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
        {label}
        {detail && <span className="block">{detail}</span>}
      </div>
    </Link>
  );
}

/** Admin-only strip on the Overview: traffic, inbox and uptime at a glance. */
export default function AdminPulse() {
  const traffic = useReport<AnalyticsOverview>("/api/analytics/overview?range=7d");
  const enquiries = useReport<EnquiryStats & { status: "ok" }>("/api/enquiries/admin/stats");
  const uptime = useReport<UptimeReport & { status: "ok" }>("/api/monitoring/uptime?range=24h");

  const down = uptime.data?.latest.filter((l) => !l.ok).length ?? 0;
  const uptimeValue = !uptime.data
    ? null
    : !uptime.data.lastCheckAt
    ? "Not set up"
    : down > 0
    ? `${down} check${down === 1 ? "" : "s"} failing`
    : uptime.data.stale
    ? "Monitor silent"
    : "Operational";

  const skeleton = <Skeleton className="h-7 w-14 mb-1" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <PulseTile
        href="/dashboard/enquiries"
        icon={Inbox}
        label="New enquiries"
        value={enquiries.data ? formatNumber(enquiries.data.byStatus.NEW) : skeleton}
        detail={enquiries.data ? `${enquiries.data.last7d} received this week` : undefined}
      />
      <PulseTile
        href="/dashboard/analytics"
        icon={BarChart3}
        label="Visitors, last 7 days"
        value={traffic.data ? formatNumber(traffic.data.current.visitors) : skeleton}
        detail={traffic.data ? `${formatNumber(traffic.data.current.pageviews)} pageviews` : undefined}
      />
      <PulseTile href="/dashboard/monitoring" icon={Activity} label="Site status" value={uptimeValue ?? skeleton} />
    </div>
  );
}
