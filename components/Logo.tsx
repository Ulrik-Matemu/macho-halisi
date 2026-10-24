import Image from "next/image";
import { SITE } from "@/lib/site";

// Intrinsic size of the supplied logo file. Update both when a higher-resolution original replaces it.
const LOGO_WIDTH = 1080;
const LOGO_HEIGHT = 607;

type LogoProps = {
  /** Height utilities, e.g. "h-14 lg:h-16". Width follows the file's aspect ratio. */
  className?: string;
  /** Rendered CSS width hint for next/image; keep close to the real size on screen. */
  sizes?: string;
  priority?: boolean;
  alt?: string;
};

/** The brand logo shown whole: no cropping, rounding or filters. */
export default function Logo({
  className = "h-14 lg:h-16",
  sizes = "(max-width: 1024px) 128px, 160px",
  priority = false,
  alt = "Macho Halisi Ltd — Safari and Tour Operator Tanzania",
}: LogoProps) {
  return (
    <Image
      src={SITE.logoPath}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      sizes={sizes}
      priority={priority}
      quality={90}
      className={`w-auto object-contain ${className}`}
    />
  );
}
