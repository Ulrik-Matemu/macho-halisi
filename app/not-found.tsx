import Link from "next/link";
import { Compass } from "lucide-react";

// Global 404. The fullscreen nav menu currently links to several routes
// that aren't built yet (see data/navigationData.ts) — this doesn't change
// any of those links, it only changes where they (and any mistyped URL)
// land: a branded page instead of Next's stark default.
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#080808]">
      <div className="max-w-md space-y-5">
        <Compass className="w-12 h-12 text-white/20 mx-auto" />
        <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide">
          Page Not Found
        </h1>
        <p className="text-sm text-white/50 font-sans leading-relaxed">
          This page may have moved, or the journey you're looking for hasn't been published yet.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c68642] hover:bg-[#8d5524] text-[#080808] hover:text-black font-serif-luxury text-xs tracking-[0.18em] uppercase font-medium rounded transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/itineraries"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/70 hover:text-white font-serif-luxury text-xs tracking-[0.18em] uppercase font-light rounded transition-colors"
          >
            Browse Itineraries
          </Link>
        </div>
      </div>
    </div>
  );
}
