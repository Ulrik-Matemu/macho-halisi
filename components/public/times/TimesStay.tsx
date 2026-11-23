import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import { TIMES_STAY_PHOTOS } from "@/data/timesData";

/**
 * "Where the day ends": a mosaic of Oasis Residence, one of Macho Halisi's
 * lodges in Karatu, leading into the Our Lodges pages.
 */
export default function TimesStay() {
  const [lead, ...rest] = TIMES_STAY_PHOTOS;

  return (
    <section id="stay" className="scroll-mt-20 bg-safari-night px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-24 items-end mb-12 sm:mb-16">
            <div>
              <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-gold uppercase mb-4">Where the day ends</div>
              <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[0.12em] text-safari-cream uppercase">
                Oasis Residence
              </h2>
            </div>
            <p className="font-sans font-light text-[15px] leading-[2] text-safari-cream/75 max-w-lg">
              Seven private pool suites in the Karatu highlands, between the Ngorongoro Crater and Lake Manyara. A quiet place to
              arrive, and now one of our lodges.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100} size="lift">
          <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-[auto] gap-3 sm:gap-4">
            <div className="group relative col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto lg:min-h-[520px] overflow-hidden bg-safari-bark">
              <Image
                src={lead.src}
                alt={lead.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-5 font-sans font-light text-[10px] tracking-[0.3em] uppercase text-safari-cream/90">
                Karatu, Tanzania
              </span>
            </div>
            {rest.map((photo) => (
              <div key={photo.src} className="group relative aspect-[4/3] overflow-hidden bg-safari-bark">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={160} size="lift">
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/accommodations"
              className="font-sans font-light text-[11px] tracking-[0.3em] uppercase bg-safari-ochre hover:bg-safari-gold text-safari-bark px-8 py-4 rounded transition-colors"
            >
              Explore our lodges
            </Link>
            <span className="font-sans font-light text-[12px] tracking-[0.16em] text-safari-cream/55">
              Oasis Residence &amp; Kudu Lodge &amp; Campsite
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
