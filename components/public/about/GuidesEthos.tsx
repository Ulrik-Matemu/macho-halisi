import Image from "next/image";
import { Check } from "lucide-react";
import { guidesEthos } from "@/data/aboutData";

/**
 * Master-naturalist guides ethos — image alongside the guiding principles.
 * No individual roster (the source site has none); this is the guiding
 * philosophy rather than named profiles.
 */
export default function GuidesEthos() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-safari-bark/10 bg-safari-champagne shadow-lg order-last lg:order-first">
        <Image
          src={guidesEthos.image.url}
          alt={guidesEthos.image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-3">
          <span>{guidesEthos.eyebrow}</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-safari-bark leading-tight">
          {guidesEthos.heading}
        </h2>
        <p className="font-sans font-light text-sm sm:text-base text-safari-bark/70 mt-4 leading-relaxed">
          {guidesEthos.lead}
        </p>

        <ul className="mt-8 space-y-5">
          {guidesEthos.principles.map((principle) => (
            <li key={principle.title} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-safari-russet text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="font-sans text-sm font-medium text-safari-bark">{principle.title}</h3>
                <p className="font-sans font-light text-sm text-safari-bark/65 leading-relaxed mt-0.5">
                  {principle.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
