"use client";

import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { useEnquiry } from "@/components/EnquiryProvider";

/** The last page of the issue: an invitation to make some frames of your own. */
export default function TimesClosing() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="bg-safari-russet px-6 sm:px-16 py-24 sm:py-32 text-center text-safari-cream">
      <div className="max-w-[1000px] mx-auto">
        <ScrollReveal size="lift">
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-champagne uppercase mb-6">End of issue Nº 01</div>
        </ScrollReveal>
        <ScrollReveal delayMs={120}>
          <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.16] tracking-[0.08em] text-balance">
            Come and make some frames of your own.
          </h2>
        </ScrollReveal>
        <ScrollReveal delayMs={240} size="lift">
          <p className="mt-8 font-sans font-light text-[15px] leading-[2] text-safari-cream/90 max-w-lg mx-auto">
            Tell us how you like to travel and we will draw the route around you, with a guide who knows where the light will be.
          </p>
        </ScrollReveal>
        <ScrollReveal delayMs={360} size="lift">
          <div className="mt-10 flex justify-center items-center gap-7 flex-wrap">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-cream bg-safari-bark hover:bg-safari-night uppercase px-10 py-[18px] rounded transition-colors cursor-pointer"
            >
              Start planning
            </button>
            <Link
              href="/itineraries"
              className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-cream hover:text-safari-champagne uppercase py-[18px] transition-colors"
            >
              Browse itineraries →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
