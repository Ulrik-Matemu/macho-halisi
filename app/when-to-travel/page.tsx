import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Compass, ArrowRight } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import SeasonalMatrix from "@/components/public/seasons/SeasonalMatrix";
import SeasonalErasTabs from "@/components/public/seasons/SeasonalErasTabs";
import WildlifeInterestFilter from "@/components/public/seasons/WildlifeInterestFilter";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Time to Visit Tanzania | Safari Seasons & Migration Calendar | Macho Halisi",
  description:
    "Explore month-by-month wildlife patterns in Tanzania. Track the Great Migration, calving season, dry season river crossings, and green season solitude.",
  alternates: { canonical: `${getSiteUrl()}/when-to-travel` },
  openGraph: {
    title: "Best Time to Visit Tanzania | Macho Halisi Safari Seasons",
    description:
      "Tanzania is a year-round destination. Discover the optimal month for your bespoke safari desires.",
    url: `${getSiteUrl()}/when-to-travel`,
    siteName: "Macho Halisi",
  },
};

export default function WhenToTravelPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <ScrollReveal className="mb-12 sm:mb-16 pb-10 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>Wilderness Seasons & Migration Rhythm</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-[#1E1913] tracking-[0.02em] leading-tight">
              Tanzania Across the Seasons
            </h1>
            <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/70 mt-4 max-w-3xl leading-relaxed">
              Tanzania offers breathtaking wildlife encounters every single month of the year. However,
              the wilderness changes its skin continuously: from the river crossings of July and August
              to the synchronized calving of February and the lush, quiet solitude of April.
            </p>
          </ScrollReveal>

          {/* Section 1: 12-Month Interactive Matrix */}
          <ScrollReveal delayMs={100} size="lift">
            <SeasonalMatrix />
          </ScrollReveal>

          {/* Section 2: Three Primary Eras */}
          <ScrollReveal delayMs={150} size="lift">
            <SeasonalErasTabs />
          </ScrollReveal>

          {/* Section 3: Intent-Driven Wildlife Finder */}
          <ScrollReveal delayMs={200} size="lift">
            <WildlifeInterestFilter />
          </ScrollReveal>

          {/* Closing Action */}
          <ScrollReveal delayMs={250} size="lift">
            <div className="mt-16 sm:mt-24 p-8 sm:p-14 bg-[#1E1913] text-[#FBF7F0] text-center max-w-4xl mx-auto shadow-2xl border border-[#8A6A33]/40">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3C99A] block mb-2">
                Seasonal Alignment
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
                Know Which Season Speaks to You?
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
                Tell us your target dates and desired sightings. Our Karatu naturalists will calibrate
                your route to the exact coordinates of the herds.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/enquire"
                  className="px-8 py-3.5 bg-[#8A6A33] hover:bg-[#A37E3E] text-white text-xs font-sans tracking-widest uppercase rounded shadow transition-all"
                >
                  Consult a Safari Naturalist
                </Link>
                <Link
                  href="/how-we-plan"
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-sans tracking-widest uppercase rounded border border-white/10 transition-all"
                >
                  See How We Plan →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
