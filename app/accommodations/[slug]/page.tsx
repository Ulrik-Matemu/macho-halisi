import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Check, DollarSign, ArrowLeft } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import AccommodationMap from "@/components/public/accommodations/AccommodationMap";
import AccommodationEnquireButton from "@/components/public/accommodations/AccommodationEnquireButton";
import { getAccommodationBySlug, getPublishedAccommodations, formatPricePerNight } from "@/lib/public/api";
import { ACCOMMODATION_TYPE_LABELS, SERVICE_TIER_LABELS } from "@/lib/accommodations/types";
import { getSiteUrl } from "@/lib/site";

interface AccommodationPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<AccommodationPageParams[]> {
  // Capped at the public API's max page size (50). Slugs published beyond
  // that still resolve on-demand (dynamicParams defaults to true).
  const { data } = await getPublishedAccommodations({ limit: 50 });
  return data.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<AccommodationPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);

  if (!accommodation) {
    return { title: "Accommodation Not Found | Macho Halisi" };
  }

  const description =
    accommodation.description?.slice(0, 160) ||
    `${SERVICE_TIER_LABELS[accommodation.serviceTier]} ${ACCOMMODATION_TYPE_LABELS[
      accommodation.type
    ].toLowerCase()} in ${accommodation.locationText}, curated by Macho Halisi.`;
  const coverImage = (accommodation.heroImage ?? accommodation.images[0])?.url;
  const url = `${getSiteUrl()}/accommodations/${accommodation.slug}`;

  return {
    title: `${accommodation.name} | Macho Halisi`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: accommodation.name,
      description,
      url,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
  };
}

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<AccommodationPageParams>;
}) {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);

  if (!accommodation) {
    notFound();
  }

  const cover = accommodation.heroImage ?? accommodation.images[0];
  const gallery = accommodation.images.filter((img) => img.id !== cover?.id);
  const price = formatPricePerNight(accommodation.pricePerNight);
  const hasCoords = accommodation.latitude !== null && accommodation.longitude !== null;

  return (
    <SiteChrome>
      <article className="pb-16 sm:pb-24">
        {/* Hero */}
        <div className="relative h-[60vh] min-h-[420px] w-full bg-black">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.altText || accommodation.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c160f] to-[#0a0a0a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14">
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-sans tracking-[0.25em] uppercase mb-3">
                <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/15 text-[#f1c27d]">
                  {ACCOMMODATION_TYPE_LABELS[accommodation.type]}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/15 text-[#e0ac69]">
                  {SERVICE_TIER_LABELS[accommodation.serviceTier]}
                </span>
                {accommodation.starRating !== null && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/15 text-[#f1c27d]">
                    {accommodation.starRating}
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                )}
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-6xl font-light text-white tracking-wide leading-tight max-w-4xl">
                {accommodation.name}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-white/70 mt-3 font-sans">
                <MapPin className="w-4 h-4 text-[#c68642] shrink-0" />
                {accommodation.locationText}
                {accommodation.destination && (
                  <>
                    <span className="text-white/30">·</span>
                    <Link href={`/destinations/${accommodation.destination.slug}`} className="text-[#e0ac69] hover:underline">
                      {accommodation.destination.name}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14">
          <Link
            href="/accommodations"
            className="inline-flex items-center gap-2 text-xs font-sans tracking-wider uppercase text-white/50 hover:text-[#e0ac69] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All accommodations
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {accommodation.description && (
                <section>
                  <h2 className="font-serif-luxury text-2xl text-white font-light tracking-wide mb-4">Overview</h2>
                  <div className="text-sm sm:text-base text-white/70 font-sans leading-relaxed whitespace-pre-line">
                    {accommodation.description}
                  </div>
                </section>
              )}

              {accommodation.amenities.length > 0 && (
                <section>
                  <h2 className="font-serif-luxury text-2xl text-white font-light tracking-wide mb-4">Amenities</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {accommodation.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2 text-sm text-white/70 font-sans">
                        <Check className="w-4 h-4 text-[#c68642] shrink-0" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {gallery.length > 0 && (
                <section>
                  <h2 className="font-serif-luxury text-2xl text-white font-light tracking-wide mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map((img) => (
                      <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40">
                        <Image
                          src={img.url}
                          alt={img.altText || accommodation.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover object-center"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hasCoords && (
                <section>
                  <h2 className="font-serif-luxury text-2xl text-white font-light tracking-wide mb-4">Location</h2>
                  <AccommodationMap
                    latitude={accommodation.latitude as number}
                    longitude={accommodation.longitude as number}
                    label={accommodation.name}
                  />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-5 p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-[#e0ac69] uppercase block mb-1">From</span>
                  {accommodation.priceOnRequest ? (
                    <span className="font-serif-luxury text-2xl text-[#f1c27d]">Price on request</span>
                  ) : price ? (
                    <span className="flex items-baseline gap-1 font-serif-luxury text-3xl text-white">
                      <DollarSign className="w-5 h-5 text-[#c68642]" />
                      {price}
                      <span className="text-sm text-white/50 font-sans">/ night</span>
                    </span>
                  ) : (
                    <span className="font-serif-luxury text-2xl text-white">Enquire for rates</span>
                  )}
                </div>

                <dl className="space-y-2.5 text-sm border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <dt className="text-white/50 font-sans">Type</dt>
                    <dd className="text-white font-sans">{ACCOMMODATION_TYPE_LABELS[accommodation.type]}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-white/50 font-sans">Tier</dt>
                    <dd className="text-white font-sans">{SERVICE_TIER_LABELS[accommodation.serviceTier]}</dd>
                  </div>
                  {accommodation.starRating !== null && (
                    <div className="flex items-center justify-between">
                      <dt className="text-white/50 font-sans">Rating</dt>
                      <dd className="flex items-center gap-1 text-[#f1c27d] font-sans">
                        {accommodation.starRating}
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="pt-2">
                  <AccommodationEnquireButton
                    accommodationName={accommodation.name}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c68642] hover:bg-[#8d5524] text-[#080808] hover:text-black font-serif-luxury font-medium text-xs tracking-[0.18em] uppercase rounded transition-all shadow-lg shadow-[#c68642]/20 cursor-pointer"
                  />
                  <p className="text-[11px] text-white/40 font-sans text-center mt-3 leading-relaxed">
                    Our specialists will tailor availability and rates to your dates.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </SiteChrome>
  );
}
