"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEnquiry } from "@/components/EnquiryProvider";
import ScrollReveal from "@/components/public/ScrollReveal";

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * One column of the footer's link grid (Itineraries / Destinations /
 * Travel with us / Studio) — a link either navigates (`href`, the common
 * case) or opens the shared enquiry modal (`onClick`, for "Enquire" and
 * "Contact", which have no page of their own to go to).
 */
function FooterLinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/66 uppercase mb-6">
        {title}
      </div>
      <div className="flex flex-col gap-3.5 font-sans font-light text-[14.5px]">
        {links.map((link) =>
          link.onClick ? (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="text-left text-[#FBF7F0]/82 hover:text-[#C9A46A] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.label}
              href={link.href ?? "#"}
              className="text-[#FBF7F0]/82 hover:text-[#C9A46A] transition-colors"
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

type SubscribeState = "idle" | "submitting" | "done";

/**
 * Site-wide footer — mounted once, in SiteChrome, so it appears at the
 * bottom of every public page (home, itinerary listing, itinerary detail).
 * Client component: it needs the shared enquiry modal (useEnquiry) and the
 * newsletter form's own local state.
 *
 * The "Itineraries"/"Destinations" columns below link to /itineraries
 * rather than dedicated pages per journey or park — those don't exist yet
 * (there's no routing for a single destination, and itinerary slugs are
 * data-driven, not the curated marketing names design used here). Several
 * other links (How we plan, When to travel, Our story, Journal,
 * Conservation, Privacy, Terms) have no page to point to yet either and
 * are left as inert "#" placeholders — wire them up once those pages
 * exist rather than guess at routes that would 404.
 */
export default function Footer() {
  const { openEnquiry } = useEnquiry();
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<SubscribeState>("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeState !== "idle") return;
    // No mailing-list provider is wired up yet — this just gives the
    // visitor confirmation. Swap in a real subscribe call (Mailchimp,
    // Klaviyo, a custom endpoint, whatever gets chosen) when one exists.
    setSubscribeState("submitting");
    setTimeout(() => setSubscribeState("done"), 500);
  };

  return (
    <>
      {/* Closing CTA — reveals in a slow, deliberate cascade as it scrolls
          into view: eyebrow, then the headline, then the supporting line,
          then the two actions, each settling a beat after the last. */}
      <section className="bg-[#F6F2EA] text-[#1E1913] px-6 sm:px-16 pt-28 sm:pt-32 pb-28 sm:pb-32 text-center">
        <div className="max-w-[1240px] mx-auto">
          <ScrollReveal size="lift">
            <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-6">
              Not sure where to begin?
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={120}>
            <h2 className="font-serif-luxury font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.16] tracking-[0.08em] text-[#1E1913] max-w-3xl mx-auto mb-8 text-balance">
              Tell us how you like to travel. We will draw the route around you.
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={240} size="lift">
            <p className="font-sans font-light text-[15px] leading-[2] text-[#1E1913]/66 max-w-lg mx-auto mb-10">
              Every Macho Halisi journey is built by hand, privately guided, and quietly obsessive
              about the details.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={360} size="lift">
            <div className="flex justify-center items-center gap-7 flex-wrap">
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="font-sans font-light text-[11px] tracking-[0.3em] text-[#F6F2EA] bg-[#1E1913] hover:bg-[#8A6A33] uppercase px-10 py-[18px] rounded-sm transition-colors cursor-pointer"
              >
                Start planning
              </button>
              <Link
                href="/itineraries"
                className="font-sans font-light text-[11px] tracking-[0.3em] text-[#1E1913] hover:text-[#8A6A33] uppercase py-[18px] transition-colors"
              >
                Browse itineraries →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="bg-[#181410] text-[#F6F2EA]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-20 sm:pt-24 lg:pt-[104px]">
          {/* Brand + newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-14 lg:gap-24 items-start pb-16 sm:pb-20">
            <ScrollReveal>
              <Link href="/" className="inline-block mb-8 transition-opacity hover:opacity-80">
                <div className="relative h-16 sm:h-20 aspect-[180/94] rounded overflow-hidden border border-[#FBF7F0]/20 shadow-md">
                  <Image
                    src="/media/macho-halisi-logo-2.jpg"
                    alt="Macho Halisi"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </Link>
              <p className="font-sans font-light text-[15px] leading-[2] text-[#FBF7F0]/66 max-w-md mb-10">
                Private, native-guided safaris across Tanzania — the Serengeti and the Crater,
                Kilimanjaro, the wild south and the Zanzibar coast.
              </p>
              <div className="flex gap-14 flex-wrap">
                <div>
                  <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/66 uppercase mb-3">
                    Speak to us
                  </div>
                  <a
                    href="tel:+255700000000"
                    className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#FBF7F0] hover:text-[#C9A46A] transition-colors"
                  >
                    +255 700 000 000
                  </a>
                </div>
                <div>
                  <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/66 uppercase mb-3">
                    Write to us
                  </div>
                  <a
                    href="mailto:hello@machohalisi.com"
                    className="font-serif-luxury font-light text-xl tracking-[0.06em] text-[#FBF7F0] hover:text-[#C9A46A] transition-colors"
                  >
                    hello@machohalisi.com
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={140}>
              <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#C9A46A] uppercase mb-4">
                The quiet letter
              </div>
              <p className="font-sans font-light text-sm leading-[1.95] text-[#FBF7F0]/62 mb-6">
                Four notes a year — where the herds are, which camps are worth the detour, and
                nothing else.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-4 border-b border-[#FBF7F0]/[0.28] pb-3.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  disabled={subscribeState !== "idle"}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-light text-[15px] text-[#FBF7F0] placeholder-[#FBF7F0]/40 py-1 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subscribeState !== "idle"}
                  className="font-sans font-light text-[10.5px] tracking-[0.3em] text-[#C9A46A] hover:text-[#FBF7F0] uppercase whitespace-nowrap transition-colors cursor-pointer disabled:opacity-60"
                >
                  {subscribeState === "done"
                    ? "Subscribed"
                    : subscribeState === "submitting"
                    ? "Sending…"
                    : "Subscribe →"}
                </button>
              </form>
            </ScrollReveal>
          </div>

          {/* Link columns — a left-to-right wave, each ~70ms after the last */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-12 sm:gap-14 py-16 sm:py-[66px] border-t border-[#FBF7F0]/[0.14]">
            <ScrollReveal delayMs={0} size="lift">
              <FooterLinkColumn
                title="Itineraries"
                links={[
                  { label: "The Great Migration", href: "/itineraries" },
                  { label: "Roof of Africa", href: "/itineraries" },
                  { label: "The Southern Circuit", href: "/itineraries" },
                  { label: "Spice Coast & Sands", href: "/itineraries" },
                  { label: "All journeys →", href: "/itineraries" },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delayMs={70} size="lift">
              <FooterLinkColumn
                title="Destinations"
                links={[
                  { label: "Serengeti", href: "/itineraries" },
                  { label: "Ngorongoro Crater", href: "/itineraries" },
                  { label: "Kilimanjaro", href: "/itineraries" },
                  { label: "Ruaha & Nyerere", href: "/itineraries" },
                  { label: "Zanzibar", href: "/itineraries" },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delayMs={140} size="lift">
              <FooterLinkColumn
                title="Travel with us"
                links={[
                  { label: "How we plan", href: "#" },
                  { label: "When to travel", href: "#" },
                  { label: "Accommodation", href: "#" },
                  { label: "Travel information", href: "#" },
                  { label: "Enquire", onClick: () => openEnquiry() },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delayMs={210} size="lift">
              <FooterLinkColumn
                title="Studio"
                links={[
                  { label: "Our story", href: "#" },
                  { label: "The guides", href: "#" },
                  { label: "Conservation", href: "#" },
                  { label: "Journal", href: "#" },
                  { label: "Contact", onClick: () => openEnquiry() },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delayMs={280} size="lift">
              <div className="font-sans font-light text-[10px] tracking-[0.3em] text-[#FBF7F0]/66 uppercase mb-6">
                Office
              </div>
              <div className="font-sans font-light text-sm leading-[1.95] text-[#FBF7F0]/72">
                Karatu
                <br />
                Arusha, Tanzania
                <br />
                <br />
                Mon – Sat · 08:00 – 18:00 EAT
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom bar — the last thing to settle, a beat after the columns above it */}
          <ScrollReveal delayMs={120} size="lift">
            <div className="flex items-center justify-between gap-9 flex-wrap py-8 sm:py-[42px] border-t border-[#FBF7F0]/[0.14]">
              <div className="flex gap-7 flex-wrap font-sans font-light text-[10.5px] tracking-[0.22em] uppercase">
                <span className="text-[#FBF7F0]/55">© {new Date().getFullYear()} Macho Halisi Safaris</span>
                <a href="#" className="text-[#FBF7F0]/55 hover:text-[#C9A46A] transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-[#FBF7F0]/55 hover:text-[#C9A46A] transition-colors">
                  Terms
                </a>
                <span className="text-[#FBF7F0]/55">TALA licensed</span>
              </div>
              <div className="flex items-center gap-7 font-sans font-light text-[10.5px] tracking-[0.26em] uppercase">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FBF7F0]/70 hover:text-[#C9A46A] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FBF7F0]/70 hover:text-[#C9A46A] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FBF7F0]/70 hover:text-[#C9A46A] transition-colors"
                >
                  YouTube
                </a>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 text-[#C9A46A] hover:text-[#FBF7F0] transition-colors cursor-pointer"
                >
                  Top ↑
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </>
  );
}
