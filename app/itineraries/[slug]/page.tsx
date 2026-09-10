import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  CalendarRange,
  Compass,
  DollarSign,
  ListCheck,
  Map as MapIcon,
  MapPin,
  Moon,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import EnquireButton from "@/components/public/EnquireButton";
import { getItineraryBySlug, getPublishedItineraries, formatStartingPrice } from "@/lib/public/api";
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

  return (
    <SiteChrome>
      {/* Hero image */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] min-h-[420px] bg-[#050505] overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.altText || itinerary.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c160f] to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/50" />

        <div className="absolute inset-x-0 bottom-0 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14">
          {itinerary.destinations.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#c68642]" />
              <span>{itinerary.destinations.map((d) => d.destination.name).join(" · ")}</span>
            </div>
          )}
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.08em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] leading-[1.05] max-w-4xl">
            {itinerary.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-12">
            {itinerary.overview && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-4">
                  Overview
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed whitespace-pre-line">
                  {itinerary.overview}
                </p>
              </section>
            )}

            {itinerary.days.length > 0 && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-6">
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {itinerary.days.map((day) => (
                    <div
                      key={day.id ?? day.dayNumber}
                      className="p-5 sm:p-6 border border-white/10 rounded bg-white/[0.02]"
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-serif-luxury text-lg text-[#ffdbac]">
                          Day {day.dayNumber}
                        </span>
                        {day.title && (
                          <h3 className="font-serif-luxury text-lg text-white font-normal tracking-wide">
                            {day.title}
                          </h3>
                        )}
                      </div>
                      {day.description && (
                        <p className="text-sm text-white/70 font-sans leading-relaxed mb-3">
                          {day.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                        {day.accommodation && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#c68642]" />
                            {day.accommodation}
                          </span>
                        )}
                        {day.activities.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#c68642]" />
                            {day.activities.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(itinerary.inclusions.length > 0 || itinerary.exclusions.length > 0) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {itinerary.inclusions.length > 0 && (
                  <div>
                    <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-4 flex items-center gap-2">
                      <ListCheck className="w-3.5 h-3.5" />
                      Inclusions
                    </h2>
                    <ul className="space-y-2 text-sm text-white/70 font-sans">
                      {itinerary.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#c68642] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {itinerary.exclusions.length > 0 && (
                  <div>
                    <h2 className="text-xs font-sans font-light tracking-[0.25em] text-white/40 uppercase mb-4 flex items-center gap-2">
                      <ListCheck className="w-3.5 h-3.5" />
                      Exclusions
                    </h2>
                    <ul className="space-y-2 text-sm text-white/50 font-sans">
                      {itinerary.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-white/30 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {itinerary.travelInfo && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-4">
                  Travel Information
                </h2>
                <p className="text-sm text-white/70 font-sans leading-relaxed whitespace-pre-line">
                  {itinerary.travelInfo}
                </p>
              </section>
            )}

            {itinerary.availabilityPeriods.length > 0 && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-6 flex items-center gap-2">
                  <CalendarRange className="w-3.5 h-3.5" />
                  Seasonal Availability
                </h2>
                <div className="space-y-3">
                  {itinerary.availabilityPeriods.map((period) => {
                    const formatDate = (iso: string) =>
                      new Date(iso).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    const statusLabel =
                      period.status === "AVAILABLE"
                        ? "Available"
                        : period.status === "LIMITED"
                        ? "Limited"
                        : "Fully Booked";
                    const statusColor =
                      period.status === "AVAILABLE"
                        ? "text-emerald-300"
                        : period.status === "LIMITED"
                        ? "text-amber-300"
                        : "text-white/50";

                    return (
                      <div
                        key={period.id}
                        className="p-4 sm:p-5 border border-white/10 rounded bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div>
                          <span className="text-sm text-white/80 font-sans">
                            {formatDate(period.startDate)} – {formatDate(period.endDate)}
                          </span>
                          {period.note && (
                            <p className="text-xs text-white/50 font-sans mt-1">{period.note}</p>
                          )}
                        </div>
                        <span className={`text-xs font-sans font-medium uppercase tracking-wider shrink-0 ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {itinerary.routeMapUrl && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-4 flex items-center gap-2">
                  <MapIcon className="w-3.5 h-3.5" />
                  Route Map
                </h2>
                <a
                  href={itinerary.routeMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#e0ac69] hover:text-[#ffdbac] underline underline-offset-4 transition-colors"
                >
                  View the full route map
                </a>
              </section>
            )}

            {galleryImages.length > 0 && (
              <section>
                <h2 className="text-xs font-sans font-light tracking-[0.25em] text-[#e0ac69] uppercase mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] rounded overflow-hidden bg-black/60 border border-white/10"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || itinerary.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover object-center hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 p-6 sm:p-8 rounded-xl bg-[#0e0e0e] border border-[#8d5524]/30 shadow-2xl space-y-6">
              <div className="space-y-3 pb-6 border-b border-white/10">
                {itinerary.nights !== null && (
                  <div className="flex items-center gap-2.5 text-sm text-white/80">
                    <Moon className="w-4 h-4 text-[#c68642]" />
                    <span>
                      {itinerary.nights} night{itinerary.nights === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm text-white/80">
                  <Calendar className="w-4 h-4 text-[#c68642]" />
                  <span>
                    {itinerary.availabilityStatus === "AVAILABLE" && "Available now"}
                    {itinerary.availabilityStatus === "LIMITED" && "Limited availability"}
                    {itinerary.availabilityStatus === "FULLY_BOOKED" && "Fully booked"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-sans font-light tracking-widest uppercase text-white/50 block mb-1">
                  {itinerary.priceOnRequest ? "Pricing" : "Starting From"}
                </span>
                {itinerary.priceOnRequest ? (
                  <span className="font-serif-luxury text-2xl text-[#ffdbac]">Price on Request</span>
                ) : price ? (
                  <span className="flex items-baseline gap-1 font-serif-luxury text-3xl text-[#ffdbac]">
                    <DollarSign className="w-5 h-5 text-[#c68642]" />
                    {price}
                    <span className="text-xs text-white/40 font-sans ml-1">per person</span>
                  </span>
                ) : null}
              </div>

              <EnquireButton
                itineraryId={itinerary.id}
                itineraryTitle={itinerary.title}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c68642] hover:bg-[#8d5524] text-[#080808] hover:text-black font-serif-luxury font-medium text-xs tracking-[0.18em] uppercase rounded transition-all shadow-lg shadow-[#c68642]/20 cursor-pointer"
              />

              <Link
                href="/itineraries"
                className="block text-center text-xs text-white/50 hover:text-white transition-colors pt-2"
              >
                ← Back to all journeys
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </SiteChrome>
  );
}
