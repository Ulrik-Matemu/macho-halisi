import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { experiences } from "@/data/experiences";

/**
 * Dark band under the featured itineraries: the six activities from
 * data/experiences.ts, so the homepage shows there is more to a Macho
 * Halisi trip than game drives.
 */
export default function HomeExperiences() {
  return (
    <section className="relative z-10 bg-safari-bark text-safari-cream py-20 sm:py-28">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">
              Activities &amp; Experiences
            </div>
            <h2 className="m-0 font-serif-luxury font-light text-[clamp(32px,4.4vw,62px)] leading-[1.06] tracking-[0.04em] text-safari-cream">
              Beyond the <em className="text-safari-sand">game drive</em>
            </h2>
          </div>
          <p className="m-0 max-w-md font-sans font-light text-[15px] leading-[1.95] text-safari-cream/85">
            Sunrise above the Serengeti, mornings with Tanzania&rsquo;s communities, coffee estates, waterfalls, lakes
            and the bush after dark. Add any of them to your journey.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {experiences.map((experience, idx) => (
            <ScrollReveal key={experience.slug} delayMs={(idx % 3) * 80} size="lift">
              <Link
                href={`/experiences/${experience.slug}`}
                className="group relative block aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-safari-night"
              >
                <Image
                  src={experience.heroImage}
                  alt={experience.heroImageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night/90 via-safari-night/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="font-sans font-light text-[10.5px] tracking-[0.3em] uppercase text-safari-champagne mb-2">
                    {String(idx + 1).padStart(2, "0")} · {experience.badge}
                  </div>
                  <h3 className="m-0 mb-2 font-serif-luxury font-light text-[26px] sm:text-[30px] leading-[1.12] tracking-[0.02em] text-safari-cream">
                    {experience.line1} <em>{experience.line2}</em>
                  </h3>
                  <p className="m-0 font-sans font-light text-[13px] leading-relaxed text-safari-cream/85">
                    {experience.tagline}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 sm:mt-16" size="lift">
          <Link
            href="/experiences"
            className="inline-block font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-cream border border-safari-cream/40 hover:border-safari-gold hover:text-safari-gold px-8 py-4 rounded-sm transition-colors"
          >
            All experiences →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
