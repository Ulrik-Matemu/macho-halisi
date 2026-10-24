import ScrollReveal from "@/components/public/ScrollReveal";
import type { ExperienceLongform, ExperienceLongformSection } from "@/data/experienceContent";

function Paragraphs({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <>
      {items.map((text, i) => (
        <p
          key={i}
          className={`m-0 mb-6 last:mb-0 font-sans font-light text-[16px] sm:text-[17px] leading-[1.95] text-pretty ${className}`}
        >
          {text}
        </p>
      ))}
    </>
  );
}

function Section({ section, index }: { section: ExperienceLongformSection; index: number }) {
  return (
    <ScrollReveal>
      <article className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-16 py-12 sm:py-16 border-t border-safari-bark/20">
        <div>
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-4">
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="m-0 font-serif-luxury font-light text-[clamp(24px,2.6vw,34px)] leading-[1.2] tracking-[0.02em] text-safari-bark">
            {section.heading}
          </h3>
        </div>
        <div className="text-safari-bark/85">
          <Paragraphs items={section.paragraphs.slice(0, section.itemsAfter ?? section.paragraphs.length)} />
          {section.items && (
            <ul className="list-none m-0 my-8 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {section.items.map((item) => (
                <li key={item.label} className="border-l border-safari-russet/50 pl-5">
                  <div className="font-serif-luxury text-[19px] tracking-[0.03em] text-safari-bark mb-1.5">
                    {item.label}
                  </div>
                  <p className="m-0 font-sans font-light text-[15px] leading-[1.8] text-safari-bark/80">{item.text}</p>
                </li>
              ))}
            </ul>
          )}
          {section.itemsAfter !== undefined && (
            <Paragraphs items={section.paragraphs.slice(section.itemsAfter)} />
          )}
        </div>
      </article>
    </ScrollReveal>
  );
}

/** Client-supplied introduction and "The Experience" sections. */
export function ExperienceLongformBody({ longform }: { longform: ExperienceLongform }) {
  return (
    <section className="max-w-[1160px] mx-auto px-6 sm:px-16 pt-20 sm:pt-28">
      <ScrollReveal>
        <h2 className="m-0 mb-8 font-serif-luxury font-light text-[clamp(30px,3.6vw,48px)] leading-[1.14] tracking-[0.02em] text-safari-bark max-w-[820px]">
          {longform.intro.heading}
        </h2>
        <div className="max-w-[820px] text-safari-bark/85 mb-14 sm:mb-20">
          <Paragraphs items={longform.intro.paragraphs} />
        </div>
      </ScrollReveal>
      {longform.sections.map((section, i) => (
        <Section key={section.heading} section={section} index={i} />
      ))}
    </section>
  );
}

/** "The Macho Halisi Advantage" callout, set apart on the dark palette colour. */
export function ExperienceAdvantage({ section }: { section: ExperienceLongformSection }) {
  const [label, ...rest] = section.heading.split(": ");
  const title = rest.join(": ");
  return (
    <section className="mt-24 sm:mt-32 bg-safari-russet text-safari-cream">
      <div className="max-w-[1160px] mx-auto px-6 sm:px-16 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
        <ScrollReveal>
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-champagne uppercase mb-5">
            {label}
          </div>
          <h2 className="m-0 font-serif-luxury font-light text-[clamp(28px,3.2vw,42px)] leading-[1.18] tracking-[0.02em] text-safari-cream">
            {title || section.heading}
          </h2>
        </ScrollReveal>
        <ScrollReveal delayMs={80}>
          <Paragraphs items={section.paragraphs} className="text-safari-cream/95" />
        </ScrollReveal>
      </div>
    </section>
  );
}
