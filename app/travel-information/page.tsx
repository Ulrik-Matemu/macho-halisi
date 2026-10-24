import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import TravelInfoStickyNav from "@/components/public/travel-info/TravelInfoStickyNav";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { faqPage, JsonLd } from "@/lib/seo/jsonLd";
import { TRAVEL_FAQS, TRAVEL_SECTIONS, travelIntro, type TravelEntry } from "@/data/travelInfoData";

export const metadata: Metadata = {
  title: "Tanzania Travel Information: Visas, Climate, Currency & Safety | Macho Halisi",
  description:
    "Travel information for your Tanzanian safari — visas, baggage limits, climate and clothing, safari guidelines, photography, currency, national park rules, tipping, and health and safety.",
  alternates: { canonical: `${getSiteUrl()}/travel-information` },
  openGraph: {
    title: "Tanzania Travel Information | Macho Halisi",
    description:
      "Everything to prepare for a Tanzanian safari: visas, climate, currency, park rules, tipping, and health and safety.",
    url: `${getSiteUrl()}/travel-information`,
    siteName: "Macho Halisi",
  },
};

function Entry({ entry, nested = false }: { entry: TravelEntry; nested?: boolean }) {
  return (
    <div className={nested ? "pl-4 border-l-2 border-safari-bark/15" : "py-6 border-b border-safari-bark/15"}>
      {entry.title && (
        <h3 className={`font-serif-luxury text-safari-bark ${nested ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}>
          {entry.title}
        </h3>
      )}
      {entry.body && (
        <p className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-2 leading-relaxed">
          {entry.body}
        </p>
      )}
      {entry.items && (
        <div className="mt-4 space-y-4">
          {entry.items.map((item) => (
            <Entry key={item.title} entry={item} nested />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TravelInformationPage() {
  return (
    <SiteChrome>
      <JsonLd data={faqPage(TRAVEL_FAQS)} />
      <Breadcrumbs visible={false} items={[{ name: "Travel information", path: "/travel-information" }]} />
      <SmoothScroll />
      <div className="bg-safari-linen text-safari-bark pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <ScrollReveal className="mb-10 sm:mb-12 pb-8 border-b border-safari-bark/10">
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-safari-bark tracking-[0.02em] leading-tight">
              {travelIntro.title}
            </h1>
            <p className="font-sans font-light text-sm sm:text-base text-safari-bark/78 mt-4 max-w-3xl leading-relaxed">
              {travelIntro.welcome}
            </p>
          </ScrollReveal>

          {/* Sticky Navigation Sub-Header */}
          <TravelInfoStickyNav />

          {/* The document's nine sections, in order. Plain text from
              data/travelInfoData.ts. */}
          <div className="max-w-3xl">
            {TRAVEL_SECTIONS.map((section) => (
              <ScrollReveal key={section.id} size="lift">
                <section id={section.id} className="py-10 sm:py-14 scroll-mt-28">
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-safari-bark leading-tight tracking-wide">
                    <span className="text-safari-russet">{section.number}.</span> {section.title}
                  </h2>
                  {section.intro && (
                    <p className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-5 leading-relaxed">
                      {section.intro}
                    </p>
                  )}
                  <div className="mt-6 border-t border-safari-bark/15">
                    {section.entries.map((entry) => (
                      <Entry key={entry.title} entry={entry} />
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
