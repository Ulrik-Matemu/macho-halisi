import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import PlanTripButton from "@/components/public/destinations/PlanTripButton";
import ExperienceReadingBar from "@/components/public/experiences/ExperienceReadingBar";
import ExperienceHero from "@/components/public/experiences/ExperienceHero";
import ExperienceWordReveal from "@/components/public/experiences/ExperienceWordReveal";
import ExperienceHighlightStrip from "@/components/public/experiences/ExperienceHighlightStrip";
import ExperienceDayTimeline from "@/components/public/experiences/ExperienceDayTimeline";
import ExperienceQuote from "@/components/public/experiences/ExperienceQuote";
import ExperienceMaskImage from "@/components/public/experiences/ExperienceMaskImage";
import ExperienceMoreList from "@/components/public/experiences/ExperienceMoreList";
import { experiences, getAllExperienceSlugs, getExperienceBySlug } from "@/data/experiences";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { JsonLd, orgRef } from "@/lib/seo/jsonLd";

interface ExperiencePageParams {
  slug: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

// Place cards stagger down the grid, as in the design.
const PLACE_OFFSETS = ["sm:mt-0", "sm:mt-16", "sm:mt-6"];

// Fully static content — every experience is known and prerendered at
// build time, no on-demand fallback needed.
export const dynamicParams = false;

export function generateStaticParams(): ExperiencePageParams[] {
  return getAllExperienceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ExperiencePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    return { title: "Experience Not Found | Macho Halisi", robots: { index: false } };
  }

  const url = `${getSiteUrl()}/experiences/${experience.slug}`;
  // "Great Migration Expeditions in Tanzania"; lines that already name a
  // place ("…over the Serengeti") don't need the suffix.
  const name = `${experience.line1} ${experience.line2}`;
  const title = `${name}${/tanzania|serengeti|zanzibar|kilimanjaro|ngorongoro/i.test(name) ? "" : " in Tanzania"} | Macho Halisi`;

  return {
    title,
    description: experience.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: experience.seoDescription,
      url,
      images: [{ url: experience.heroImage, alt: experience.heroImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description: experience.seoDescription, images: [experience.heroImage] },
  };
}

/**
 * Design source: Claude Design project 97cc8521-65d3-4bbc-9442-088e8a572c22,
 * "Experience Page.dc.html". Server-rendered page; the scroll-scrubbed
 * sections are client islands in components/public/experiences/.
 */
export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<ExperiencePageParams>;
}) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  const index = experiences.findIndex((e) => e.slug === experience.slug);
  const others = experiences
    .map((e, i) => ({ e, i }))
    .filter(({ i }) => i !== index)
    .map(({ e, i }) => ({
      slug: e.slug,
      num: pad(i + 1),
      line1: e.line1,
      line2: e.line2,
      tagline: e.tagline,
      image: e.heroImage,
    }));

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/experiences/${experience.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${experience.line1} ${experience.line2}`,
    description: experience.seoDescription,
    url,
    image: experience.heroImage,
    touristType: "Safari & wildlife tourism",
    provider: orgRef(),
    itinerary: {
      "@type": "ItemList",
      itemListElement: experience.places.map((place, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristDestination",
          name: place.name,
          url: `${siteUrl}/destinations/${place.destinationSlug}`,
        },
      })),
    },
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <SmoothScroll />

      <div className="bg-safari-cream text-safari-bark">
        <ExperienceReadingBar short={experience.short} planElementId="plan" />

        <ExperienceHero
          image={experience.heroImage}
          imageAlt={experience.heroImageAlt}
          badge={experience.badge}
          line1={experience.line1}
          line2={experience.line2}
          tagline={experience.tagline}
          counter={`${pad(index + 1)} / ${pad(experiences.length)}`}
        />

        <Breadcrumbs
          className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-10"
          items={[
            { name: "Experiences", path: "/experiences" },
            { name: experience.short, path: `/experiences/${experience.slug}` },
          ]}
        />

        <ExperienceWordReveal eyebrow="The experience" text={experience.description}>
          <dl className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-7 mt-16 sm:mt-24 pt-7 border-t border-safari-bark/[0.18]">
            {experience.glance.map((g) => (
              <div key={g.label}>
                <dt className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-bark/70 uppercase mb-2.5">
                  {g.label}
                </dt>
                <dd className="m-0 font-serif-luxury font-light text-[19px] sm:text-[21px] leading-[1.35] tracking-[0.04em] text-safari-bark">
                  {g.value}
                </dd>
              </div>
            ))}
          </dl>
        </ExperienceWordReveal>

        <ExperienceHighlightStrip highlights={experience.highlights} />

        <ExperienceDayTimeline day={experience.day} />

        <ExperienceQuote quote={experience.quote} quoteBy={experience.quoteBy} image={experience.quoteImage} />

        {/* Where it happens */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-36">
          <div className="flex items-end justify-between gap-10 mb-12 flex-wrap">
            <div>
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
                Where it happens
              </div>
              <h2 className="m-0 font-serif-luxury font-light text-[clamp(34px,4vw,52px)] leading-[1.06] tracking-[0.14em] uppercase text-safari-bark">
                Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-russet hover:text-safari-bark transition-colors whitespace-nowrap"
            >
              All destinations →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9">
            {experience.places.map((place, i) => (
              <Link
                key={place.name}
                href={`/destinations/${place.destinationSlug}`}
                className={`group block text-inherit ${PLACE_OFFSETS[i % PLACE_OFFSETS.length]}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-safari-champagne">
                  <ExperienceMaskImage image={place.image} sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
                <div className="font-sans font-light text-[10.5px] tracking-[0.3em] text-safari-russet uppercase mb-2.5">
                  {place.type}
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif-luxury font-light text-[27px] tracking-[0.04em] text-safari-bark group-hover:text-safari-russet transition-colors">
                    {place.name}
                  </span>
                  <span aria-hidden className="font-sans font-light text-base text-safari-russet transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Plan this experience */}
        <section id="plan" className="mt-28 sm:mt-36 bg-safari-bark text-safari-cream scroll-mt-16">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-16 py-20 sm:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end">
            <div>
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">
                Plan this experience
              </div>
              <h2 className="m-0 font-serif-luxury font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[0.02em] text-safari-cream">
                {experience.line1}
                <br />
                <em className="text-safari-sand">{experience.line2}</em>
              </h2>
            </div>
            <div>
              <p className="m-0 mb-9 font-sans font-light text-[15.5px] leading-[2] text-safari-cream/72 max-w-[460px]">
                Take it on its own or fold it into a longer journey. Tell us your dates — we reply within 24
                hours with availability and a firm price.
              </p>
              <div className="flex gap-7 flex-wrap items-center">
                <PlanTripButton label="Enquire now" interest={experience.short} />
                <Link
                  href="/itineraries"
                  className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-cream hover:text-safari-gold uppercase transition-colors"
                >
                  Itineraries with this →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ExperienceMoreList items={others} />
      </div>
    </SiteChrome>
  );
}
