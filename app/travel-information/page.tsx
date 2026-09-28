import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  FileCheck,
  HeartPulse,
  Coins,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import TravelInfoStickyNav from "@/components/public/travel-info/TravelInfoStickyNav";
import PackingChecklist from "@/components/public/travel-info/PackingChecklist";
import LuggageVisualizer from "@/components/public/travel-info/LuggageVisualizer";
import TravelFaqAccordion from "@/components/public/travel-info/TravelFaqAccordion";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tanzania Safari Travel Information & Field Guide | Macho Halisi",
  description:
    "Essential pre-departure travel guide for Tanzania — visas, vaccinations, currency rules (USD series 2009+), bush flight luggage limits, and interactive packing checklist.",
  alternates: { canonical: `${getSiteUrl()}/travel-information` },
  openGraph: {
    title: "Tanzania Travel Information & Field Guide | Macho Halisi",
    description:
      "Expert preparation advice from native Tanzanian safari naturalists.",
    url: `${getSiteUrl()}/travel-information`,
    siteName: "Macho Halisi",
  },
};

export default function TravelInformationPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <ScrollReveal className="mb-10 sm:mb-12 pb-8 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
              <Compass className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>The Macho Halisi Field Guide</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-[#1E1913] tracking-[0.02em] leading-tight">
              Essential Travel Knowledge
            </h1>
            <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/70 mt-4 max-w-3xl leading-relaxed">
              Preparation without anxiety. We have assembled the essential logistical knowledge required
              to ensure your journey to and across Tanzania is effortless, safe, and deeply rewarding.
            </p>
          </ScrollReveal>

          {/* Sticky Navigation Sub-Header */}
          <TravelInfoStickyNav />

          {/* SECTION 1: VISAS & ENTRY */}
          <ScrollReveal delayMs={50} size="lift">
            <section id="visas" className="py-12 sm:py-16 border-b border-[#1E1913]/10 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
                <FileCheck className="w-3.5 h-3.5 text-[#C9A46A]" />
                <span>Entry Protocols</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#1E1913] font-light mb-6">
                Visas, Passports & Arrival Airports
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-3">
                  <div className="font-mono text-xs text-[#8A6A33] uppercase tracking-wider">
                    Tourist Visa Application
                  </div>
                  <div className="font-serif-luxury text-xl text-[#1E1913]">eVisa or On Arrival</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    Apply online 3–4 weeks prior via the official immigration portal (immigration.go.tz)
                    or obtain upon landing. Cost is $50 USD for most nationalities ($100 USD for US citizens).
                  </p>
                </div>

                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-3">
                  <div className="font-mono text-xs text-[#8A6A33] uppercase tracking-wider">
                    Passport Validity
                  </div>
                  <div className="font-serif-luxury text-xl text-[#1E1913]">6 Months & 3 Blank Pages</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    Your passport must be valid for at least six months from your exit date from Tanzania,
                    with at least three full blank unstamped visa pages.
                  </p>
                </div>

                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-3">
                  <div className="font-mono text-xs text-[#8A6A33] uppercase tracking-wider">
                    Main Ports of Entry
                  </div>
                  <div className="font-serif-luxury text-xl text-[#1E1913]">JRO · DAR · ZNZ</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    For Northern safaris, fly directly into Kilimanjaro International Airport (JRO). Macho
                    Halisi private concierges greet you on the tarmac.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* SECTION 2: HEALTH & VACCINES */}
          <ScrollReveal delayMs={100} size="lift">
            <section id="health" className="py-12 sm:py-16 border-b border-[#1E1913]/10 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
                <HeartPulse className="w-3.5 h-3.5 text-[#C9A46A]" />
                <span>Wellness & Security</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#1E1913] font-light mb-6">
                Health, Vaccinations & AMREF Air Evacuation
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="p-6 sm:p-8 bg-white/70 border border-[#1E1913]/10 space-y-4">
                  <div className="font-serif-luxury text-xl text-[#1E1913]">
                    Vaccination & Malaria Advice
                  </div>
                  <p className="text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    A Yellow Fever vaccination card is required ONLY if arriving from or transiting &gt;12h
                    through an endemic nation (e.g. Kenya, Ethiopia). If flying straight from Europe, North
                    America, or the Gulf, it is not required.
                  </p>
                  <p className="text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    Malaria prophylaxis (Malarone or Doxycycline) is advised. All our private camps provide
                    screened canvas, insect repellent, and fresh bottled/purified water.
                  </p>
                </div>

                <div className="p-6 sm:p-8 bg-[#1E1913] text-[#FBF7F0] border border-[#8A6A33]/40 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-serif-luxury text-xl text-white">AMREF Flying Doctors Coverage</div>
                    <span className="px-2.5 py-1 bg-[#8A6A33]/30 text-[#E3C99A] text-[10px] font-mono uppercase tracking-widest rounded">
                      Included
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
                    Every Macho Halisi guest is automatically enrolled in AMREF Flying Doctors emergency
                    airlift evacuation coverage. In the rare event of severe medical distress, dedicated
                    air ambulance aircraft will airlift you directly from bush airstrips to modern tertiary care.
                  </p>
                  <div className="text-xs text-[#E3C99A] font-mono pt-2 border-t border-white/10">
                    Comprehensive personal travel insurance covering medical repatriation is required.
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* SECTION 3: INTERACTIVE PACKING CHECKLIST */}
          <ScrollReveal delayMs={100} size="lift">
            <PackingChecklist />
          </ScrollReveal>

          {/* SECTION 4: BUSH LUGGAGE SPECS */}
          <ScrollReveal delayMs={100} size="lift">
            <LuggageVisualizer />
          </ScrollReveal>

          {/* SECTION 5: CURRENCY & TIPPING */}
          <ScrollReveal delayMs={100} size="lift">
            <section id="currency" className="py-12 sm:py-16 border-b border-[#1E1913]/10 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
                <Coins className="w-3.5 h-3.5 text-[#C9A46A]" />
                <span>Financial Etiquette</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#1E1913] font-light mb-6">
                Currency, USD 2009+ Rule & Tipping Standards
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 sm:p-8 bg-amber-50/70 border border-amber-200/80 space-y-3">
                  <div className="font-serif-luxury text-xl text-amber-950 font-normal">
                    The Strict 2009 USD Series Directive
                  </div>
                  <p className="text-sm text-amber-950/80 leading-relaxed font-sans font-light">
                    Tanzanian banks, national park gates, and camps categorically reject any US dollar banknotes
                    printed prior to 2009 due to historical counterfeiting. Inspect your bills before traveling
                    to ensure they are series 2009 or later, crisp, un-torn, and without ink markings.
                  </p>
                </div>

                <div className="p-6 sm:p-8 bg-white/70 border border-[#1E1913]/10 space-y-3">
                  <div className="font-serif-luxury text-xl text-[#1E1913] font-normal">
                    Customary Tipping Benchmarks
                  </div>
                  <p className="text-sm text-[#1E1913]/75 leading-relaxed font-sans font-light">
                    Tipping is voluntary and reflects appreciation for extraordinary service:
                  </p>
                  <ul className="text-xs sm:text-sm text-[#1E1913]/80 space-y-1.5 font-sans">
                    <li>• Dedicated Private Naturalist Guide: $20 to $30 USD per day total from party</li>
                    <li>• Luxury Camp Staff: $15 to $20 USD per guest/night into communal tip box</li>
                    <li>• Walking Safari Armed Ranger: $10 to $15 USD per walk</li>
                  </ul>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* SECTION 6: BUSH ETIQUETTE & DRONES */}
          <ScrollReveal delayMs={100} size="lift">
            <section id="etiquette" className="py-12 sm:py-16 border-b border-[#1E1913]/10 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#C9A46A]" />
                <span>Conservation & Respect</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#1E1913] font-light mb-6">
                Bush Etiquette & National Park Regulations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-2">
                  <div className="font-serif-luxury text-lg text-[#1E1913]">Zero Recreational Drones</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/70 leading-relaxed font-sans">
                    Drones are strictly prohibited in all national parks to avoid disturbing wildlife and
                    endangering anti-poaching security. Unauthorized drones face confiscation and arrest.
                  </p>
                </div>

                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-2">
                  <div className="font-serif-luxury text-lg text-[#1E1913]">Quiet Wildlife Presence</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/70 leading-relaxed font-sans">
                    Animals view our vehicle as a single benign entity. Sudden movements, standing on seats,
                    or loud shouts startle them. Whispering at sightings reveals magical natural behavior.
                  </p>
                </div>

                <div className="p-6 bg-white/70 border border-[#1E1913]/10 space-y-2">
                  <div className="font-serif-luxury text-lg text-[#1E1913]">Cultural Photography</div>
                  <p className="text-xs sm:text-sm text-[#1E1913]/70 leading-relaxed font-sans">
                    Always ask permission through your naturalist before photographing local Maasai warriors,
                    elders, or market vendors. Respect and reciprocity come first.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* SECTION 7: SEARCHABLE FAQS */}
          <ScrollReveal delayMs={100} size="lift">
            <TravelFaqAccordion />
          </ScrollReveal>
        </div>
      </div>
    </SiteChrome>
  );
}
