import Link from "next/link";
import { Hotel } from "lucide-react";

export default function AccommodationNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-safari-night">
      <div className="max-w-md space-y-5">
        <Hotel className="w-12 h-12 text-white/20 mx-auto" />
        <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide">
          Accommodation Not Found
        </h1>
        <p className="text-sm text-white/50 font-sans leading-relaxed">
          This property may have been renamed, unpublished, or never existed.
        </p>
        <Link
          href="/accommodations"
          className="inline-flex items-center gap-2 px-6 py-3 bg-safari-ochre hover:bg-safari-russet text-safari-night hover:text-black font-serif-luxury text-xs tracking-[0.18em] uppercase font-medium rounded transition-colors"
        >
          Browse All Accommodations
        </Link>
      </div>
    </div>
  );
}
