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
    return { title: "Itinerary Not Found | Macho Halisi" };
  }

  const description =
    itinerary.overview?.slice(0, 160) ||
    `A ${itinerary.nights ?? ""}-night bespoke Tanzanian safari itinerary by Macho Halisi.`;
  const coverImage = itinerary.images[0]?.url;
  const url = `${getSiteUrl()}/itineraries/${itinerary.slug}`;

  return {
    title: `${itinerary.title} | Macho Halisi`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: itinerary.title,
      description,
      url,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
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

  const coverImage = itinerary.images[0];
  const galleryImages = itinerary.images.slice(1);
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
      <ItineraryReadingBar
        itineraryId={itinerary.id}
        title={itinerary.title}
        durationLabel={durationLabelCompact}
        priceLabel={priceLabel}
        heroElementId={HERO_ELEMENT_ID}
      />

      <div className="bg-[#F6F2EA] text-[#1E1913]">
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

        {/* Overview + aside */}
        {hasOverviewSection && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
              <div>
                {leadParagraph && (
                  <p className="font-serif-luxury font-light text-2xl sm:text-3xl leading-[1.62] text-[#1E1913] mb-8 text-balance">
                    {leadParagraph}
                  </p>
                )}
                {bodyParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-sans font-light text-[15.5px] leading-[2] text-[#1E1913]/66 max-w-[620px] mb-5 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {(itinerary.destinations.length > 0 || itinerary.availabilityPeriods.length > 0) && (
                <aside className="border-t border-[#1E1913]/[0.16] pt-7 flex flex-col gap-7">
                  {itinerary.destinations.length > 0 && (
                    <div>
                      <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase mb-2.5">
                        Destinations visited
                      </div>
                      <div className="font-sans font-light text-[15px] leading-[1.85] text-[#1E1913]">
                        {itinerary.destinations.map((d) => d.destination.name).join(" · ")}
                      </div>
                    </div>
                  )}

                  {itinerary.availabilityPeriods.length > 0 && (
                    <div>
                      <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase mb-2.5">
                        Seasonal availability
                      </div>
                      <div className="flex flex-col gap-2">
                        {itinerary.availabilityPeriods.map((period) => (
                          <div
                            key={period.id}
                            className="font-sans font-light text-[15px] leading-[1.6] text-[#1E1913]"
                          >
                            {formatAvailabilityPeriodLabel(period)}
                            {period.note && <span className="text-[#1E1913]/55"> — {period.note}</span>}
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
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-4">
              Where you sleep
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-[#1E1913] uppercase mb-10">
              Accommodation
            </h2>
            <div className="flex flex-col divide-y divide-[#1E1913]/[0.12]">
              {accommodationStays.map((stay, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-6 py-5">
                  <span className="font-serif-luxury font-light text-xl sm:text-2xl tracking-[0.04em] text-[#1E1913]">
                    {stay.name}
                  </span>
                  <span className="font-sans font-light text-xs tracking-[0.18em] text-[#1E1913]/66 uppercase whitespace-nowrap">
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
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-6">
                    What&apos;s included
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-[#1E1913]/72">
                    {itinerary.inclusions.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </div>
              )}
              {itinerary.exclusions.length > 0 && (
                <div>
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#1E1913]/70 uppercase mb-6">
                    Not included
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-[#1E1913]/62">
                    {itinerary.exclusions.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </div>
              )}
              {itinerary.travelInfo && (
                <div>
                  <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#1E1913]/70 uppercase mb-6">
                    Travel information
                  </div>
                  <div className="font-sans font-light text-[15px] leading-[2.25] text-[#1E1913]/72 whitespace-pre-line">
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
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-4">
                Gallery
              </div>
              <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.14em] text-[#1E1913] uppercase">
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
        <section className="mt-24 sm:mt-32 bg-[#181410] text-[#F6F2EA]">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 items-start">
              <div>
                <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#C9A46A] uppercase mb-5">
                  Availability & enquiry
                </div>
                <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl leading-[1.08] tracking-[0.1em] text-[#FBF7F0] uppercase mb-6">
                  Plan this trip
                </h2>
                <p className="font-sans font-light text-[15px] leading-[2] text-[#FBF7F0]/72 max-w-md mb-8">
                  Tell us roughly when you would like to travel and we will come back within 24
                  hours with dates, camps and a firm price — no deposit until the route is right.
                </p>

                {activePeriod && (
                  <div>
                    <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/70 uppercase mb-2">
                      Next availability
                    </div>
                    <div className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#FBF7F0]">
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
                  className="inline-flex items-center justify-center font-sans font-light text-[11px] tracking-[0.3em] uppercase text-[#181410] bg-[#C9A46A] hover:bg-[#F6F2EA] transition-colors px-10 py-4 rounded whitespace-nowrap cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* You may also like */}
        {related.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-6 sm:px-16 py-24 sm:py-32">
            <div className="flex items-end justify-between gap-10 mb-11 flex-wrap">
              <h2 className="font-serif-luxury font-light text-3xl sm:text-4xl leading-[1.1] tracking-[0.14em] text-[#1E1913] uppercase">
                You may also like
              </h2>
              <Link
                href="/itineraries"
                className="font-sans font-light text-[11px] tracking-[0.3em] text-[#1E1913] hover:text-[#8A6A33] uppercase transition-colors whitespace-nowrap"
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
