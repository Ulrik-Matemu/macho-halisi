import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ScrollReveal from "@/components/public/ScrollReveal";
import { experiences } from "@/data/experiences";
import { experiencesClosing } from "@/data/experienceContent";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Tanzania Safari Experiences | Balloon, Cultural, Coffee, Canoeing & Night Drives | Macho Halisi",
  description:
    "Safari activities with Macho Halisi — hot air balloon safaris, Maasai, Hadzabe and Datoga cultural experiences, coffee tours, waterfall and hot spring days, canoeing and night game drives.",
  alternates: { canonical: `${getSiteUrl()}/experiences` },
};

export default function ExperiencesIndexPage() {
  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Experiences", path: "/experiences" }]} />
      <div className="bg-safari-linen text-safari-bark pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-28 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <ScrollReveal className="mb-10 sm:mb-14 pb-8 border-b border-safari-bark/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-safari-russet" />
              <span>Safari Experiences</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              Ways to Experience the Wild
            </h1>
            <p className="text-sm text-safari-bark/78 font-sans mt-3 max-w-2xl leading-relaxed">
              From a sunrise balloon flight over the Serengeti to the Maasai, Hadzabe and Datoga communities,
              Karatu coffee estates, waterfalls and hot springs, a canoe on Lake Duluti and the bush after dark —
              the moments our guests remember longest. Take any of them on their own or fold them into a longer journey.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-14">
            {experiences.map((experience, idx) => (
              <ScrollReveal key={experience.slug} delayMs={idx * 70} size="lift">
                <Link href={`/experiences/${experience.slug}`} className="group block text-safari-bark">
                  <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-safari-champagne">
                    <Image
                      src={experience.heroImage}
                      alt={experience.heroImageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="absolute left-5 top-5 font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-cream [text-shadow:0_1px_12px_rgba(18,11,6,0.7)]">
                      {String(idx + 1).padStart(2, "0")} · {experience.badge}
                    </div>
                  </div>
                  <h2 className="m-0 mb-2 font-serif-luxury font-light text-[28px] sm:text-[32px] leading-[1.12] tracking-[0.02em] group-hover:text-safari-russet transition-colors">
                    {experience.line1} <em>{experience.line2}</em>
                  </h2>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-sans font-light text-[10.5px] tracking-[0.24em] text-safari-bark/78 uppercase">
                      {experience.tagline}
                    </span>
                    <span aria-hidden className="font-sans font-light text-base text-safari-russet transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-safari-bark/20">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-16">
              <h2 className="m-0 font-serif-luxury font-light text-[clamp(28px,3.2vw,44px)] leading-[1.15] tracking-[0.02em] text-safari-bark">
                {experiencesClosing.heading}
              </h2>
              <div className="text-safari-bark/85">
                {experiencesClosing.paragraphs.map((text) => (
                  <p key={text} className="m-0 mb-6 font-sans font-light text-[16px] sm:text-[17px] leading-[1.95] text-pretty">
                    {text}
                  </p>
                ))}
                <p className="m-0 mt-8 font-serif-luxury text-[20px] tracking-[0.03em] text-safari-bark">
                  {experiencesClosing.signoff}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
