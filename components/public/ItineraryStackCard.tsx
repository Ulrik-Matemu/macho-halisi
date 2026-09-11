import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarRange } from "lucide-react";
import type { PublicItinerarySummary } from "@/lib/public/types";
import {
  formatStartingPrice,
  getCurrentOrUpcomingPeriod,
  formatAvailabilityPeriodLabel,
} from "@/lib/public/api";
import EnquireButton from "./EnquireButton";

interface ItineraryStackCardProps {
  itinerary: PublicItinerarySummary;
  index: number;
  priority?: boolean;
}

// Sticky offsets (px), staggered per card so each settled card still peeks
// out from beneath the next. Two separate scales rather than one shared
// number: the fixed Navbar clears ~88px below `lg` versus ~104px at `lg`
// and up (a smaller logo/padding below `lg` — see Navbar.tsx), and a
// phone's narrower, more precious vertical space wants a tighter stagger
// so more of each card actually reveals before the next covers it, rather
// than the desktop gap wasting screen on a small viewport.
const MOBILE_TOP_BASE = 88;
const MOBILE_TOP_STEP = 10;
const DESKTOP_TOP_BASE = 128;
const DESKTOP_TOP_STEP = 16;

/**
 * Wide two-column "sticky stack" card for the homepage Featured Itineraries
 * section — design source: Claude Design project
 * 97cc8521-65d3-4bbc-9442-088e8a572c22, "Featured Itineraries.dc.html",
 * option 2a. Sticks at a responsive offset (see the constants above) and
 * piles beneath the next card as the visitor scrolls, at every breakpoint
 * — below `lg` it drops to a single-column layout (image, then copy) but
 * keeps the same pin-and-pile behavior, just tuned lighter: less padding,
 * a shorter image, and a 2-line (not 3-line) overview clamp, so a phone's
 * shorter viewport still has room to show the piling effect rather than
 * one card consuming the entire screen.
 *
 * Distinct from components/public/ItineraryCard.tsx, which remains the
 * compact grid card used by /itineraries — this card's two-column,
 * image-plus-copy layout is a different shape entirely, not a variant.
 */
export default function ItineraryStackCard({ itinerary, index, priority = false }: ItineraryStackCardProps) {
  const cover = itinerary.images[0];
  const destinationNames = itinerary.destinations.map((d) => d.destination.name).join(" · ");
  const price = formatStartingPrice(itinerary.startingPrice);
  const indexLabel = String(index + 1).padStart(2, "0");
  const activePeriod = getCurrentOrUpcomingPeriod(itinerary.availabilityPeriods);

  const mobileTop = MOBILE_TOP_BASE + index * MOBILE_TOP_STEP;
  const desktopTop = DESKTOP_TOP_BASE + index * DESKTOP_TOP_STEP;

  return (
    <article
      className="sticky top-[var(--stack-top-mobile)] lg:top-[var(--stack-top-desktop)] bg-[#F6F2EA] rounded p-5 sm:p-6 lg:p-[30px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] gap-5 sm:gap-6 lg:gap-11 lg:items-center lg:min-h-[460px]"
      style={
        {
          "--stack-top-mobile": `${mobileTop}px`,
          "--stack-top-desktop": `${desktopTop}px`,
          boxShadow: "0 -2px 0 rgba(30,25,19,.06), 0 -24px 48px rgba(30,25,19,.1)",
        } as React.CSSProperties
      }
    >
      {/* Image — shorter on mobile (16:9) so the card has less height to
          scroll past before it settles, leaving room for the pile beneath
          it to actually show; widens back out to the design's 4:3 at sm,
          then fills its own grid cell at lg. */}
      <div className="relative min-w-0 rounded aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:self-stretch overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || itinerary.title}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#d8cdb8] to-[#c4b699]" />
        )}

        {itinerary.availabilityStatus !== "AVAILABLE" && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-sm text-[10px] font-sans tracking-wider uppercase font-semibold bg-[#1E1913]/85 text-[#F6F2EA]">
            {itinerary.availabilityStatus === "LIMITED" ? "Limited Availability" : "Fully Booked"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 pt-1 sm:pt-2 lg:pt-3.5 lg:pr-8 lg:pl-0 pb-1">
        <div className="flex items-baseline gap-4 mb-3 sm:mb-4 lg:mb-5">
          <span className="font-sans font-light text-xs tracking-[0.2em] text-[#8A6A33]">
            {indexLabel}
          </span>
          {destinationNames && (
            <span className="font-sans font-light text-[10.5px] tracking-[0.34em] text-[#8A6A33] uppercase truncate">
              {destinationNames}
            </span>
          )}
        </div>

        <h3 className="font-serif-luxury font-light text-2xl sm:text-3xl lg:text-4xl leading-[1.14] tracking-[0.04em] text-[#1E1913] mb-3 sm:mb-4 lg:mb-[18px]">
          {itinerary.title}
        </h3>

        {itinerary.overview && (
          <p className="font-sans font-light text-sm leading-[1.92] text-[#1E1913]/62 max-w-[450px] mb-4 sm:mb-6 lg:mb-[26px] line-clamp-2 lg:line-clamp-3">
            {itinerary.overview}
          </p>
        )}

        <div className="flex items-center gap-8 sm:gap-10 lg:gap-12 mb-3 sm:mb-4">
          {itinerary.nights !== null && (
            <div>
              <div className="font-sans font-light text-[10px] tracking-[0.28em] text-[#1E1913]/70 uppercase mb-2">
                Duration
              </div>
              <div className="font-serif-luxury font-light text-lg sm:text-xl tracking-[0.06em] text-[#1E1913]">
                {itinerary.nights + 1} Days / {itinerary.nights} Nights
              </div>
            </div>
          )}
          <div>
            <div className="font-sans font-light text-[10px] tracking-[0.28em] text-[#1E1913]/70 uppercase mb-2">
              {itinerary.priceOnRequest ? "Pricing" : "From"}
            </div>
            <div className="font-serif-luxury font-light text-lg sm:text-xl tracking-[0.06em] text-[#8A6A33]">
              {itinerary.priceOnRequest ? "Price on request" : price ? `$${price} pp` : "—"}
            </div>
          </div>
        </div>

        {activePeriod && (
          <div className="hidden sm:flex items-center gap-1.5 font-sans font-light text-xs text-[#1E1913]/70">
            <CalendarRange className="w-3.5 h-3.5 text-[#8A6A33]" />
            <span>{formatAvailabilityPeriodLabel(activePeriod)}</span>
          </div>
        )}

        <div className="flex items-center gap-5 sm:gap-7 flex-wrap mt-4 sm:mt-5">
          <EnquireButton
            itineraryId={itinerary.id}
            itineraryTitle={itinerary.title}
            label="Plan this trip"
            showIcon={false}
            className="inline-flex items-center justify-center font-sans font-light text-[11px] tracking-[0.3em] uppercase text-[#F6F2EA] bg-[#1E1913] hover:bg-[#8A6A33] transition-colors px-6 sm:px-8 py-3.5 sm:py-4 rounded whitespace-nowrap cursor-pointer"
          />
          <Link
            href={`/itineraries/${itinerary.slug}`}
            className="group inline-flex items-center gap-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-[#1E1913] hover:text-[#8A6A33] transition-colors whitespace-nowrap"
          >
            <span>View itinerary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
