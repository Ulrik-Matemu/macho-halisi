import type { Metadata } from "next";
import { BedDouble } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ScrollReveal from "@/components/public/ScrollReveal";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import LodgesExplorer from "@/components/public/camps-lodges/LodgesExplorer";
import { campsLodges } from "@/data/campsLodges";
import { LODGE_AREAS, type LodgeArea } from "@/data/campsLodgeHubs";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Camps & Lodges in Tanzania | Where to Stay on Safari | Macho Halisi",
  description:
    "Hand-picked camps, lodges and hotels across Tanzania — from the Serengeti and Ngorongoro to Zanzibar, the Southern Circuit and Lake Tanganyika — chosen for setting, comfort and convenience.",
  alternates: { canonical: `${getSiteUrl()}/camps-lodges` },
};

// Properties with photos lead the default order; the sort is stable, so the
// data files' regional best-first order holds within each group.
const photosFirst = [...campsLodges].sort((a, b) => Number(a.images.length === 0) - Number(b.images.length === 0));

export default async function CampsLodgesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const initialArea: LodgeArea | "all" = LODGE_AREAS.find((a) => a === area) ?? "all";

  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Camps & Lodges", path: "/camps-lodges" }]} />
      <div className="bg-safari-linen text-safari-bark pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-28 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <ScrollReveal className="mb-10 sm:mb-14 pb-8 border-b border-safari-bark/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
              <BedDouble className="w-3.5 h-3.5 text-safari-russet" />
              <span>Bespoke Journeys &amp; Accommodations</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-safari-bark tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              Camps &amp; Lodges
            </h1>
            <p className="text-sm text-safari-bark/78 font-sans mt-3 max-w-2xl leading-relaxed">
              Where we like to stay across Tanzania — safari lodges and tented camps in the wild, historic hotels in
              the towns and beach retreats on the coast. Some sit inside the parks; others are simply the best base
              for reaching them. We confirm availability and tailor every stay when you enquire.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={100} size="lift">
            <LodgesExplorer key={initialArea} lodges={photosFirst} initialArea={initialArea} />
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
