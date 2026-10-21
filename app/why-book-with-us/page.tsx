import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import PageTitleHero from "@/components/public/PageTitleHero";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { whyBookHero, whyBookParagraphs } from "@/data/whyBookData";
import { getSiteUrl } from "@/lib/site";

const TITLE = "Why Book With Us — Owner-Operated Safaris from Karatu | Macho Halisi";
const DESCRIPTION =
  "Owner-operated for 17 years from Karatu, at the gateway to the Ngorongoro Conservation Area and Lake Manyara. Transparent, middleman-free pricing, Wilderness First Responder-certified guides and a private fleet of 20 custom 4x4 Land Cruisers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/why-book-with-us` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getSiteUrl()}/why-book-with-us`,
    siteName: "Macho Halisi",
  },
};

export default function WhyBookWithUsPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <Breadcrumbs visible={false} items={[{ name: "Why Book With Us", path: "/why-book-with-us" }]} />

      <PageTitleHero title={whyBookHero.title} image={whyBookHero.image} />

      {/* Plain text from the client's Why Book With Us document
          (data/whyBookData.ts). */}
      <div className="bg-safari-tan text-safari-bark pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-8 sm:space-y-10">
            {whyBookParagraphs.map((paragraph, idx) => (
              <ScrollReveal key={idx} delayMs={idx * 60} size="lift">
                <p
                  className={`font-sans font-light text-safari-bark/80 leading-[1.9] ${
                    idx === 0 ? "text-base sm:text-lg text-safari-bark" : "text-sm sm:text-base"
                  }`}
                >
                  {paragraph}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
