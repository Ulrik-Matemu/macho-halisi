import Image from "next/image";
import { Eye } from "lucide-react";
import { aboutHero } from "@/data/aboutData";

/**
 * Full-bleed hero band for the About page. Uses the same image-with-overlay
 * treatment as the itinerary detail hero, then hands off to the cream
 * editorial sections below.
 */
export default function AboutHero() {
  return (
    <section className="relative h-[70vh] min-h-[460px] w-full bg-black">
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
          <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-sand uppercase mb-3">
            <Eye className="w-3.5 h-3.5 text-safari-gold" />
            <span>{aboutHero.eyebrow}</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.02em] leading-tight max-w-4xl">
            {aboutHero.title}
          </h1>
          <p className="font-sans font-light text-sm sm:text-base text-white/75 mt-4 max-w-2xl leading-relaxed">
            {aboutHero.lead}
          </p>
        </div>
      </div>
    </section>
  );
}
