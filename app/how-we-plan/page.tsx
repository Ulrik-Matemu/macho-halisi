import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import PlanStagesRail from "@/components/public/planning/PlanStagesRail";
import PlanningComparison from "@/components/public/planning/PlanningComparison";
import SafariVehicleBlueprint from "@/components/public/planning/SafariVehicleBlueprint";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Plan Bespoke Tanzanian Safaris | Macho Halisi",
  description:
    "Discover how Macho Halisi designs bespoke Tanzanian safaris from scratch — private 4x4 Land Cruisers, certified master naturalists, and synchronized migration routes.",
  alternates: { canonical: `${getSiteUrl()}/how-we-plan` },
  openGraph: {
    title: "How We Plan Bespoke Tanzanian Safaris | Macho Halisi",
    description:
      "From a blank map to the African bush. Explore our five-stage bespoke safari planning process.",
    url: `${getSiteUrl()}/how-we-plan`,
    siteName: "Macho Halisi",
  },
};

export default function HowWePlanPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Page Hero Header */}
          <ScrollReveal className="mb-12 sm:mb-16 pb-10 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
              <Compass className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>Bespoke Safari Architecture</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-[#1E1913] tracking-[0.02em] leading-tight">
              From a Blank Map to the Bush
            </h1>
            <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/70 mt-4 max-w-3xl leading-relaxed">
              &ldquo;Macho Halisi&rdquo; translates from Swahili to &ldquo;Genuine Eyes.&rdquo; We believe
              a true African safari cannot be purchased off a conveyor belt. It must be drawn around your
              rhythm, your sensory desires, and the seasonal movement of wildlife across Tanzania.
            </p>
          </ScrollReveal>

          {/* Section 1: The 5-Stage Blueprint */}
          <ScrollReveal delayMs={100} size="lift">
            <PlanStagesRail />
          </ScrollReveal>

          {/* Section 2: Commercial Tour vs Bespoke Architecture */}
          <ScrollReveal delayMs={150} size="lift">
            <PlanningComparison />
          </ScrollReveal>

          {/* Section 3: The Custom 4x4 Cruiser Blueprint
          <ScrollReveal delayMs={200} size="lift">
            <SafariVehicleBlueprint />
          </ScrollReveal> */}

          {/* Bottom Call to Action */}
          <ScrollReveal delayMs={250} size="lift">
            <div className="mt-16 sm:mt-24 p-8 sm:p-14 bg-[#1E1913] text-[#FBF7F0] text-center max-w-4xl mx-auto shadow-2xl border border-[#8A6A33]/40">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3C99A] block mb-2">
                Begin Your Route
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
                Ready to Draw Your Route With Us?
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
                Connect directly with our master naturalist planning directors in Karatu to begin your
                bespoke expedition blueprint.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/enquire"
                  className="px-8 py-3.5 bg-[#8A6A33] hover:bg-[#A37E3E] text-white text-xs font-sans tracking-widest uppercase rounded shadow transition-all"
                >
                  Start Planning With a Naturalist
                </Link>
                <Link
                  href="/when-to-travel"
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-sans tracking-widest uppercase rounded border border-white/10 transition-all"
                >
                  Discover When to Travel →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
