import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import ScrollProgressBar from "@/components/public/ScrollProgressBar";
import JourneyCollectionTabs from "@/components/public/journeys/JourneyCollectionTabs";
import JourneyCollectionHero from "@/components/public/journeys/JourneyCollectionHero";
import JourneyExplorer from "@/components/public/journeys/JourneyExplorer";
import JourneyPlanCta from "@/components/public/journeys/JourneyPlanCta";
import JourneyOtherCollections from "@/components/public/journeys/JourneyOtherCollections";
import { getAllJourneyCollectionSlugs, getJourneyCollectionBySlug } from "@/data/journeys";
import { getSiteUrl } from "@/lib/site";

interface JourneyCollectionPageParams {
  collection: string;
}

// Fully static content — every collection is known and prerendered at
// build time, no on-demand fallback needed.
export const dynamicParams = false;

export function generateStaticParams(): JourneyCollectionPageParams[] {
  return getAllJourneyCollectionSlugs().map((collection) => ({ collection }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<JourneyCollectionPageParams>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getJourneyCollectionBySlug(slug);

  if (!collection) {
    return { title: "Journeys Not Found | Macho Halisi" };
  }

  const title = `${collection.line1} ${collection.line2}`;
  const url = `${getSiteUrl()}/journeys/${collection.slug}`;

  return {
    title: `${title} | Macho Halisi`,
    description: collection.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: collection.seoDescription,
      url,
      images: [{ url: collection.heroImage.url }],
    },
  };
}

export default async function JourneyCollectionPage({
  params,
}: {
  params: Promise<JourneyCollectionPageParams>;
}) {
  const { collection: slug } = await params;
  const collection = getJourneyCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const url = `${getSiteUrl()}/journeys/${collection.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${collection.line1} ${collection.line2}`,
    description: collection.seoDescription,
    url,
    numberOfItems: collection.items.length,
    itemListElement: collection.items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "TouristTrip",
        name: item.name,
        description: item.sub,
        ...(item.price != null && {
          offers: { "@type": "Offer", price: item.price, priceCurrency: "USD" },
        }),
      },
    })),
  };

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#F6F2EA] text-[#1E1913]">
        <ScrollProgressBar />
        <JourneyCollectionTabs activeSlug={collection.slug} />
        <JourneyCollectionHero
          line1={collection.line1}
          line2={collection.line2}
          eyebrow={collection.eyebrow}
          lead={collection.lead}
          facts={collection.facts}
          caption={collection.caption}
          heroImage={collection.heroImage}
          count={String(collection.items.length).padStart(2, "0")}
        />
        <JourneyExplorer
          key={collection.slug}
          items={collection.items}
          unit={collection.unit}
          facetLabel={collection.facetLabel}
        />
        <JourneyPlanCta />
        <JourneyOtherCollections currentSlug={collection.slug} />
      </div>
    </SiteChrome>
  );
}
