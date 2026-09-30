import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import AboutHero from "@/components/public/about/AboutHero";
import AboutStatsBand from "@/components/public/about/AboutStatsBand";
import FounderStory from "@/components/public/about/FounderStory";
import ValuePillars from "@/components/public/about/ValuePillars";
import GuidesEthos from "@/components/public/about/GuidesEthos";
import { aboutStory, conservation, aboutCta } from "@/data/aboutData";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Macho Halisi | Genuine Eyes on the Wild",
  description:
    "Macho Halisi is a 100% Tanzanian-owned safari company founded by Dawson Minja. For 14+ years we have crafted bespoke journeys across the Serengeti, Kilimanjaro and Zanzibar, led by native master-naturalist guides.",
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title: "About Macho Halisi | Genuine Eyes on the Wild",
    description:
      "A 100% Tanzanian-owned safari company crafting bespoke journeys for over fourteen years, led by native naturalist guides.",
    url: `${getSiteUrl()}/about`,
    siteName: "Macho Halisi",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Macho Halisi",
  description:
    "A 100% Tanzanian-owned safari company crafting bespoke journeys across Tanzania for over fourteen years, led by native master-naturalist guides.",
  url: getSiteUrl(),
  founder: { "@type": "Person", name: "Dawson Minja" },
  foundingLocation: "Karatu, Tanzania",
  areaServed: "Tanzania",
};

export default function AboutPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <AboutHero />

      <div className="bg-[#F6F2EA] text-[#1E1913] pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Story chapters */}
          <section id="story" className="scroll-mt-28 max-w-3xl">
            <div className="space-y-14 sm:space-y-16">
              {aboutStory.map((chapter, idx) => (
                <ScrollReveal key={chapter.heading} delayMs={idx * 60} size="lift">
                  <article>
                    <div className="text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
                      {chapter.eyebrow}
                    </div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-[#1E1913] leading-tight">
                      {chapter.heading}
                    </h2>
                    <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/75 mt-4 leading-relaxed">
                      {chapter.body}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Stats band */}
          <ScrollReveal delayMs={80} size="lift" className="block mt-16 sm:mt-24">
            <AboutStatsBand />
          </ScrollReveal>

          {/* Founder */}
          <section id="founder" className="scroll-mt-28 mt-20 sm:mt-28">
            <ScrollReveal className="mb-10 sm:mb-12">
              <div className="text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
                The People Behind the Journeys
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] leading-tight">
                Founded by native eyes
              </h2>
            </ScrollReveal>
            <ScrollReveal size="lift">
              <FounderStory />
            </ScrollReveal>
          </section>

          {/* Why book with us */}
          <section id="why" className="scroll-mt-28 mt-20 sm:mt-28">
            <ScrollReveal className="mb-10 sm:mb-12 max-w-3xl">
              <div className="text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
                Why Travel With Us
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] leading-tight">
                You arrive a guest, you leave a friend
              </h2>
            </ScrollReveal>
            <ScrollReveal size="lift">
              <ValuePillars />
            </ScrollReveal>
          </section>

          {/* Guides ethos */}
          <section id="guides" className="scroll-mt-28 mt-20 sm:mt-28">
            <ScrollReveal size="lift">
              <GuidesEthos />
            </ScrollReveal>
          </section>

          {/* Conservation / impact */}
          <section id="impact" className="scroll-mt-28 mt-20 sm:mt-28">
            <ScrollReveal size="lift">
              <div className="max-w-3xl">
                <div className="text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
                  {conservation.eyebrow}
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-[#1E1913] leading-tight">
                  {conservation.heading}
                </h2>
                <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/75 mt-4 leading-relaxed">
                  {conservation.body}
                </p>
              </div>
            </ScrollReveal>
          </section>

          {/* CTA */}
          <ScrollReveal delayMs={80} size="lift" className="block">
            <div className="mt-20 sm:mt-28 p-8 sm:p-14 bg-[#1E1913] text-[#FBF7F0] text-center max-w-4xl mx-auto shadow-2xl border border-[#8A6A33]/40">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3C99A] block mb-2">
                {aboutCta.eyebrow}
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
                {aboutCta.heading}
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
                {aboutCta.body}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href={aboutCta.primary.href}
                  className="px-8 py-3.5 bg-[#8A6A33] hover:bg-[#A37E3E] text-white text-xs font-sans tracking-widest uppercase rounded shadow transition-all"
                >
                  {aboutCta.primary.label}
                </Link>
                <Link
                  href={aboutCta.secondary.href}
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-sans tracking-widest uppercase rounded border border-white/10 transition-all"
                >
                  {aboutCta.secondary.label} &rarr;
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
