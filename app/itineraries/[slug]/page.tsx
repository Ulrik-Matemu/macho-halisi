import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import EnquireButton from "@/components/public/EnquireButton";
import ItineraryReadingBar from "@/components/public/itinerary/ItineraryReadingBar";
import ItineraryHero from "@/components/public/itinerary/ItineraryHero";
import ItineraryJourneyOverviewMap from "@/components/public/itinerary/ItineraryJourneyOverviewMap";
import ItineraryRouteSection from "@/components/public/itinerary/ItineraryRouteSection";
import RelatedItineraryCard from "@/components/public/itinerary/RelatedItineraryCard";
import {
  getItineraryBySlug,
  getPublishedItineraries,
  formatStartingPrice,
  formatBestMonths,
  formatAvailabilityPeriodLabel,
  getCurrentOrUpcomingPeriod,
  groupAccommodationNights,
  getItineraryMapPins,
} from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { itineraryTrip, JsonLd } from "@/lib/seo/jsonLd";
import { clip, listJoin } from "@/lib/seo/text";
import { guideForDestination } from "@/lib/seo/links";

interface ItineraryPageParams {
  slug: string;
}

// Prerendered at build time for every itinerary PUBLISHED as of the build;
// new slugs published afterward still resolve on-demand (dynamicParams
// defaults to true) and get folded into the static cache on next revalidate.
export async function generateStaticParams(): Promise<ItineraryPageParams[]> {
  const { data } = await getPublishedItineraries({ limit: 100 });
  return data.map((itinerary) => ({ slug: itinerary.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ItineraryPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);

  if (!itinerary) {
    return { title: "Itinerary Not Found | Macho Halisi", robots: { index: false } };
  }

  // Lead with the facts searchers compare on (length, places, price, season),
  // then as much of the overview as fits — trimmed on a word boundary.
  const days = itinerary.nights !== null ? itinerary.nights + 1 : null;
  const places = listJoin(itinerary.destinations.map((d) => d.destination.name).slice(0, 4));
  const price = itinerary.priceOnRequest ? null : formatStartingPrice(itinerary.startingPrice);
  const bestMonths = formatBestMonths(itinerary.availabilityPeriods);
  const facts = [
    days ? `${days}-day private Tanzania safari` : "Private Tanzania safari",
    places ? `through ${places}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const extras = [price ? `from US$${price} per person` : null, bestMonths ? `best ${bestMonths}` : null].filter(Boolean).join(", ");
  const description = clip(`${facts}${extras ? `, ${extras}` : ""}. ${itinerary.overview ?? "Planned and guided by native Tanzanian specialists."}`);
  const coverImage = (itinerary.heroImage ?? itinerary.images[0])?.url;
  const url = `${getSiteUrl()}/itineraries/${itinerary.slug}`;
  const title = days ? `${itinerary.title} — ${days}-Day Tanzania Safari | Macho Halisi` : `${itinerary.title} — Tanzania Safari | Macho Halisi`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: coverImage ? [coverImage] : undefined },
  };
}

const HERO_ELEMENT_ID = "itinerary-hero";

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<ItineraryPageParams>;
}) {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);

  if (!itinerary) {
    notFound();
  }

  const coverImage = itinerary.heroImage ?? itinerary.images[0];
  const galleryImages = itinerary.images.filter((img) => img.id !== coverImage?.id);
  const price = formatStartingPrice(itinerary.startingPrice);
  const bestMonths = formatBestMonths(itinerary.availabilityPeriods);
  const accommodationStays = groupAccommodationNights(itinerary.days);
  const activePeriod = getCurrentOrUpcomingPeriod(itinerary.availabilityPeriods);
  const mapPins = itinerary.showRouteMap ? getItineraryMapPins(itinerary) : [];

  const durationLabelCompact =
    itinerary.nights !== null ? `${itinerary.nights + 1}D / ${itinerary.nights}N` : null;
  const priceLabel = itinerary.priceOnRequest
    ? "Price on request"
    : price
    ? `From $${price} pp`
    : "";

  // Overview is a single text blob — split on blank lines so the first
  // paragraph can render as the large serif lead and the rest as body copy,
  // matching the design. An itinerary with a one-paragraph overview (the
  // common case) just gets a lead paragraph and no body copy.
  const overviewParagraphs = itinerary.overview
    ? itinerary.overview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];
  const [leadParagraph, ...bodyParagraphs] = overviewParagraphs;

  const { data: relatedRaw } = await getPublishedItineraries({ limit: 4 });
  const related = relatedRaw.filter((i) => i.slug !== itinerary.slug).slice(0, 3);

  const hasOverviewSection =
    Boolean(leadParagraph) || itinerary.destinations.length > 0 || itinerary.availabilityPeriods.length > 0;
  const hasIncludedSection =
    itinerary.inclusions.length > 0 || itinerary.exclusions.length > 0 || Boolean(itinerary.travelInfo);

  return (
    <SiteChrome>
      <JsonLd data={itineraryTrip(itinerary)} />
      <ItineraryReadingBar
        itineraryId={itinerary.id}
        title={itinerary.title}
        durationLabel={durationLabelCompact}
        priceLabel={priceLabel}
        heroElementId={HERO_ELEMENT_ID}
      />

      <div className="bg-safari-cream text-safari-bark">
        {/* Hero */}
        <ItineraryHero
          elementId={HERO_ELEMENT_ID}
          coverImage={coverImage ? { url: coverImage.url, altText: coverImage.altText ?? null } : null}
          title={itinerary.title}
          destinationNames={itinerary.destinations.map((d) => d.destination.name)}
          nights={itinerary.nights}
          price={price}
          priceOnRequest={itinerary.priceOnRequest}
          bestMonths={bestMonths}
        />

        <Breadcrumbs
          className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-10"
          items={[
            { name: "Itineraries", path: "/itineraries" },
            { name: itinerary.title, path: `/itineraries/${itinerary.slug}` },
          ]}
        />

        {/* Overview + aside */}
        {hasOverviewSection && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
              <div>
                {leadParagraph && (
                  <p className="font-serif-luxury font-light text-2xl sm:text-3xl leading-[1.62] text-safari-bark mb-8 text-balance">
                    {leadParagraph}
                  </p>
                )}
                {bodyParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-sans font-light text-[15.5px] leading-[2] text-safari-bark/66 max-w-[620px] mb-5 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {(itinerary.destinations.length > 0 || itinerary.availabilityPeriods.length > 0) && (
                <aside className="border-t border-safari-bark/[0.16] pt-7 flex flex-col gap-7">
                  {itinerary.destinations.length > 0 && (
                    <div>
                      <div className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-bark/70 uppercase mb-2.5">
                        Destinations visited
                      </div>
                      <div className="font-sans font-light text-[15px] leading-[1.85] text-safari-bark">
                        {itinerary.destinations.map((d, i) => {
                          const guide = guideForDestination(d.destination);
                          return (
                            <span key={d.destination.id}>
                              {i > 0 && " · "}
                              {guide ? (
                                <Link href={`/destinations/${guide.slug}`} className="underline decoration-safari-bark/25 underline-offset-4 hover:text-safari-russet hover:decoration-safari-russet">
                                  {d.destination.name}
                                </Link>
                              ) : (
                                d.destination.name
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {itinerary.availabilityPeriods.length > 0 && (
                    <div>
                      <div className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-bark/70 uppercase mb-2.5">
                        Seasonal availability
                      </div>
                      <div className="flex flex-col gap-2">
                        {itinerary.availabilityPeriods.map((period) => (
                          <div
                            key={period.id}
                            className="font-sans font-light text-[15px] leading-[1.6] text-safari-bark"
                          >
                            {formatAvailabilityPeriodLabel(period)}
                            {period.note && <span className="text-safari-bark/55"> — {period.note}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              )}
            </div>
          </section>
        )}

        {/* The journey — full-route map overview, before the day-by-day */}
        <ItineraryJourneyOverviewMap pins={mapPins} />

        {/* Day by day */}
        <ItineraryRouteSection
          days={itinerary.days}
          images={itinerary.images}
          routeMapUrl={itinerary.routeMapUrl}
          mapPins={mapPins}
        />

        {/* Accommodation — derived from day.accommodation, no dedicated
            model exists, so no photos (see ARCHITECTURE_REVIEW / plan). */}
        {accommodationStays.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
              Where you sleep
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase mb-10">
              Accommodation
            </h2>
            <div className="flex flex-col divide-y divide-safari-bark/[0.12]">
              {accommodationStays.map((stay, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-6 py-5">
                  <span className="font-serif-luxury font-light text-xl sm:text-2xl tracking-[0.04em] text-safari-bark">
                    {stay.name}
                  </span>
                  <span className="font-sans font-light text-xs tracking-[0.18em] text-safari-bark/66 uppercase whitespace-nowrap">
                    {stay.nights} night{stay.nights === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Included / Not included / Travel information */}
        {hasIncludedSection && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-14">
              {itinerary.inclusions.length > 0 && (
                <div>
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-6">
                    What&apos;s included
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-safari-bark/72">
                    {itinerary.inclusions.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </div>
              )}
              {itinerary.exclusions.length > 0 && (
                <div>
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-bark/70 uppercase mb-6">
                    Not included
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-safari-bark/62">
                    {itinerary.exclusions.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </div>
              )}
              {itinerary.travelInfo && (
                <div>
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-bark/70 uppercase mb-6">
                    Travel information
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-safari-bark/72 whitespace-pre-line">
                    {itinerary.travelInfo}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <section className="pt-24 sm:pt-32">
            <div className="max-w-[1240px] mx-auto px-6 sm:px-16 mb-10">
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
                Gallery
              </div>
              <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-safari-bark uppercase">
                {itinerary.nights !== null ? `${itinerary.nights + 1} days, in pictures` : "In pictures"}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 sm:px-10">
              {galleryImages.map((img, idx) => {
                const isWide = idx % 6 === 0 || idx % 6 === 4;
                return (
                  <div
                    key={img.id}
                    className={`relative rounded overflow-hidden ${
                      isWide ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || itinerary.title}
                      fill
                      sizes={isWide ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                      className="object-cover object-center"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Enquire */}
        <section className="mt-24 sm:mt-32 bg-safari-bark text-safari-cream">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 items-start">
              <div>
                <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-5">
                  Availability & enquiry
                </div>
                <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.1em] text-safari-cream uppercase mb-6">
                  Plan this trip
                </h2>
                <p className="font-sans font-light text-[15px] leading-[2] text-safari-cream/72 max-w-md mb-8">
                  Tell us roughly when you would like to travel and we will come back within 24
                  hours with dates, camps and a firm price — no deposit until the route is right.
                </p>

                {activePeriod && (
                  <div>
                    <div className="font-sans font-light text-[10px] tracking-[0.3em] text-safari-cream/70 uppercase mb-2">
                      Next availability
                    </div>
                    <div className="font-serif-luxury font-light text-xl tracking-[0.06em] text-safari-cream">
                      {formatAvailabilityPeriodLabel(activePeriod)}
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:pt-16">
                <EnquireButton
                  itineraryId={itinerary.id}
                  itineraryTitle={itinerary.title}
                  label="Enquire Now"
                  showIcon={false}
                  className="inline-flex items-center justify-center font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-bark bg-safari-gold hover:bg-safari-cream transition-colors px-10 py-4 rounded whitespace-nowrap cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* You may also like */}
        {related.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 py-24 sm:py-32">
            <div className="flex items-end justify-between gap-10 mb-11 flex-wrap">
              <h2 className="font-serif-luxury font-light text-3xl sm:text-4xl leading-[1.1] tracking-[0.14em] text-safari-bark uppercase">
                You may also like
              </h2>
              <Link
                href="/itineraries"
                className="font-sans font-light text-[11px] tracking-[0.3em] text-safari-bark hover:text-safari-russet uppercase transition-colors whitespace-nowrap"
              >
                All itineraries →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
              {related.map((r) => (
                <RelatedItineraryCard key={r.id} itinerary={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteChrome>
  );
}
