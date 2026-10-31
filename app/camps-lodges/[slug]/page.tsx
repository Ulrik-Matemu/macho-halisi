import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ScrollReveal from "@/components/public/ScrollReveal";
import LodgeCover from "@/components/public/camps-lodges/LodgeCover";
import LodgeCard from "@/components/public/camps-lodges/LodgeCard";
import AccommodationEnquireButton from "@/components/public/accommodations/AccommodationEnquireButton";
import { JsonLd } from "@/lib/seo/jsonLd";
import { clip } from "@/lib/seo/text";
import { getSiteUrl, OG_DEFAULT_IMAGE } from "@/lib/site";
import {
  getAllCampLodgeSlugs,
  getCampLodgeBySlug,
  getDestinationSlugsForLodge,
  getOtherStaysInHub,
} from "@/data/campsLodges";
import { LODGE_HUBS } from "@/data/campsLodgeHubs";
import { getDestinationBySlug } from "@/data/destinations";

interface LodgePageParams {
  slug: string;
}

export function generateStaticParams(): LodgePageParams[] {
  return getAllCampLodgeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<LodgePageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const lodge = getCampLodgeBySlug(slug);
  if (!lodge) return { title: "Stay Not Found | Macho Halisi", robots: { index: false } };

  const hub = LODGE_HUBS[lodge.hub];
  const title = `${lodge.name} — ${lodge.kind} in ${hub.label} | Macho Halisi`;
  const description = clip(`${lodge.name}: ${lodge.summary}`);
  const url = `${getSiteUrl()}/camps-lodges/${lodge.slug}`;
  const image = lodge.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: image ? [{ url: image, alt: lodge.images[0].alt }] : [OG_DEFAULT_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [OG_DEFAULT_IMAGE.url] },
  };
}

const LODGING_SCHEMA_TYPE: Record<string, string> = {
  Hotel: "Hotel",
  "Boutique Hotel": "Hotel",
  Resort: "Resort",
  "Beach Lodge": "Resort",
};

export default async function CampLodgePage({ params }: { params: Promise<LodgePageParams> }) {
  const { slug } = await params;
  const lodge = getCampLodgeBySlug(slug);
  if (!lodge) notFound();

  const hub = LODGE_HUBS[lodge.hub];
  const url = `${getSiteUrl()}/camps-lodges/${lodge.slug}`;
  const nearby = getDestinationSlugsForLodge(lodge)
    .map((s) => getDestinationBySlug(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .slice(0, 6);
  const others = getOtherStaysInHub(lodge, 3);
  const gallery = lodge.images.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": LODGING_SCHEMA_TYPE[lodge.kind] ?? "LodgingBusiness",
    "@id": `${url}#lodging`,
    name: lodge.name,
    url,
    description: lodge.summary,
    image: lodge.images.map((img) => `${getSiteUrl()}${img.url}`),
    address: { "@type": "PostalAddress", addressLocality: lodge.location, addressCountry: "TZ" },
    ...(lodge.features.length
      ? { amenityFeature: lodge.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })) }
      : {}),
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <article className="bg-safari-linen text-safari-bark pb-16 sm:pb-24">
        <div className="relative h-[56vh] min-h-[380px] w-full bg-safari-bark">
          <LodgeCover lodge={lodge} priority sizes="100vw" tagSide="right" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-[1240px] mx-auto px-6 sm:px-16 pb-10 sm:pb-14">
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-sans tracking-[0.25em] uppercase mb-3">
                <span className="px-2.5 py-1 rounded bg-black/55 backdrop-blur border border-white/15 text-safari-sand">{lodge.kind}</span>
                <span className="px-2.5 py-1 rounded bg-safari-gold/90 text-safari-bark">{lodge.tier}</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-6xl font-light text-white tracking-wide leading-tight max-w-4xl">
                {lodge.name}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-white/75 mt-3 font-sans">
                <MapPin className="w-4 h-4 text-safari-gold shrink-0" />
                {lodge.location}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-10 sm:pt-14">
          <Breadcrumbs
            className="mb-10"
            items={[
              { name: "Camps & Lodges", path: "/camps-lodges" },
              { name: lodge.name, path: `/camps-lodges/${lodge.slug}` },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2 space-y-14">
              <ScrollReveal>
                <p className="font-serif-luxury italic text-xl sm:text-2xl text-safari-umber leading-snug mb-6">{lodge.tagline}</p>
                <div className="space-y-5">
                  {lodge.description.map((p, i) => (
                    <p key={i} className="font-sans font-light text-[15px] sm:text-base leading-[1.85] text-safari-bark/85">
                      {p}
                    </p>
                  ))}
                </div>
              </ScrollReveal>

              <section>
                <h2 className="font-serif-luxury font-light text-2xl sm:text-3xl tracking-[0.12em] uppercase mb-6">Why stay here</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {lodge.highlights.map((h) => (
                    <div key={h.title} className="border-t border-safari-gold/60 pt-4">
                      <h3 className="font-serif-luxury text-lg text-safari-bark mb-2">{h.title}</h3>
                      <p className="font-sans font-light text-sm leading-relaxed text-safari-bark/78">{h.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {lodge.features.length > 0 && (
                <section>
                  <h2 className="font-serif-luxury font-light text-2xl sm:text-3xl tracking-[0.12em] uppercase mb-6">At the property</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {lodge.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-safari-bark/85 font-sans">
                        <Check className="w-4 h-4 text-safari-russet shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {gallery.length > 0 && (
                <section>
                  <h2 className="font-serif-luxury font-light text-2xl sm:text-3xl tracking-[0.12em] uppercase mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.map((img, i) => (
                      <div key={img.url} className={`relative overflow-hidden aspect-[4/3] ${gallery.length % 2 === 1 && i === 0 ? "sm:col-span-2 sm:aspect-[16/9]" : ""}`}>
                        <Image src={img.url} alt={img.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 p-6 border border-safari-bark/15 bg-white">
                <span className="text-[10px] tracking-[0.25em] text-safari-russet uppercase block mb-4">At a glance</span>
                <dl className="space-y-3 text-sm font-sans">
                  <div className="flex justify-between gap-4">
                    <dt className="text-safari-bark/60">Type</dt>
                    <dd className="text-right">{lodge.kind}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-safari-bark/60">Style</dt>
                    <dd className="text-right">{lodge.tier}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-safari-bark/60">Area</dt>
                    <dd className="text-right">{hub.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-safari-bark/60">Best for</dt>
                    <dd className="text-right">{lodge.idealFor.join(", ")}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <AccommodationEnquireButton accommodationName={lodge.name} label="Enquire About This Stay" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-safari-ochre hover:bg-safari-russet text-safari-night hover:text-black font-serif-luxury font-medium text-xs tracking-[0.18em] uppercase rounded transition-all cursor-pointer" />
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-safari-bark/60 font-sans">
                  Rates are on request. We confirm current availability and tailor the stay to your journey.
                </p>
              </div>
            </aside>
          </div>

          {nearby.length > 0 && (
            <section className="pt-20">
              <h2 className="font-serif-luxury font-light text-2xl sm:text-3xl tracking-[0.12em] uppercase mb-6">Handy for</h2>
              <div className="flex flex-wrap gap-3">
                {nearby.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="px-4 py-2 rounded border border-safari-bark/20 bg-white font-sans text-xs tracking-[0.12em] uppercase text-safari-bark hover:border-safari-gold hover:text-safari-russet transition-colors"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section className="pt-20">
              <h2 className="font-serif-luxury font-light text-2xl sm:text-3xl tracking-[0.12em] uppercase mb-6">
                Also in {hub.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {others.map((o) => (
                  <LodgeCard key={o.slug} lodge={o} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </SiteChrome>
  );
}
