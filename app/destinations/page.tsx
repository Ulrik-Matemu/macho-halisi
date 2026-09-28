import type { Metadata } from "next";
import { Compass } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ScrollReveal from "@/components/public/ScrollReveal";
import DestinationsExplorer from "@/components/public/destinations/DestinationsExplorer";
import { destinations } from "@/data/destinations";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tanzania Safari Destinations | National Parks, Zanzibar & More | Macho Halisi",
  description:
    "Explore Tanzania's top safari destinations with Macho Halisi — Serengeti, Ngorongoro Crater, Tarangire, Kilimanjaro, Zanzibar and the wild Southern Circuit.",
  alternates: { canonical: `${getSiteUrl()}/destinations` },
};

export default function DestinationsIndexPage() {
  return (
    <SiteChrome>
      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-32 pb-16 sm:pb-24 lg:pb-28 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <ScrollReveal className="mb-10 sm:mb-14 pb-8 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>Tanzania Destinations</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E1913] tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-snug">
              Where to Go in Tanzania
            </h1>
            <p className="text-sm text-[#1E1913]/62 font-sans mt-3 max-w-2xl leading-relaxed">
              From the endless plains of the Serengeti to the spice-scented lanes of Zanzibar —
              explore the national parks, conservation areas and coastline that make Tanzania one
              of Africa&apos;s greatest safari and beach destinations.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={100} size="lift">
            <DestinationsExplorer destinations={destinations} />
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
