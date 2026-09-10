"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Compass,
  DollarSign,
  Moon,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AuthUser } from "@/lib/auth/types";

export default function NewItineraryPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [nights, setNights] = useState<number | "">(7);
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [startingPrice, setStartingPrice] = useState<number | "">(4500);

  const [submitting, setSubmitting] = useState(false);
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
          if (data.user.role === "VIEWER") {
            setError("Viewer clearance does not have permission to create new itineraries.");
          }
        } else {
          router.push("/dashboard/login?from=/dashboard/itineraries/new");
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
      } finally {
        if (isMounted) setLoadingAuth(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide an itinerary title.");
      return;
    }

    if (!priceOnRequest && (startingPrice === "" || Number(startingPrice) <= 0)) {
      setError("Please specify a valid starting price in USD, or switch to 'Price on Request'.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        nights: nights === "" ? 0 : Number(nights),
        priceOnRequest,
        startingPrice: priceOnRequest ? null : Number(startingPrice),
        days: [],
        destinationIds: [],
        images: [],
      };

      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "ok" || !data.itinerary?.id) {
        throw new Error(data.message || "Failed to initialize itinerary draft.");
      }

      // Transition smoothly to the multi-tab autosave editor
      router.push(`/dashboard/itineraries/${data.itinerary.id}`);
    } catch (err: any) {
      console.error("Create itinerary failed:", err);
      setError(err.message || "An unexpected error occurred while creating the itinerary.");
      setSubmitting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#080808]">
        <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
        <p className="text-xs tracking-[0.25em] font-mono text-white/50 uppercase">
          Verifying authorization...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080808]">
      {user && <DashboardHeader user={user} />}

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/itineraries"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Itineraries</span>
          </Link>
        </div>

        {/* Card Header */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#e0ac69] uppercase">
              <Compass className="w-4 h-4 text-[#c68642]" />
              <span>Step 1 of Itinerary Assembly</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide">
              Initialize New Safari Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
              Define the foundational details to generate your draft record. You will be redirected
              to the multi-tab editor where day-by-day itineraries, destinations, travel notes, and
              high-resolution gallery photos autosave in real time.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs text-red-200 leading-relaxed font-sans">{error}</div>
            </div>
          )}

          {/* Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/80 mb-2">
                Itinerary Title *
              </label>
              <input
                type="text"
                required
                disabled={submitting || user?.role === "VIEWER"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 8-Day Serengeti Migration & Ngorongoro Expedition"
                className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-50"
              />
              <p className="text-[11px] text-white/40 mt-1.5 font-sans">
                A URL slug will be automatically created from this title and can be customized in the editor.
              </p>
            </div>

            {/* Nights & Pricing grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Nights */}
              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/80 mb-2 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-[#c68642]" />
                  Duration (Nights)
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={submitting || user?.role === "VIEWER"}
                  value={nights}
                  onChange={(e) => setNights(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 7"
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              {/* Price on Request Toggle */}
              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/80 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#c68642]" />
                  Pricing Structure
                </label>
                <div className="h-[46px] flex items-center justify-between px-4 bg-[#141414] border border-white/15 rounded">
                  <span className="text-xs text-white/70">Price on Request</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={submitting || user?.role === "VIEWER"}
                      checked={priceOnRequest}
                      onChange={(e) => setPriceOnRequest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c68642]" />
                  </label>
                </div>
              </div>
            </div>

            {/* Starting Price Input (if not priceOnRequest) */}
            {!priceOnRequest && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/80 mb-2">
                  Starting Price per Person (USD) *
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={1}
                    required
                    disabled={submitting || user?.role === "VIEWER"}
                    value={startingPrice}
                    onChange={(e) =>
                      setStartingPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="4500"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded pl-8 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-50 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
              <Link
                href="/dashboard/itineraries"
                className="px-5 py-2.5 text-xs font-serif-luxury uppercase tracking-wider text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || user?.role === "VIEWER"}
                className="px-6 py-3 bg-[#c68642] hover:bg-[#b57736] text-[#080808] hover:text-black font-serif-luxury font-medium text-xs tracking-[0.16em] uppercase rounded transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#c68642]/20 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Draft...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create & Open Editor</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
