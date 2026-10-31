import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import AboutHero from "@/components/public/about/AboutHero";
import Image from "next/image";
import { aboutSections, aboutFleet, aboutTeamFleet } from "@/data/aboutData";
import { getSiteUrl, OG_DEFAULT_IMAGE } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us — 100% Tanzanian-Owned Safari Company | Macho Halisi",
  description:
    "Macho Halisi is a 100% Tanzanian-owned safari company founded by Dawson Minja. For 17+ years we have crafted bespoke journeys across the Serengeti, Kilimanjaro and Zanzibar, led by native master-naturalist guides.",
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title: "About Us — 100% Tanzanian-Owned Safari Company | Macho Halisi",
    description:
      "A 100% Tanzanian-owned safari company crafting bespoke journeys for over seventeen years, led by native naturalist guides.",
    url: `${getSiteUrl()}/about`,
    siteName: "Macho Halisi",
    images: [OG_DEFAULT_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      {/* The company itself is described site-wide (root layout). */}
      <Breadcrumbs visible={false} items={[{ name: "About", path: "/about" }]} />

      <AboutHero />

      {/* Plain text in the order and under the headings of the client's
          About Us document (data/aboutData.ts). */}
      <div className="bg-safari-linen text-safari-bark pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-14 sm:space-y-20">
            {aboutSections.map((section, idx) => (
              <ScrollReveal key={section.heading} delayMs={idx * 40} size="lift">
                <section id={section.heading.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")} className="scroll-mt-28">
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-safari-bark leading-tight tracking-wide">
                    {section.heading}
                  </h2>
                  {section.paragraphs.length > 0 && (
                    <div className="mt-5 space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="font-sans font-light text-sm sm:text-base text-safari-bark/75 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  {section.subsections && (
                    <div className="mt-8 space-y-7">
                      {section.subsections.map((sub) => (
                        <div key={sub.heading}>
                          <h3 className="font-serif-luxury text-lg sm:text-xl text-safari-bark">{sub.heading}</h3>
                          <p className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-2 leading-relaxed">
                            {sub.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Our Fleet — a full-bleed photo band that divides the document text
          above from the Our Team & Fleet text below. */}
      <ScrollReveal size="lift" className="block">
        <section id="our-fleet" className="relative h-[52vh] min-h-[340px] max-h-[560px] w-full bg-safari-bark scroll-mt-28">
          <Image
            src={aboutFleet.image.url}
            alt={aboutFleet.image.alt}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.14em] uppercase">
              {aboutFleet.heading}
            </h2>
            <span className="h-px w-12 bg-safari-gold/70 mt-5" />
            <p className="font-sans font-light text-sm sm:text-base text-white/85 mt-5 max-w-xl leading-relaxed">
              {aboutFleet.body}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Our Team & Fleet — the client's OUR-TEAM-AND-FLEET document. */}
      <div className="bg-safari-linen text-safari-bark pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-14 sm:space-y-20">
            <ScrollReveal size="lift">
              <section id="our-team-and-fleet" className="scroll-mt-28">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-safari-bark leading-tight tracking-wide">
                  {aboutTeamFleet.heading}
                </h2>
                <p className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-5 leading-relaxed">
                  {aboutTeamFleet.intro}
                </p>
              </section>
            </ScrollReveal>

            {[aboutTeamFleet.guides, aboutTeamFleet.fleet].map((group) => (
              <ScrollReveal key={group.heading} size="lift">
                <section className="scroll-mt-28">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-safari-bark leading-snug">
                    {group.heading}
                  </h3>
                  <p className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-4 leading-relaxed">
                    {group.intro}
                  </p>
                  <dl className="mt-8 border-t border-safari-bark/15">
                    {group.points.map((point) => (
                      <div key={point.title} className="py-6 border-b border-safari-bark/15">
                        <dt className="font-serif-luxury text-lg text-safari-bark">{point.title}</dt>
                        <dd className="font-sans font-light text-sm sm:text-base text-safari-bark/75 mt-2 leading-relaxed">
                          {point.body}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </ScrollReveal>
            ))}

            <ScrollReveal size="lift">
              <section className="scroll-mt-28">
                <h3 className="font-serif-luxury text-xl sm:text-2xl text-safari-bark leading-snug">
                  {aboutTeamFleet.promise.heading}
                </h3>
                <blockquote className="mt-5 border-l-2 border-safari-russet pl-5 font-serif-luxury text-lg sm:text-xl font-light italic text-safari-bark/85 leading-relaxed">
                  {aboutTeamFleet.promise.quote}
                </blockquote>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
