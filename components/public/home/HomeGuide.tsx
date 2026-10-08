import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DestinationCard from "@/components/public/destinations/DestinationCard";
import PlanTripButton from "@/components/public/destinations/PlanTripButton";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { bestTimeFaqs } from "@/components/public/seasons/MonthByMonthGuide";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { SEASONAL_ERAS } from "@/data/seasonalData";
import { PLANNING_STAGES } from "@/data/planningData";
import { getPublishedItineraries, formatStartingPrice } from "@/lib/public/api";
import { faqPage, JsonLd } from "@/lib/seo/jsonLd";
import { SITE } from "@/lib/site";

const FEATURED_DESTINATIONS = ["serengeti", "ngorongoro", "tarangire", "kilimanjaro", "zanzibar", "southern-circuit"];

const eyebrow = "font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4";
const heading = "font-serif-luxury font-light text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] tracking-[0.14em] text-safari-bark uppercase";
const body = "font-sans font-light text-[15px] leading-[1.95] text-safari-bark/72";

const toNumber = (v: number | string | null) => (v === null ? null : Number(v));

/**
 * The homepage's readable layer under the hero and featured journeys:
 * who we are, where we go, when to go, how planning works, and the
 * questions guests ask first. Everything is server-rendered from the
 * site's own data, so search engines and AI assistants get a full,
 * linkable overview — and every section ends in a way to enquire.
 */
export default async function HomeGuide() {
  const { data: itineraries } = await getPublishedItineraries({ limit: 100 });
  const prices = itineraries
    .filter((i) => !i.priceOnRequest)
    .map((i) => toNumber(i.startingPrice))
    .filter((n): n is number => n !== null && Number.isFinite(n) && n > 0);
  const lengths = itineraries.map((i) => i.nights).filter((n): n is number => n !== null).map((n) => n + 1);
  const fromPrice = prices.length ? formatStartingPrice(Math.min(...prices)) : null;

  const featured = FEATURED_DESTINATIONS.map((slug) => destinations.find((d) => d.slug === slug)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d)
  );
  const more = destinations.filter((d) => !FEATURED_DESTINATIONS.includes(d.slug));

  const faqs = [
    {
      question: "How much does a Tanzania safari with Macho Halisi cost?",
      answer: `Every safari is tailor-made, so the price depends on season, length, lodges and group size.${
        fromPrice ? ` Our published itineraries start from US$${fromPrice} per person.` : ""
      } Send us your dates and we reply ${SITE.replyPromise} with a firm, itemised quote — no deposit until the route is right.`,
    },
    bestTimeFaqs()[0],
    {
      question: "How many days do I need for a safari in Tanzania?",
      // Durations from the site's own journey collections (data/journeys.ts).
      answer: `Our signature Great Migration safari through the Serengeti and Ngorongoro Crater runs 8 days. Kilimanjaro climbs take 5 to 10 days — we recommend 8 days on the Lemosho route for the best summit success — and Zanzibar stays run from a long weekend to 9 days.${
        lengths.length ? ` Our published itineraries run from ${Math.min(...lengths)} to ${Math.max(...lengths)} days.` : ""
      }`,
    },
    {
      question: "Is Macho Halisi a local Tanzanian company?",
      answer: SITE.description,
    },
    {
      question: "How do I book a safari?",
      answer: `Send an enquiry through the website, call ${SITE.phone}, WhatsApp us or email ${SITE.email}. A safari specialist replies ${SITE.replyPromise} with dates, camps and a firm price.`,
    },
  ];

  return (
    <div className="relative z-10 bg-[#EFE9DE] text-safari-bark">
      <JsonLd data={faqPage(faqs)} />

      {/* Intro — the answer-first summary AI assistants quote */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
        <div className={eyebrow}>Tanzania safaris by native guides</div>
        <h2 className={`${heading} max-w-4xl`}>Your eyes on Tanzania</h2>
        <p className={`${body} max-w-3xl mt-8`}>{SITE.description}</p>
        <p className={`${body} max-w-3xl mt-4`}>
          We plan private safaris, Kilimanjaro climbs and Zanzibar beach stays around the way you want to travel — from
          the Great Migration in the{" "}
          <Link href="/destinations/serengeti" className="underline decoration-safari-bark/25 underline-offset-4 hover:text-safari-russet">
            Serengeti
          </Link>{" "}
          to the black rhino of the{" "}
          <Link href="/destinations/ngorongoro" className="underline decoration-safari-bark/25 underline-offset-4 hover:text-safari-russet">
            Ngorongoro Crater
          </Link>
          .
        </p>
      </section>

      {/* Destinations */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
        <div className="flex items-end justify-between gap-10 mb-11 flex-wrap">
          <div>
            <div className={eyebrow}>Where we travel</div>
            <h2 className={heading}>Tanzania safari destinations</h2>
          </div>
          <Link href="/destinations" className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap">
            All destinations →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
        {more.length > 0 && (
          <p className="font-sans font-light text-sm text-safari-bark/70 mt-8 leading-relaxed">
            Also:{" "}
            {more.map((d, i) => (
              <span key={d.slug}>
                {i > 0 && " · "}
                <Link href={`/destinations/${d.slug}`} className="hover:text-safari-russet underline decoration-safari-bark/20 underline-offset-4">
                  {d.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </section>

      {/* Experiences */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
        <div className={eyebrow}>Signature experiences</div>
        <h2 className={`${heading} mb-10`}>Ways to see the wild</h2>
        <ul className="divide-y divide-safari-bark/[0.12] border-y border-safari-bark/[0.12]">
          {experiences.map((e) => (
            <li key={e.slug}>
              <Link href={`/experiences/${e.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                <span>
                  <span className="font-serif-luxury font-light text-xl sm:text-2xl tracking-[0.04em] text-safari-bark group-hover:text-safari-russet transition-colors">
                    {e.short}
                  </span>
                  <span className="block font-sans font-light text-sm text-safari-bark/62 mt-1">{e.tagline}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 text-safari-russet group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* When to go */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
        <div className="flex items-end justify-between gap-10 mb-10 flex-wrap">
          <div>
            <div className={eyebrow}>When to go</div>
            <h2 className={heading}>Tanzania&apos;s safari seasons</h2>
          </div>
          <Link href="/when-to-travel" className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap">
            Month-by-month guide →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {SEASONAL_ERAS.map((era) => (
            <div key={era.id} className="border-t border-safari-bark/15 pt-5">
              <div className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-russet uppercase mb-2">{era.monthsSpan}</div>
              <h3 className="font-serif-luxury font-light text-2xl text-safari-bark">{era.title}</h3>
              <p className={`${body} mt-3 text-[14.5px]`}>{era.subtitle}.</p>
            </div>
          ))}
        </div>
      </section>

      {/* How we plan */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
        <div className="flex items-end justify-between gap-10 mb-10 flex-wrap">
          <div>
            <div className={eyebrow}>How we plan</div>
            <h2 className={heading}>From first message to first light</h2>
          </div>
          <Link href="/how-we-plan" className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap">
            Our planning process →
          </Link>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {PLANNING_STAGES.map((s) => (
            <li key={s.number}>
              <div className="font-mono text-xs text-safari-russet mb-2">{s.number}</div>
              <h3 className="font-serif-luxury font-light text-lg text-safari-bark leading-snug">{s.stepName}</h3>
              <p className="font-sans font-light text-[13.5px] leading-relaxed text-safari-bark/65 mt-2">{s.headline}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-16 py-24 sm:py-32">
        <div className={eyebrow}>Good to know</div>
        <h2 className={`${heading} mb-10`}>Tanzania safari questions</h2>
        <dl className="max-w-3xl divide-y divide-safari-bark/[0.12] border-y border-safari-bark/[0.12]">
          {faqs.map((f) => (
            <div key={f.question} className="py-6">
              <dt className="font-serif-luxury font-light text-lg sm:text-xl text-safari-bark">{f.question}</dt>
              <dd className={`${body} mt-2`}>{f.answer}</dd>
            </div>
          ))}
        </dl>
        <Link href="/travel-information#faqs" className="inline-block mt-6 font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors">
          Visas, health &amp; packing →
        </Link>
      </section>

      {/* Closing CTA */}
      <section className="bg-safari-bark text-safari-cream">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-16 py-20 sm:py-28 grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">Start planning</div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.1em] text-safari-cream uppercase mb-6">
              Tell us where you dream of going
            </h2>
            <p className="font-sans font-light text-[15px] leading-[2] text-safari-cream/72 max-w-md">
              Share your dates and wishes — a safari specialist replies {SITE.replyPromise} with a route, camps and a firm price.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 sm:justify-end">
            <PlanTripButton label="Plan my safari" />
            <WhatsAppButton variant="inline" placement="home-cta" />
          </div>
        </div>
      </section>
    </div>
  );
}
