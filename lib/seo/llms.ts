import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { journeyCollections } from "@/data/journeys";
import { MONTHS_DATA, SEASONAL_ERAS } from "@/data/seasonalData";
import { PLANNING_STAGES } from "@/data/planningData";
import { TRAVEL_FAQS } from "@/data/travelInfoData";
import { bestTimeFaqs } from "@/components/public/seasons/MonthByMonthGuide";
import { formatBestMonths, formatStartingPrice, getItineraryBySlug, getPublishedItineraries } from "@/lib/public/api";
import type { PublicItinerarySummary } from "@/lib/public/types";
import { getSiteUrl, SITE, whatsappUrl } from "@/lib/site";
import { clip, listJoin } from "./text";

/**
 * Plain-text site summaries for AI assistants, following the llms.txt
 * convention (https://llmstxt.org): /llms.txt is a short, linked index and
 * /llms-full.txt the whole site's content in one fetch. Both are built
 * from the same data as the pages, so they never disagree with the site.
 */

const flat = (s: string) => s.replace(/\s+/g, " ").trim();

function tripFacts(i: PublicItinerarySummary): string {
  const days = i.nights !== null ? `${i.nights + 1} days` : null;
  const places = listJoin(i.destinations.map((d) => d.destination.name));
  const price = i.priceOnRequest ? "price on request" : formatStartingPrice(i.startingPrice) ? `from US$${formatStartingPrice(i.startingPrice)} per person` : null;
  const best = formatBestMonths(i.availabilityPeriods);
  return [days, places, price, best ? `best ${best}` : null].filter(Boolean).join(" · ");
}

function contactBlock(site: string): string {
  return [
    `- Enquiry form: ${site}/enquire (a safari specialist replies ${SITE.replyPromise})`,
    `- WhatsApp: ${whatsappUrl()}`,
    `- Phone: ${SITE.phone}`,
    `- Email: ${SITE.email}`,
    `- Office: ${SITE.address.locality}, ${SITE.address.region} Region, ${SITE.address.countryName}`,
  ].join("\n");
}

export async function buildLlmsTxt(): Promise<string> {
  const site = getSiteUrl();
  const { data: itineraries } = await getPublishedItineraries({ limit: 100 });

  const out: string[] = [
    `# ${SITE.name} — ${SITE.tagline}`,
    "",
    `> ${SITE.description}`,
    "",
    "Macho Halisi plans private, tailor-made safaris in Tanzania: wildlife safaris (including the Great Migration), Kilimanjaro climbs, Zanzibar beach stays and cultural experiences. Every trip is private and priced individually; guests enquire with their dates and receive a firm, itemised quote.",
    "",
    "## Contact & booking",
    contactBlock(site),
    "",
    "## Key pages",
    `- [Safari itineraries](${site}/itineraries): published routes with day-by-day plans and prices`,
    `- [Best time to visit Tanzania](${site}/when-to-travel): month-by-month migration, weather, crowds and rates`,
    `- [Destinations](${site}/destinations): guides to Tanzania's parks, mountains and islands`,
    `- [Experiences](${site}/experiences): migration, balloon, walking, photographic and cultural safaris`,
    `- [Safari lodges & camps](${site}/accommodations): hand-picked accommodation`,
    `- [Travel information](${site}/travel-information): visas, vaccines, money, luggage and FAQs`,
    `- [How we plan](${site}/how-we-plan): our five-stage planning process`,
    `- [About](${site}/about): company story, founder and guides`,
    "",
  ];

  if (itineraries.length) {
    out.push("## Safari itineraries", ...itineraries.map((i) => `- [${i.title}](${site}/itineraries/${i.slug}): ${tripFacts(i)}`), "");
  }
  out.push("## Destinations", ...destinations.map((d) => `- [${d.name}](${site}/destinations/${d.slug}): ${flat(d.seoDescription)}`), "");
  out.push("## Experiences", ...experiences.map((e) => `- [${e.short}](${site}/experiences/${e.slug}): ${flat(e.seoDescription)}`), "");
  out.push("## Journey collections", ...journeyCollections.map((c) => `- [${c.line1} ${c.line2}](${site}/journeys/${c.slug}): ${flat(c.seoDescription)}`), "");
  out.push("## Quick answers", ...bestTimeFaqs().map((f) => `- ${f.question} ${f.answer}`), "");
  out.push("## Optional", `- [Full site content as plain text](${site}/llms-full.txt)`, "");
  return out.join("\n");
}

export async function buildLlmsFullTxt(): Promise<string> {
  const site = getSiteUrl();
  const { data: summaries } = await getPublishedItineraries({ limit: 100 });
  const details = (await Promise.all(summaries.map((s) => getItineraryBySlug(s.slug)))).filter(
    (d): d is NonNullable<typeof d> => Boolean(d)
  );

  const out: string[] = [
    `# ${SITE.name} — ${SITE.tagline} (full content)`,
    "",
    `> ${SITE.description}`,
    "",
    `Source: ${site}. Short index: ${site}/llms.txt`,
    "",
    "## Contact & booking",
    contactBlock(site),
    "",
  ];

  if (details.length) {
    out.push("## Safari itineraries", "");
    for (const it of details) {
      const summary = summaries.find((s) => s.slug === it.slug);
      out.push(`### ${it.title}`, `URL: ${site}/itineraries/${it.slug}`);
      if (summary) out.push(`Facts: ${tripFacts(summary)}`);
      if (it.overview) out.push("", flat(it.overview));
      if (it.days.length) {
        out.push("", "Day by day:");
        for (const d of it.days) out.push(`- Day ${d.dayNumber}${d.title ? `: ${d.title}` : ""}${d.description ? ` — ${clip(d.description, 400)}` : ""}${d.accommodation ? ` (stay: ${d.accommodation})` : ""}`);
      }
      if (it.inclusions.length) out.push("", `Included: ${it.inclusions.join("; ")}`);
      if (it.exclusions.length) out.push(`Not included: ${it.exclusions.join("; ")}`);
      out.push("");
    }
  }

  out.push("## Best time to visit Tanzania", "");
  for (const f of bestTimeFaqs()) out.push(`Q: ${f.question}`, `A: ${f.answer}`, "");
  for (const e of SEASONAL_ERAS) out.push(`### ${e.title} (${e.monthsSpan})`, flat(e.narrative), `Pros: ${e.pros.join("; ")}`, `Cons: ${e.cons.join("; ")}`, "");
  out.push("### Month by month", "");
  for (const m of MONTHS_DATA) {
    out.push(
      `- ${m.month} — ${m.seasonLabel}. Migration: ${m.migrationLocation}. ${m.tempDayC}°C day / ${m.tempNightC}°C night, ${m.rainfall} rainfall, ${m.crowdLevel} crowds, ${m.valueRating} rates. ${flat(m.description)} Best parks: ${m.recommendedParks.map((p) => p.name).join(", ")}.`
    );
  }
  out.push("");

  out.push("## Destinations", "");
  for (const d of destinations) {
    out.push(`### ${d.name}`, `URL: ${site}/destinations/${d.slug}`, `Region: ${d.region}`, "", flat(d.leadParagraph), ...d.bodyParagraphs.map(flat));
    if (d.quickFacts.length) out.push("", ...d.quickFacts.map((f) => `- ${f.label}: ${f.value}`));
    if (d.highlights.length) out.push("", "Highlights:", ...d.highlights.map((h) => `- ${h.title}: ${flat(h.description)}`));
    if (d.wildlife?.length) out.push("", `Wildlife: ${d.wildlife.join(", ")}`);
    if (d.bestTimeToVisit.length) out.push("", "When to visit:", ...d.bestTimeToVisit.map((b) => `- ${b.month}: ${b.note}`));
    if (d.faqs.length) out.push("", ...d.faqs.flatMap((f) => [`Q: ${f.question}`, `A: ${f.answer}`]));
    out.push("");
  }

  out.push("## Experiences", "");
  for (const e of experiences) out.push(`### ${e.short}`, `URL: ${site}/experiences/${e.slug}`, "", flat(e.description), "");

  out.push("## Journey collections", "");
  for (const c of journeyCollections) {
    out.push(`### ${c.line1} ${c.line2}`, `URL: ${site}/journeys/${c.slug}`, "", flat(c.lead));
    out.push(...c.items.map((j) => `- ${j.name} — ${j.sub} (${j.length} ${c.unit}${j.price != null ? `, from US$${j.price.toLocaleString("en-US")}` : ""})`), "");
  }

  out.push("## How we plan a safari", "");
  for (const s of PLANNING_STAGES) out.push(`${s.number}. ${s.stepName} — ${s.headline} ${flat(s.description)} Deliverable: ${s.deliverable}.`);
  out.push("");

  out.push("## Travel information FAQ", "");
  for (const f of TRAVEL_FAQS) out.push(`Q: ${f.question}`, `A: ${flat(f.answer)}`, "");

  return out.join("\n");
}
