import Link from "next/link";
import { Compass } from "lucide-react";

export default function ItineraryNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#080808]">
      <div className="max-w-md space-y-5">
        <Compass className="w-12 h-12 text-white/20 mx-auto" />
        <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide">
          Itinerary Not Found
        </h1>
        <p className="text-sm text-white/50 font-sans leading-relaxed">
          This safari journey may have been renamed, unpublished, or never existed.
        </p>
        <Link
          href="/itineraries"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#c68642] hover:bg-[#8d5524] text-[#080808] hover:text-black font-serif-luxury text-xs tracking-[0.18em] uppercase font-medium rounded transition-colors"
        >
          Browse All Journeys
        </Link>
      </div>
    </div>
  );
}
