import Image from "next/image";
import { aboutHero } from "@/data/aboutData";

/**
 * Full-bleed hero band for the About page: the fleet photo with only the
 * page title over it, then the cream editorial sections below.
 */
export default function AboutHero() {
  return (
    <section data-navbar-hero className="relative h-[70vh] min-h-[460px] w-full bg-black">
      <Image
        src={aboutHero.image.url}
        alt={aboutHero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.12em] leading-tight">
            {aboutHero.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
