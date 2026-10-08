import Image from "next/image";
import { Quote } from "lucide-react";
import { founder } from "@/data/aboutData";

/**
 * The origin story — a company image alongside the founding narrative and a
 * pull quote. Flat corners per the site convention.
 *
 * Deliberately does NOT caption the image with the founder's name: the photo
 * is a generic team/fleet shot (see founder.portrait in aboutData.ts) and we
 * have no confirmed photograph of Dawson Minja, so labelling a face with his
 * name would misattribute a real person. He is credited on the quote — which
 * is an attribution of words, not of a likeness — and named in the prose.
 */
export default function FounderStory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div className="lg:col-span-5">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-safari-bark/10 bg-safari-champagne shadow-lg">
          <Image
            src={founder.portrait.url}
            alt={founder.portrait.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center"
          />
        </div>
        <p className="mt-3 text-xs font-sans font-light text-safari-bark/50 leading-relaxed">
          Our guides and fleet — {founder.location}
        </p>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="border-l-2 border-safari-russet pl-5">
          <div className="flex items-start gap-3">
            <Quote className="w-6 h-6 text-safari-gold shrink-0 -mt-1" />
            <p className="font-serif-luxury text-xl sm:text-2xl font-light text-safari-bark leading-snug italic">
              {founder.quote}
            </p>
          </div>
          <p className="mt-3 pl-9 text-xs font-sans font-light tracking-[0.15em] uppercase text-safari-russet">
            {founder.name} · {founder.role}
          </p>
        </div>
        <div className="space-y-4">
          {founder.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="font-sans font-light text-sm sm:text-base text-safari-bark/75 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
