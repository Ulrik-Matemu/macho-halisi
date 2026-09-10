import Link from "next/link";
import { getPublishedItineraries } from "@/lib/public/api";
import ItineraryStackCard from "./ItineraryStackCard";

const FEATURED_COUNT = 4;

// Sticky offsets (px) for each card, staggered by 16px per the design.
// Base is ~24px below the fixed Navbar's rendered height (py-6 + h-14 logo
// ≈ 104px at lg and up), not the design file's raw 28/44/60/76 — those
// assume no fixed header and would slide every card underneath the Navbar.
const STICKY_TOP_BASE = 128;
const STICKY_TOP_STEP = 16;

/**
 * Homepage section rendered directly below the Hero. Server component —
 * fetches PUBLISHED itineraries at request/build time via the backend's
 * public API (see lib/public/api.ts), no client-side loading state needed.
 * Renders nothing at all when there is nothing published yet, rather than
 * showing an empty section shell on the live marketing site.
 *
 * Design source: Claude Design project 97cc8521-65d3-4bbc-9442-088e8a572c22,
 * "Featured Itineraries.dc.html", option 2a — "sticky stack". Each
 * itinerary is a wide card (see ItineraryStackCard) that pins in place and
 * piles beneath the next as the visitor scrolls past it.
 */
export default async function FeaturedItineraries() {
  const { data: itineraries, pagination } = await getPublishedItineraries({ limit: FEATURED_COUNT });

  if (itineraries.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 bg-[#EFE9DE] pt-16 sm:pt-20 lg:pt-[76px]">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-12 lg:mb-11">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-[18px]">
              Featured Itineraries
            </div>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-[46px] leading-[1.08] tracking-[0.16em] text-[#1E1913] uppercase">
              Journeys of a Lifetime
            </h2>
          </div>

          <p className="font-sans font-light text-sm leading-[1.9] text-[#1E1913]/62 max-w-[360px] lg:text-right">
            Four signature routes, one continuous scroll. Each card settles into place before the next
            rises over it.
          </p>
        </div>

        <div className="flex flex-col gap-10 pb-4 lg:pb-[120px]">
          {itineraries.map((itinerary, idx) => (
            <ItineraryStackCard
              key={itinerary.id}
              itinerary={itinerary}
              index={idx}
              stickyTop={STICKY_TOP_BASE + idx * STICKY_TOP_STEP}
              priority={idx < 2}
            />
          ))}
        </div>

        <div className="relative z-10 bg-[#EFE9DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 sm:py-10 border-t border-[#1E1913]/[0.12]">
          <span className="font-sans font-light text-[11px] tracking-[0.28em] text-[#1E1913]/70 uppercase">
            {itineraries.length} of {pagination.total} itinerar{pagination.total === 1 ? "y" : "ies"} in view
          </span>
          <Link
            href="/itineraries"
            className="font-sans font-light text-[11px] tracking-[0.3em] text-[#1E1913] hover:text-[#8A6A33] uppercase transition-colors"
          >
            View All Journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
