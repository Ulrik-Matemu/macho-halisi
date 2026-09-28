import Image from "next/image";
import { Quote } from "lucide-react";
import { founder } from "@/data/aboutData";

/**
 * Founder profile — a square editorial portrait frame alongside the origin
 * narrative and a pull quote. Flat corners per the site convention.
 */
export default function FounderStory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div className="lg:col-span-5">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1E1913]/10 bg-[#E7DFD1] shadow-lg">
          <Image
            src={founder.portrait.url}
            alt={founder.portrait.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center"
          />
        </div>
        <div className="mt-5">
          <p className="font-serif-luxury text-2xl text-[#1E1913]">{founder.name}</p>
          <p className="text-xs font-sans font-light tracking-[0.15em] uppercase text-[#8A6A33] mt-1">
            {founder.role}
          </p>
          <p className="text-xs font-sans font-light text-[#1E1913]/50 mt-0.5">{founder.location}</p>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-start gap-3 border-l-2 border-[#8A6A33] pl-5">
          <Quote className="w-6 h-6 text-[#C9A46A] shrink-0 -mt-1" />
          <p className="font-serif-luxury text-xl sm:text-2xl font-light text-[#1E1913] leading-snug italic">
            {founder.quote}
          </p>
        </div>
        <div className="space-y-4">
          {founder.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="font-sans font-light text-sm sm:text-base text-[#1E1913]/75 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
