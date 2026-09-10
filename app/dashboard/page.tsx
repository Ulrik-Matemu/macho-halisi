"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AuthUser } from "@/lib/auth/types";
import { Loader2, ShieldCheck, CheckCircle2, Compass, KeyRound } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.status === "ok" && data.user) {
          setUser(data.user);
        } else {
          router.push("/dashboard/login?from=/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          setError("Failed to verify authentication session.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
        <p className="text-xs tracking-[0.25em] font-mono text-white/50 uppercase">
          Verifying security clearance...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-6 bg-[#111] border border-red-900/40 rounded-lg">
          <p className="text-sm text-red-200 mb-4">{error || "Unauthorized session."}</p>
          <button
            onClick={() => router.push("/dashboard/login")}
            className="px-4 py-2 bg-[#c68642] text-[#ffdbac] text-xs font-mono uppercase tracking-wider rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#080808]">
      {/* Authenticated Header */}
      <DashboardHeader user={user} />

      {/* Main Dashboard Content Shell */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="p-6 sm:p-10 rounded-xl bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[#8d5524]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#e0ac69] uppercase">
              <Compass className="w-4 h-4 text-[#c68642]" />
              <span>Operations Portal Active</span>
            </div>
            
            <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
              Welcome, <span className="text-[#ffdbac]">{user.email}</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans leading-relaxed pt-1">
              You are signed in to the Macho Halisi management dashboard shell. All communications with the Express API are protected through server-side httpOnly session credentials and two-factor authentication.
            </p>
          </div>

          {/* Decorative background glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#c68642]/5 blur-3xl pointer-events-none rounded-full" />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Auth Status */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#0e0e0e] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/50">
                Security Session
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-serif-luxury text-white">Authenticated</div>
              <p className="text-xs text-white/60 mt-1 font-sans">
                Tokens isolated in httpOnly cookies (client-script inaccessible).
              </p>
            </div>
          </div>

          {/* Card 2: Role Authorization */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#0e0e0e] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/50">
                Assigned Role
              </span>
              <ShieldCheck className="w-4 h-4 text-[#c68642]" />
            </div>
            <div>
              <div className="text-lg font-serif-luxury text-[#ffdbac] tracking-wide">
                {user.role}
              </div>
              <p className="text-xs text-white/60 mt-1 font-sans">
                Verified permissions issued by the Express backend.
              </p>
            </div>
          </div>

          {/* Card 3: 2FA Protection */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#0e0e0e] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/50">
                MFA Clearance
              </span>
              <KeyRound className="w-4 h-4 text-[#e0ac69]" />
            </div>
            <div>
              <div className="text-lg font-serif-luxury text-white">Enforced</div>
              <p className="text-xs text-white/60 mt-1 font-sans">
                TOTP challenge completed successfully.
              </p>
            </div>
          </div>
        </div>

        {/* Content Operations Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-white/60 flex items-center gap-2">
              <span>Operational Modules</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Itinerary Management Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0e0e0e] border border-white/10 hover:border-[#c68642]/40 transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#c68642]/10 border border-[#c68642]/30 flex items-center justify-center text-[#ffdbac]">
                    <Compass className="w-5 h-5 text-[#c68642]" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-white/60">
                    CMS Module
                  </span>
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#ffdbac] transition-colors">
                    Safari Itineraries
                  </h3>
                  <p className="text-xs text-white/60 mt-1.5 font-sans leading-relaxed">
                    Create, assemble, and publish luxury safari journeys with day-by-day programs, destination connections, pricing matrices, and real-time autosave.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => router.push("/dashboard/itineraries")}
                  className="px-4 py-2.5 bg-[#c68642] hover:bg-[#b57736] text-[#080808] hover:text-black text-xs font-serif-luxury uppercase tracking-wider rounded font-medium transition-colors cursor-pointer"
                >
                  Manage Itineraries
                </button>
                {user.role !== "VIEWER" && (
                  <button
                    onClick={() => router.push("/dashboard/itineraries/new")}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-serif-luxury uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    + New Itinerary
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
