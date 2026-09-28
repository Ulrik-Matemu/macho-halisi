"use client";

import { Send } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

interface PlanTripButtonProps {
  label?: string;
  className?: string;
}

/**
 * Destination-page CTA — opens the shared enquiry modal with no itinerary
 * seed (EnquirySeed.itineraryId is optional, see
 * components/EnquiryProvider.tsx). A destination page isn't tied to one
 * specific itinerary, so unlike EnquireButton this never requires one.
 */
export default function PlanTripButton({ label = "Plan This Trip", className }: PlanTripButtonProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      type="button"
      onClick={() => openEnquiry()}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-[#181410] bg-[#C9A46A] hover:bg-[#F6F2EA] transition-colors px-10 py-4 rounded whitespace-nowrap cursor-pointer"
      }
    >
      <Send className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
