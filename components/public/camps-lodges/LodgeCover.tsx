import Image from "next/image";
import type { CampLodge } from "@/data/campsLodges";

interface LodgeCoverProps {
  lodge: CampLodge;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Which bottom corner the "Area photo" tag sits in (the hero keeps its title on the left). */
  tagSide?: "left" | "right";
}

/**
 * A lodge's cover: its own first photo when one has been sourced, otherwise
 * an area photo of the region it serves, tagged "Area photo" so it can't be
 * mistaken for the property. There is always an image to show.
 */
export default function LodgeCover({ lodge, sizes, priority = false, className = "", tagSide = "left" }: LodgeCoverProps) {
  const own = lodge.images[0];
  const area = lodge.areaCover;
  const cover = own ?? (area ? { url: area.url, alt: area.alt } : undefined);

  if (!cover) {
    return <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#2a1c10] via-[#1e1209] to-[#3b2a17]" />;
  }

  return (
    <>
      <Image
        src={cover.url}
        alt={cover.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover object-center ${className}`}
      />
      {!own && area && (
        <span className={`absolute bottom-3 ${tagSide === "left" ? "left-3" : "right-3"} z-10 px-2 py-1 rounded text-[9px] font-sans tracking-[0.18em] uppercase bg-black/60 backdrop-blur-md text-safari-cream/90`}>
          Area photo · {area.place}
        </span>
      )}
    </>
  );
}
