const PLACES = [
  "Serengeti",
  "Ngorongoro",
  "Tarangire",
  "Lake Manyara",
  "Lake Eyasi",
  "Kilimanjaro",
  "Ruaha",
  "Nyerere",
  "Zanzibar",
  "Karatu",
];

/**
 * A slow, endless ticker of the places we guide — pure CSS (two identical
 * halves, the track slides by exactly one half) and paused on hover.
 */
export default function TimesMarquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {PLACES.map((place) => (
        <li key={place} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-[0.3em] uppercase text-safari-cream/85">{place}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-safari-gold" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="times-marquee border-y border-safari-cream/15 bg-safari-bark py-6 sm:py-8 overflow-hidden" role="presentation">
      <div className="flex w-max animate-times-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
