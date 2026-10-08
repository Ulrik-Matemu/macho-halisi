import { Loader2 } from "lucide-react";

export default function AccommodationsLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-safari-night">
      <Loader2 className="w-8 h-8 text-safari-ochre animate-spin" />
      <p className="text-xs tracking-[0.25em] font-sans font-light text-white/50 uppercase">
        Loading accommodations...
      </p>
    </div>
  );
}
