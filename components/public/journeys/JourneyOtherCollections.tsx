import Link from "next/link";
import { journeyCollections } from "@/data/journeys";

/** Full-width rows linking to every other collection. */
export default function JourneyOtherCollections({ currentSlug }: { currentSlug: string }) {
  const others = journeyCollections.filter((c) => c.slug !== currentSlug);

  return (
    <section className="max-w-[1340px] mx-auto px-6 sm:px-16 pt-24 sm:pt-[120px] pb-28 sm:pb-[150px]">
      <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-10">
        Other journeys
      </div>
      <div className="border-t border-[#1E1913]/[0.16]">
        {others.map((c) => (
          <Link
            key={c.slug}
            href={`/journeys/${c.slug}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,300px)_90px_30px] gap-x-7 gap-y-2 items-baseline py-8 border-b border-[#1E1913]/[0.12] text-[#1E1913] hover:text-[#8A6A33] transition-colors"
          >
            <span className="font-serif-luxury font-light text-[clamp(28px,3.4vw,48px)] leading-[1.08] tracking-[0.02em]">
              {c.line1} <em className="italic">{c.line2}</em>
            </span>
            <span className="max-md:order-3 max-md:col-span-2 font-sans font-light text-[11px] tracking-[0.24em] text-[#1E1913]/70 uppercase">
              {c.eyebrow}
            </span>
            <span className="font-serif-luxury font-light text-[22px] text-right text-[#8A6A33]">
              {String(c.items.length).padStart(2, "0")}
            </span>
            <span className="hidden md:block font-sans font-light text-lg text-right">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
