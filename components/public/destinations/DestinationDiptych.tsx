import Image from "next/image";
import ScrollReveal from "@/components/public/ScrollReveal";
import type { DestinationGalleryImage } from "@/data/destinations";

interface DestinationDiptychProps {
  left: DestinationGalleryImage;
  right: DestinationGalleryImage;
  caption: string;
}

/**
 * Two offset images that reveal in on scroll, using the site's existing
 * ScrollReveal component (opacity/translate) rather than a bespoke
 * scroll-driven parallax drift — an earlier version applied a continuously
 * updated inline `transform` under `will-change: transform` to the same
 * element wrapping the images, which reliably broke image painting in
 * testing (the images stopped rendering entirely once that transform was
 * applied, confirmed by removing it and watching them reappear). Not worth
 * the risk for a decorative drift effect.
 */
export default function DestinationDiptych({ left, right, caption }: DestinationDiptychProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 items-center">
      <ScrollReveal size="lift">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={left.url}
            alt={left.alt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </ScrollReveal>
      <div className="sm:mt-[14%]">
        <ScrollReveal delayMs={100} size="lift">
          <div className="relative aspect-[4/5] overflow-hidden mb-6">
            <Image
              src={right.url}
              alt={right.alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </ScrollReveal>
        <p className="font-sans font-light text-[13px] leading-[1.9] text-safari-bark/70 max-w-[360px]">
          {caption}
        </p>
      </div>
    </div>
  );
}
