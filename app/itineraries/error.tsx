"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ItinerariesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Itineraries route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#080808]">
      <div className="max-w-md p-8 bg-[#111] border border-red-900/40 rounded-xl space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-sm text-red-200">
          Something went wrong while loading this safari itinerary.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => retry()}
            className="px-5 py-2.5 bg-[#c68642] text-[#080808] text-xs font-sans uppercase tracking-wider rounded font-medium cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-white/15 text-white/70 hover:text-white text-xs font-sans font-light uppercase tracking-wider rounded transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
