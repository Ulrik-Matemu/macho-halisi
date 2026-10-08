"use client";

import { Send } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

interface AccommodationEnquireButtonProps {
  accommodationName: string;
  className?: string;
  label?: string;
  showIcon?: boolean;
}

/**
 * Enquiry CTA for an accommodation detail page. Opens the shared enquiry
 * modal seeded with the property name (as itineraryTitle — the seed's
 * generic "what is this about" slot). No itineraryId is passed, so this
 * files as a general enquiry, which the public /enquiries endpoint accepts.
 */
export default function AccommodationEnquireButton({
  accommodationName,
  className,
  label = "Enquire About This Stay",
  showIcon = true,
}: AccommodationEnquireButtonProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      type="button"
      onClick={() => openEnquiry({ itineraryTitle: accommodationName })}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-safari-ochre hover:bg-safari-russet text-safari-night hover:text-black font-serif-luxury font-medium text-xs tracking-[0.18em] uppercase rounded transition-all shadow-lg shadow-safari-ochre/20 cursor-pointer"
      }
    >
      {showIcon && <Send className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}
