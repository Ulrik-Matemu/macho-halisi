"use client";

import ScrollReveal from "@/components/public/ScrollReveal";
import { useEnquiry } from "@/components/EnquiryProvider";

/** One line, one button. */
export default function TimesClosing() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="bg-safari-linen px-6 pb-[18vh] pt-[6vh] text-center text-safari-bark">
      <ScrollReveal>
        <h2 className="mx-auto max-w-[900px] font-serif-luxury font-light text-3xl leading-[1.25] tracking-[0.08em] text-balance sm:text-5xl">
          Come and make some frames of your own.
        </h2>
      </ScrollReveal>
      <ScrollReveal delayMs={200} size="lift">
        <button
          type="button"
          onClick={() => openEnquiry()}
          className="mt-12 cursor-pointer rounded border border-safari-bark/40 px-10 py-[18px] font-sans font-light text-[11px] uppercase tracking-[0.3em] text-safari-bark transition-colors hover:border-safari-russet hover:text-safari-russet"
        >
          Plan a journey
        </button>
      </ScrollReveal>
    </section>
  );
}
