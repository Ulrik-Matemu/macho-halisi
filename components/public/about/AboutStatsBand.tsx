import { aboutStats } from "@/data/aboutData";

/**
 * Compact stats band summarising the operation's scale. Dark panel to
 * punctuate the cream editorial flow. Flat corners per the site convention.
 */
export default function AboutStatsBand() {
  return (
    <div className="bg-safari-bark text-safari-cream border border-safari-russet/40 px-6 sm:px-10 py-10 sm:py-12">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 text-center">
        {aboutStats.map((stat) => (
          <div key={stat.label} className="space-y-1.5">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-serif-luxury text-4xl sm:text-5xl font-light text-safari-sand">{stat.value}</dd>
            <p className="text-[11px] sm:text-xs font-sans font-light tracking-wide text-white/60 leading-relaxed max-w-[16ch] mx-auto">
              {stat.label}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
}
