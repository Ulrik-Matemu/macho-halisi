import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { destinations } from "@/data/destinations";

// The five places most guests ask about first; the rest live on /destinations.
const FEATURED = ["serengeti", "ngorongoro", "tarangire", "kilimanjaro", "zanzibar"];

export default function HomeDestinations() {
  const items = FEATURED.map((slug) => destinations.find((d) => d.slug === slug)).filter(
    (d): d is (typeof destinations)[number] => Boolean(d)
  );

  return (
    <section className="relative z-10 bg-safari-linen text-safari-bark py-20 sm:py-28">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <ScrollReveal className="flex items-end justify-between gap-6 flex-wrap mb-12 sm:mb-16">
          <div>
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-5">
              Where we take you
            </div>
            <h2 className="m-0 font-serif-luxury font-light text-[clamp(32px,4.4vw,62px)] leading-[1.06] tracking-[0.04em] text-safari-bark">
              Tanzania&rsquo;s <em>great places</em>
            </h2>
          </div>
          <Link
            href="/destinations"
            className="font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-russet hover:text-safari-bark transition-colors whitespace-nowrap"
          >
            All destinations →
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {items.map((d, idx) => (
            <ScrollReveal
              key={d.slug}
              delayMs={idx * 70}
              size="lift"
              className={idx < 2 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <Link href={`/destinations/${d.slug}`} className="group block">
                <div
                  className={`relative overflow-hidden bg-safari-champagne mb-4 ${
                    idx < 2 ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/5] lg:aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={d.heroImage}
                    alt={d.heroImageAlt}
                    fill
                    sizes={idx < 2 ? "(max-width: 1024px) 50vw, 50vw" : "(max-width: 1024px) 50vw, 33vw"}
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="font-sans font-light text-[10.5px] tracking-[0.3em] uppercase text-safari-umber mb-1.5">
                  {d.categoryLabel}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="m-0 font-serif-luxury font-light text-[22px] sm:text-[28px] tracking-[0.03em] text-safari-bark group-hover:text-safari-russet transition-colors">
                    {d.name}
                  </h3>
                  <span aria-hidden className="text-safari-russet transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
