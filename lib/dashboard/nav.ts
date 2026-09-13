import { Compass, Map, MapPin, Users, type LucideIcon } from "lucide-react";
import { UserRole } from "@/lib/auth/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Matches this item as active for any nested route (e.g. /itineraries/:id). */
  matchPrefix?: boolean;
  /** Only shown to these roles; omit to show to everyone. */
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: Compass },
  { href: "/dashboard/itineraries", label: "Itineraries", icon: Map, matchPrefix: true },
  { href: "/dashboard/destinations", label: "Destinations", icon: MapPin, matchPrefix: true },
  { href: "/dashboard/users", label: "Users", icon: Users, matchPrefix: true, roles: ["ADMIN"] },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}
