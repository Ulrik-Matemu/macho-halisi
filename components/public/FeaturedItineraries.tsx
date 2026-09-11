import Link from "next/link";
import { getPublishedItineraries } from "@/lib/public/api";
import ItineraryStackCard from "./ItineraryStackCard";

const FEATURED_COUNT = 4;

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
 * piles beneath the next as the visitor scrolls past it — at every
 * breakpoint, phones included; ItineraryStackCard carries its own
 * responsive sticky offsets and a lighter mobile footprint so the pile
 * still has room to read as a pile on a short viewport.
 */
export default async function FeaturedItineraries() {
  const { data: itineraries, pagination } = await getPublishedItineraries({ limit: FEATURED_COUNT });

  if (itineraries.length === 0) {
    return null;
  }

  return (
    // Curtain-reveal over the Hero: Hero's video stays sticky-pinned for a
    // 220vh scroll range (see Hero.tsx) and its own text has already faded
    // out by 85% of that range, leaving nothing but plain video for the
    // final ~15% — exactly the window this section's negative top margin
    // pulls it into, so it visually slides up and over the still-pinned
    // video like a sheet being drawn across it. Pure CSS (negative margin
    // + rounded top + z-10 painting over Hero's un-indexed sticky child,
    // which loses stacking ties to normal DOM paint order) — no scroll
    // listener needed, so it stays smooth on any device.
    <section className="relative z-10 bg-[#EFE9DE] -mt-[110px] sm:-mt-[150px] lg:-mt-[190px] rounded shadow-[0_-60px_110px_-45px_rgba(0,0,0,0.55)] pt-16 sm:pt-20 lg:pt-[76px]">
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

        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 pb-4 lg:pb-[120px]">
          {itineraries.map((itinerary, idx) => (
            <ItineraryStackCard key={itinerary.id} itinerary={itinerary} index={idx} priority={idx < 2} />
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
