import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import ScrollReveal from "@/components/public/ScrollReveal";
import ScrollProgressBar from "@/components/public/ScrollProgressBar";
import DestinationHero from "@/components/public/destinations/DestinationHero";
import DestinationMap from "@/components/public/destinations/DestinationMap";
import DestinationBestTime from "@/components/public/destinations/DestinationBestTime";
import DestinationFaq from "@/components/public/destinations/DestinationFaq";
import DestinationCard from "@/components/public/destinations/DestinationCard";
import DestinationChapterScroll from "@/components/public/destinations/DestinationChapterScroll";
import DestinationDiptych from "@/components/public/destinations/DestinationDiptych";
import PlanTripButton from "@/components/public/destinations/PlanTripButton";
import { destinations, getDestinationBySlug, getAllDestinationSlugs } from "@/data/destinations";
import { getDestinationPageData, parseWildlifeEntry } from "@/data/destination-derived";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import RelatedItineraryCard from "@/components/public/itinerary/RelatedItineraryCard";
import { getPublishedItineraries } from "@/lib/public/api";
import { faqPage, JsonLd, orgRef } from "@/lib/seo/jsonLd";
import { guideForDestination } from "@/lib/seo/links";

const pad = (n: number) => String(n).padStart(2, "0");

interface DestinationPageParams {
  slug: string;
}

// Fully static content — every destination is known and prerendered at
// build time, no on-demand fallback needed.
export const dynamicParams = false;

export function generateStaticParams(): DestinationPageParams[] {
  return getAllDestinationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DestinationPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found | Macho Halisi", robots: { index: false } };
  }

  const url = `${getSiteUrl()}/destinations/${destination.slug}`;
  // "Serengeti National Park Safari Guide & Best Time to Visit" — what
  // people search alongside a park name.
  const title = `${destination.name} Safari Guide & Best Time to Visit | Macho Halisi`;

  return {
    title,
    description: destination.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: destination.seoDescription,
      url,
      images: [{ url: destination.heroImage, alt: destination.heroImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description: destination.seoDescription, images: [destination.heroImage] },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<DestinationPageParams>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const related = destination.relatedSlugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const { regionChapters, travelChapters, pullQuote, diptych } = getDestinationPageData(destination);

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/destinations/${destination.slug}`;

  // Published safaris that stop here — real routes to send this page's
  // readers (and link equity) to.
  const { data: allItineraries } = await getPublishedItineraries({ limit: 100 });
  const visiting = allItineraries
    .filter((it) => it.destinations.some((d) => guideForDestination(d.destination)?.slug === destination.slug))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristAttraction",
        "@id": `${url}#place`,
        name: destination.name,
        description: destination.seoDescription,
        url,
        image: destination.heroImage.startsWith("http") ? destination.heroImage : `${siteUrl}${destination.heroImage}`,
        provider: orgRef(),
        touristType: "Safari & wildlife tourism",
        geo: {
          "@type": "GeoCoordinates",
          latitude: destination.location.lat,
          longitude: destination.location.lng,
        },
        address: {
          "@type": "PostalAddress",
          addressRegion: destination.region,
          addressCountry: "TZ",
        },
      },
      ...(destination.faqs.length ? [faqPage(destination.faqs)] : []),
    ],
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />

      <div className="bg-safari-cream text-safari-bark">
        <ScrollProgressBar />
        <DestinationHero
          image={destination.heroImage}
          imageAlt={destination.heroImageAlt}
          categoryLabel={destination.categoryLabel}
          region={destination.region}
          name={destination.name}
          tagline={destination.tagline}
          counter={`${pad(destinations.indexOf(destination) + 1)} / ${pad(destinations.length)}`}
        />

        <Breadcrumbs
          className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-10"
          items={[
            { name: "Destinations", path: "/destinations" },
            { name: destination.name, path: `/destinations/${destination.slug}` },
          ]}
        />

        {/* Overview + quick facts */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-start">
            <ScrollReveal>
              <p className="font-serif-luxury font-light text-2xl sm:text-3xl leading-[1.62] text-safari-bark mb-8 text-balance">
                {destination.leadParagraph}
              </p>
              {destination.bodyParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="font-sans font-light text-[15.5px] leading-[2] text-safari-bark/66 max-w-[620px] mb-5 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </ScrollReveal>

            <ScrollReveal delayMs={120} size="lift">
              <aside className="border-t border-safari-bark/[0.16] pt-7 flex flex-col gap-7">
                <div className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-bark/70 uppercase mb-1">
                  Quick facts
                </div>
                {destination.quickFacts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4">
                    <span className="font-sans font-light text-[13px] text-safari-bark/60 uppercase tracking-[0.05em]">
                      {fact.label}
                    </span>
                    <span className="font-serif-luxury font-light text-base text-safari-bark text-right">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </aside>
            </ScrollReveal>
          </div>
        </section>

        {/* Map */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <ScrollReveal>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
              Location
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase mb-8">
              Where it is
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={100} size="lift">
            <DestinationMap
              lat={destination.location.lat}
              lng={destination.location.lng}
              zoom={destination.location.zoom}
              label={destination.name}
              className="relative w-full h-[420px] rounded overflow-hidden border border-safari-bark/10"
            />
          </ScrollReveal>
        </section>

        {/* Highlights */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <ScrollReveal>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
              Why visit
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase mb-12">
              Highlights
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-12">
            {destination.highlights.map((highlight, idx) => (
              <ScrollReveal key={highlight.title} delayMs={idx * 60} size="lift">
                <div className="flex gap-5">
                  <span className="font-serif-luxury font-light text-2xl text-safari-gold shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-luxury font-light text-xl tracking-[0.02em] text-safari-bark mb-2">
                      {highlight.title}
                    </h3>
                    <p className="font-sans font-light text-[15px] leading-[1.8] text-safari-bark/66">
                      {highlight.description}
                    </p>
                  </div>
                  {highlight.image && (
                    <div className="relative hidden sm:block w-[140px] shrink-0 aspect-[5/4] overflow-hidden">
                      <Image
                        src={highlight.image.url}
                        alt={highlight.image.alt}
                        fill
                        sizes="140px"
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* The park in three parts — sticky-image scrollytelling */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <DestinationChapterScroll eyebrow="In three parts" chapters={regionChapters} imageSide="left" />
        </section>

        {/* Breather — a single full-bleed image moment between the two
            text-only sections below, reusing the first gallery photo so no
            new imagery is needed. */}
        
      

        {/* Wildlife & activities */}
       

        {/* Best time to visit */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <ScrollReveal>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
              Seasons
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase mb-10">
              Best time to visit
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={100} size="lift">
            <DestinationBestTime months={destination.bestTimeToVisit} />
          </ScrollReveal>
        </section>

        {/* Gallery */}
        {/* {destination.gallery.length > 0 && (
          <section className="pt-28 sm:pt-40">
            <ScrollReveal className="max-w-[1240px] mx-auto px-6 sm:px-16 mb-10">
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
                Gallery
              </div>
              <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase">
                {destination.name}, in pictures
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 sm:px-10">
              {destination.gallery.map((img, idx) => {
                const isWide = idx % 6 === 0 || idx % 6 === 4;
                return (
                  <ScrollReveal
                    key={img.url}
                    delayMs={idx * 70}
                    size="lift"
                    className={isWide ? "col-span-2" : ""}
                  >
                    <div
                      className={`group relative rounded overflow-hidden ${
                        isWide ? "aspect-[16/10]" : "aspect-[4/5]"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes={isWide ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                        className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )} */}

        {/* Diptych */}
        {/* <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <DestinationDiptych left={diptych[0]} right={diptych[1]} caption={diptych[2]} />
        </section> */}

        {/* FAQ */}
        <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
          <ScrollReveal>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
              Good to know
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase mb-10">
              Frequently asked questions
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={100} size="lift">
            <DestinationFaq faqs={destination.faqs} />
          </ScrollReveal>
        </section>

        {visiting.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
            <div className="flex items-end justify-between gap-10 mb-11 flex-wrap">
              <h2 className="font-serif-luxury font-light text-3xl sm:text-4xl leading-[1.1] tracking-[0.14em] text-safari-bark uppercase">
                Safaris visiting {destination.name}
              </h2>
              <Link
                href="/itineraries"
                className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap"
              >
                All itineraries →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
              {visiting.map((it) => (
                <RelatedItineraryCard key={it.id} itinerary={it} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-28 sm:mt-40 bg-safari-bark text-safari-cream">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 items-start">
              <div>
                <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">
                  Plan your visit
                </div>
                <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.1em] text-safari-cream uppercase mb-6">
                  Visit {destination.name}
                </h2>
                <p className="font-sans font-light text-[15px] leading-[2] text-safari-cream/72 max-w-md mb-8">
                  Tell us roughly when you would like to travel and our safari specialists will
                  come back within 24 hours with a bespoke itinerary built around {destination.name}.
                </p>
                <Link
                  href="/itineraries"
                  className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-gold hover:text-safari-cream uppercase transition-colors"
                >
                  See safaris featuring {destination.name} →
                </Link>
              </div>

              <div className="sm:pt-16">
                <PlanTripButton interest={`${destination.name} safari`} />
              </div>
            </div>
          </div>
        </section>

        {/* Related destinations */}
        {related.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 py-24 sm:py-32">
            <ScrollReveal className="flex items-end justify-between gap-10 mb-11 flex-wrap">
              <h2 className="font-serif-luxury font-light text-3xl sm:text-4xl leading-[1.1] tracking-[0.14em] text-safari-bark uppercase">
                You may also like
              </h2>
              <Link
                href="/destinations"
                className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap"
              >
                All destinations →
              </Link>
            </ScrollReveal>
            <ScrollReveal delayMs={100} size="lift">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
                {related.map((r) => (
                  <DestinationCard key={r.slug} destination={r} />
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}
      </div>
    </SiteChrome>
  );
}
