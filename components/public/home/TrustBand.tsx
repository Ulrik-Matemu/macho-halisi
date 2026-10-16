import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";
import { guestReviews, guideProfiles, safetyPoints, trustFacts, vehiclePhotos } from "@/data/trustData";

/**
 * "Why trust us" band under the featured itineraries. Facts and safety
 * points come from the client's About Us text; reviews, guide profiles,
 * vehicle photos and licences render only once data/trustData.ts and
 * SITE.licences are filled in — never placeholders on the public page.
 */
export default function TrustBand() {
  return (
    <section className="relative z-10 bg-safari-tan text-safari-bark pb-20 sm:pb-28">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 sm:py-16 border-t border-safari-bark/[0.12]">
          {trustFacts.map((f) => (
            <div key={f.label}>
              <dd className="font-serif-luxury font-light text-4xl sm:text-5xl text-safari-russet">{f.value}</dd>
              <dt className="font-sans font-light text-xs tracking-wide text-safari-bark/70 mt-2 max-w-[22ch]">{f.label}</dt>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="flex items-center gap-2 font-sans font-light text-[11px] tracking-[0.34em] text-safari-russet uppercase mb-4">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Travel with confidence
            </div>
            <ul className="space-y-3 font-sans font-light text-sm sm:text-base text-safari-bark/80 leading-relaxed">
              {safetyPoints.map((p) => (
                <li key={p} className="border-l-2 border-safari-ochre/60 pl-4">{p}</li>
              ))}
            </ul>
            {SITE.licences.length > 0 && (
              <p className="mt-6 font-sans text-xs text-safari-bark/65">Licensed &amp; registered: {SITE.licences.join(" · ")}</p>
            )}
          </div>

          <div className="bg-white/70 border border-safari-bark/10 p-6 sm:p-8 self-start">
            <h2 className="font-serif-luxury text-2xl text-safari-bark mb-2">Talk to a real person</h2>
            <p className="font-sans font-light text-sm text-safari-bark/70 leading-relaxed mb-5">
              Our team in Karatu replies {SITE.replyPromise}. Call {SITE.phone}, email {SITE.email} or message us on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/enquire" className="px-6 py-3 text-center bg-safari-ochre hover:bg-safari-russet text-safari-night font-serif-luxury text-xs tracking-[0.2em] uppercase rounded transition-colors">
                ENQUIRE
              </Link>
              <a href={whatsappUrl("Hello Macho Halisi, I'm interested in a safari.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-safari-bark/30 hover:border-safari-russet text-safari-bark font-serif-luxury text-xs tracking-[0.2em] uppercase rounded transition-colors">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {guestReviews.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {guestReviews.map((r) => (
              <figure key={r.name + r.quote} className="bg-white/70 border border-safari-bark/10 p-6">
                <blockquote className="font-serif-luxury text-lg text-safari-bark leading-snug">“{r.quote}”</blockquote>
                <figcaption className="mt-4 font-sans text-xs text-safari-bark/65">{r.name} · {r.origin}</figcaption>
              </figure>
            ))}
          </div>
        )}

        {guideProfiles.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {guideProfiles.map((g) => (
              <div key={g.name}>
                <div className="relative aspect-[3/4] mb-3 overflow-hidden">
                  <Image src={g.photo.url} alt={g.photo.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                </div>
                <div className="font-serif-luxury text-lg">{g.name}</div>
                <div className="font-sans text-xs text-safari-bark/65">{g.role}</div>
              </div>
            ))}
          </div>
        )}

        {vehiclePhotos.length > 0 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vehiclePhotos.map((v) => (
              <div key={v.url} className="relative aspect-[4/3] overflow-hidden">
                <Image src={v.url} alt={v.alt} fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
