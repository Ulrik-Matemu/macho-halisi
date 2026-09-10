"use client";

import { Send } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

interface EnquireButtonProps {
  itineraryId: string;
  itineraryTitle: string;
  className?: string;
}

/**
 * Small client island dropped into an otherwise server-rendered itinerary
 * detail page. Opens the shared enquiry modal (via EnquiryProvider, mounted
 * in SiteChrome) seeded with this itinerary — the modal itself does not yet
 * read the seed to pre-fill the form (that lands with the enquiry pipeline),
 * but the click-through experience is already fully wired end to end.
 */
export default function EnquireButton({ itineraryId, itineraryTitle, className }: EnquireButtonProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      type="button"
      onClick={() => openEnquiry({ itineraryId, itineraryTitle })}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c68642] hover:bg-[#8d5524] text-[#080808] hover:text-black font-serif-luxury font-medium text-xs tracking-[0.18em] uppercase rounded transition-all shadow-lg shadow-[#c68642]/20 cursor-pointer"
      }
    >
      <Send className="w-3.5 h-3.5" />
      <span>Enquire About This Journey</span>
    </button>
  );
}
