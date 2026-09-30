import { Compass, Map, MapPin, Hotel, Users, Inbox, BarChart3, Activity, type LucideIcon } from "lucide-react";
import { UserRole } from "@/lib/auth/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Matches this item as active for any nested route (e.g. /itineraries/:id). */
  matchPrefix?: boolean;
  /** Only shown to these roles; omit to show to everyone. */
  roles?: UserRole[];
  /** Key into the Sidebar's badge counts (e.g. new enquiries). */
  badge?: "newEnquiries";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: Compass },
  { href: "/dashboard/itineraries", label: "Itineraries", icon: Map, matchPrefix: true },
  { href: "/dashboard/destinations", label: "Destinations", icon: MapPin, matchPrefix: true },
  { href: "/dashboard/accommodations", label: "Accommodations", icon: Hotel, matchPrefix: true },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox, matchPrefix: true, roles: ["ADMIN"], badge: "newEnquiries" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, matchPrefix: true, roles: ["ADMIN"] },
  { href: "/dashboard/monitoring", label: "Monitoring", icon: Activity, matchPrefix: true, roles: ["ADMIN"] },
  { href: "/dashboard/users", label: "Users", icon: Users, matchPrefix: true, roles: ["ADMIN"] },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}
