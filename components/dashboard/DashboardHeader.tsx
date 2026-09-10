"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Loader2, ShieldCheck, User, Compass, Map } from "lucide-react";
import { AuthUser } from "@/lib/auth/types";

interface DashboardHeaderProps {
  user: AuthUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      router.push("/dashboard/login");
      router.refresh();
    }
  };

  const isItinerariesActive = pathname.startsWith("/dashboard/itineraries");
  const isDashboardActive = pathname === "/dashboard";

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand mark & Nav links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="relative h-10 aspect-[180/94] rounded overflow-hidden border border-white/20 bg-black">
              <Image
                src="/media/macho-halisi-logo-2.jpg"
                alt="Macho Halisi Logo"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif-luxury text-sm tracking-[0.2em] uppercase text-white font-light">
                MACHO HALISI
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#c68642] uppercase">
                OPERATIONS DASHBOARD
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 border-l border-white/10 pl-6">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                isDashboardActive
                  ? "text-[#ffdbac] bg-white/5 font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/itineraries"
              className={`px-3 py-1.5 rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                isItinerariesActive
                  ? "text-[#ffdbac] bg-white/5 font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Itineraries</span>
            </Link>
          </nav>
        </div>

        {/* Right: User identification & Logout button */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-white/[0.03] border border-white/10">
            <User className="w-3.5 h-3.5 text-[#c68642]" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/80 font-mono hidden md:inline">
                {user.email}
              </span>
              <span className="text-white/80 font-mono md:hidden">
                {user.email.split("@")[0]}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#c68642]/20 border border-[#c68642]/40 text-[#ffdbac]">
                <ShieldCheck className="w-2.5 h-2.5 text-[#c68642]" />
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-3 sm:px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded text-xs font-serif-luxury tracking-[0.16em] uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5 text-white/60" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
