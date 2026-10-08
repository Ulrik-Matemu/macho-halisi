import Link from "next/link";
import { MONTHS_DATA, SEASONAL_ERAS, type MonthData } from "@/data/seasonalData";
import { faqPage, JsonLd } from "@/lib/seo/jsonLd";
import { listJoin } from "@/lib/seo/text";

const RAIN: Record<MonthData["rainfall"], string> = {
  minimal: "Dry",
  moderate: "Some rain",
  "short-rains": "Short rains",
  high: "Long rains",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const months = (pick: (m: MonthData) => boolean) => MONTHS_DATA.filter(pick).map((m) => m.month);

/**
 * Quick answers to the questions people actually type ("best time to
 * visit Tanzania", "when are the river crossings"), computed from the
 * same month data as the calendar so they can never contradict it.
 */
export function bestTimeFaqs(): { question: string; answer: string }[] {
  const crossings = months((m) => m.migrationCrossings === "peak");
  const calving = months((m) => m.calvingActivity === "peak");
  const value = months((m) => m.valueRating === "exceptional");
  const quiet = months((m) => m.crowdLevel === "serene");
  const dry = SEASONAL_ERAS[0];

  return [
    {
      question: "What is the best time to visit Tanzania for a safari?",
      answer: `Tanzania is a year-round safari destination. ${SEASONAL_ERAS.map((e) => `${e.title} (${e.monthsSpan}): ${e.subtitle}.`).join(" ")} For first-time visitors, ${dry.monthsSpan.toLowerCase()} offers the easiest wildlife viewing.`,
    },
    ...(crossings.length
      ? [
          {
            question: "When can you see the Great Migration river crossings?",
            answer: `River crossings peak in ${listJoin(crossings)}, when the herds are in the ${
              MONTHS_DATA.find((m) => m.migrationCrossings === "peak")?.migrationLocation ?? "northern Serengeti"
            }.`,
          },
        ]
      : []),
    ...(calving.length
      ? [
          {
            question: "When is the wildebeest calving season in Tanzania?",
            answer: `Calving peaks in ${listJoin(calving)}, when the herds are on the ${
              MONTHS_DATA.find((m) => m.calvingActivity === "peak")?.migrationLocation ?? "southern Serengeti plains"
            } — which also brings intense predator activity.`,
          },
        ]
      : []),
    ...(value.length
      ? [
          {
            question: "When is the best-value time for a Tanzania safari?",
            answer: `${listJoin(value)} offer the best lodge rates, with green landscapes and far fewer vehicles in the parks.`,
          },
        ]
      : []),
    ...(quiet.length
      ? [
          {
            question: "When are Tanzania's parks least crowded?",
            answer: `The quietest months are ${listJoin(quiet)}.`,
          },
        ]
      : []),
  ];
}

/**
 * Server-rendered month-by-month guide. The interactive calendar above it
 * shows one month at a time; this gives every month its own heading and
 * anchor (#july) so search engines and AI assistants can read and link to
 * all twelve.
 */
export default function MonthByMonthGuide() {
  const faqs = bestTimeFaqs();

  return (
    <section id="month-by-month" className="py-20 sm:py-28 border-b border-safari-bark/10 scroll-mt-28">
      <JsonLd data={faqPage(faqs)} />

      <div className="mb-10 sm:mb-14 max-w-3xl">
        <div className="text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">At a glance</div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.04em] leading-tight">
          Tanzania Safari Weather &amp; Wildlife, Month by Month
        </h2>
      </div>

      <dl className="max-w-3xl space-y-6 mb-16 sm:mb-20">
        {faqs.map((f) => (
          <div key={f.question}>
            <dt className="font-serif-luxury text-lg sm:text-xl text-safari-bark">{f.question}</dt>
            <dd className="font-sans font-light text-[15px] leading-relaxed text-safari-bark/75 mt-1.5">{f.answer}</dd>
          </div>
        ))}
      </dl>

      <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
        {MONTHS_DATA.map((m) => (
          <li key={m.month} id={m.month.toLowerCase()} className="scroll-mt-28 border-t border-safari-bark/15 pt-5">
            <h3 className="font-serif-luxury text-2xl font-light text-safari-bark">
              {m.month} <span className="text-safari-russet text-base italic">— {m.seasonLabel}</span>
            </h3>
            <p className="font-sans font-light text-[14.5px] leading-relaxed text-safari-bark/75 mt-2">{m.description}</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 text-[13px] font-sans">
              <dt className="text-safari-bark/55">Migration</dt>
              <dd className="text-safari-bark">{m.migrationLocation}</dd>
              <dt className="text-safari-bark/55">Weather</dt>
              <dd className="text-safari-bark">
                {RAIN[m.rainfall]}, {m.tempDayC}°C day / {m.tempNightC}°C night
              </dd>
              <dt className="text-safari-bark/55">Crowds</dt>
              <dd className="text-safari-bark">{cap(m.crowdLevel)}</dd>
              <dt className="text-safari-bark/55">Rates</dt>
              <dd className="text-safari-bark">{cap(m.valueRating)}</dd>
            </dl>
            {m.recommendedParks.length > 0 && (
              <p className="text-[13px] font-sans text-safari-bark/70 mt-3">
                Best parks:{" "}
                {m.recommendedParks.map((p, i) => (
                  <span key={p.name}>
                    {i > 0 && ", "}
                    <Link href={`/destinations/${p.slug}`} className="underline decoration-safari-bark/25 underline-offset-4 hover:text-safari-russet">
                      {p.name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
