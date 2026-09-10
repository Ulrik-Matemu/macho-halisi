import { Loader2 } from "lucide-react";

export default function ItinerariesLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#080808]">
      <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
      <p className="text-xs tracking-[0.25em] font-sans font-light text-white/50 uppercase">
        Loading safari itineraries...
      </p>
    </div>
  );
}
