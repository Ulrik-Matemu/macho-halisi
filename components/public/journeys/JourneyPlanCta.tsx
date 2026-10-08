import PlanTripButton from "@/components/public/destinations/PlanTripButton";

/** Dark closing band — both actions open the shared enquiry modal. */
export default function JourneyPlanCta() {
  return (
    <section id="plan" className="mt-24 sm:mt-[130px] bg-safari-bark text-safari-cream">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-16 py-20 sm:py-[116px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12 sm:gap-20 items-end">
        <div>
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-[22px]">
            Not seeing it?
          </div>
          <h2 className="m-0 font-serif-luxury font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[0.02em] text-safari-cream">
            Every journey
            <br />
            <em className="italic text-safari-sand">starts as a draft</em>
          </h2>
        </div>
        <div>
          <p className="m-0 mb-9 max-w-[460px] font-sans font-light text-[15.5px] leading-[2] text-safari-cream/72">
            Use any of these as a starting point, or tell us what you have in mind. We reply within 24 hours
            with a route, dates and a firm price.
          </p>
          <div className="flex flex-wrap items-center gap-[26px]">
            <PlanTripButton
              label="Plan my journey"
              className="inline-flex items-center gap-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-bark bg-safari-gold hover:bg-safari-cream transition-colors px-10 py-[18px] rounded-[2px] cursor-pointer"
            />
            <PlanTripButton
              label="Speak to a planner →"
              className="inline-flex items-center gap-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-cream hover:text-safari-gold transition-colors cursor-pointer [&>svg]:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
