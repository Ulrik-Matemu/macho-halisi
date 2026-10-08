import type { Metadata } from "next";
import { Hotel } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import AccommodationsExplorer from "@/components/public/accommodations/AccommodationsExplorer";
import { getPublishedAccommodations } from "@/lib/public/api";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { itemList, JsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Safari Lodges & Tented Camps in Tanzania | Macho Halisi",
  description:
    "Luxury safari lodges, tented camps, hotels and beach villas across the Serengeti, Ngorongoro, Tarangire and Zanzibar — hand-picked by native Tanzanian guides.",
  alternates: { canonical: `${getSiteUrl()}/accommodations` },
  openGraph: {
    title: "Safari Lodges & Tented Camps in Tanzania | Macho Halisi",
    description: "Hand-picked safari lodges, tented camps and beach villas across Tanzania.",
    url: `${getSiteUrl()}/accommodations`,
  },
};

const PAGE_SIZE = 48;

export default async function AccommodationsIndexPage() {
  const { data: accommodations, pagination } = await getPublishedAccommodations({ limit: PAGE_SIZE });

  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Accommodations", path: "/accommodations" }]} />
      <JsonLd data={itemList("Safari accommodation in Tanzania", accommodations.map((a) => ({ name: a.name, path: `/accommodations/${a.slug}` })))} />
      <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-28">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-10 sm:mb-14 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-gold uppercase mb-2">
              <Hotel className="w-3.5 h-3.5 text-safari-ochre" />
              <span>Where you&apos;ll stay</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              Safari Lodges &amp; Camps in Tanzania
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-sans mt-3 max-w-2xl leading-relaxed">
              {pagination.total > 0
                ? `${pagination.total} hand-selected ${pagination.total === 1 ? "property" : "properties"} across Tanzania — from luxury tented camps to beachfront villas.`
                : "Our specialists are currently curating our collection of camps and lodges — check back soon."}
            </p>
          </div>

          {accommodations.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d]">
              <Hotel className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-sm text-white/50 font-sans">
                No accommodations published yet. Please check back soon.
              </p>
            </div>
          ) : (
            <AccommodationsExplorer accommodations={accommodations} />
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
