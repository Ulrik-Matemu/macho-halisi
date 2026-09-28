import ExperienceHero from "@/components/public/experiences/ExperienceHero";

interface DestinationHeroProps {
  image: string;
  imageAlt: string;
  categoryLabel: string;
  region: string;
  name: string;
  tagline: string;
  /** e.g. "01 / 27" */
  counter: string;
}

/**
 * Splits a destination name into the hero's upright + italic lines:
 * "Serengeti National Park" → "Serengeti" / "National Park",
 * "Lake Natron & Ol Doinyo Lengai" → "Lake Natron" / "& Ol Doinyo Lengai",
 * "Pemba Island" → "Pemba" / "Island". Single words stay on one line.
 */
function splitName(name: string): [string, string | undefined] {
  const suffix = " National Park";
  if (name.endsWith(suffix) && name.length > suffix.length) {
    return [name.slice(0, -suffix.length), suffix.trim()];
  }
  const amp = name.indexOf(" & ");
  if (amp > 0) return [name.slice(0, amp), name.slice(amp + 1)];
  const space = name.lastIndexOf(" ");
  if (space > 0) return [name.slice(0, space), name.slice(space + 1)];
  return [name, undefined];
}

/** Destination pages reuse the experience page's scroll-opening hero. */
export default function DestinationHero({
  image,
  imageAlt,
  categoryLabel,
  region,
  name,
  tagline,
  counter,
}: DestinationHeroProps) {
  const [line1, line2] = splitName(name);
  return (
    <ExperienceHero
      image={image}
      imageAlt={imageAlt}
      badge={`${categoryLabel} · ${region}`}
      line1={line1}
      line2={line2}
      tagline={tagline}
      counter={counter}
      label="Destinations"
    />
  );
}
