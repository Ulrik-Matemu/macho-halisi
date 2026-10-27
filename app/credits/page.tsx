import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { PHOTO_CREDITS } from "@/data/photoCredits";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photo Credits | Macho Halisi Safaris",
  description:
    "Photographers and licences for the openly licensed images used on destination pages across the Macho Halisi Safaris website.",
  alternates: { canonical: `${getSiteUrl()}/credits` },
};

export default function CreditsPage() {
  const byDestination = new Map<string, typeof PHOTO_CREDITS>();
  for (const credit of PHOTO_CREDITS) {
    byDestination.set(credit.destination, [...(byDestination.get(credit.destination) ?? []), credit]);
  }

  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Photo credits", path: "/credits" }]} />
      <SmoothScroll />
      <div className="bg-safari-linen text-safari-bark pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="pb-10 mb-12 border-b border-safari-bark/10">
            <div className="text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-3">
              Acknowledgements
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-safari-bark tracking-[0.02em]">
              Photo Credits
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-safari-bark/78">
              Several destination pages use photographs shared under open licences on Wikimedia Commons. We are
              grateful to the photographers below. Images may have been resized or cropped; licence terms stay with
              each original file.
            </p>
          </div>

          <div className="space-y-12">
            {[...byDestination.entries()].map(([destination, credits]) => (
              <section key={destination}>
                <h2 className="font-serif-luxury text-2xl font-light mb-4">{destination}</h2>
                <ul className="divide-y divide-safari-bark/10 border-y border-safari-bark/10">
                  {credits.map((credit) => (
                    <li
                      key={credit.sourceUrl}
                      className="py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-sm"
                    >
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-safari-bark hover:text-safari-russet transition-colors"
                      >
                        {credit.title}
                      </a>
                      <span className="text-safari-bark/78">by {credit.author}</span>
                      {credit.licenseUrl ? (
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-safari-russet hover:underline"
                        >
                          {credit.license}
                        </a>
                      ) : (
                        <span className="text-safari-russet">{credit.license}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
