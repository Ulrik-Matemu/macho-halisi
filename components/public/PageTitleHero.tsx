import Image from "next/image";

/**
 * Full-bleed hero band carrying only the page title over a photo — the
 * same treatment as the About page hero, for simple text pages.
 */
export default function PageTitleHero({
  title,
  image,
}: {
  title: string;
  image: { url: string; alt: string };
}) {
  return (
    <section data-navbar-hero className="relative h-[70vh] min-h-[460px] w-full bg-black">
      <Image src={image.url} alt={image.alt} fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.12em] leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
