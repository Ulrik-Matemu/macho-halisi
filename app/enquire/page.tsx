import type { Metadata } from "next";
import { MessageSquare, Sparkles, Compass } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollReveal from "@/components/public/ScrollReveal";
import EnquiryStudioForm from "@/components/public/enquiry/EnquiryStudioForm";
import EnquiryConciergePanel from "@/components/public/enquiry/EnquiryConciergePanel";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Begin Your Safari Expedition | Macho Halisi Safari Enquiry",
  description:
    "Design your custom tailor-made Tanzanian safari with native master naturalists. Private 4x4 vehicles, luxury canvas tented camps, and bespoke wilderness itineraries.",
  alternates: { canonical: `${getSiteUrl()}/enquire` },
  openGraph: {
    title: "Begin Your Safari Expedition | Macho Halisi",
    description:
      "Connect directly with our master naturalist planning directors in Karatu, Tanzania.",
    url: `${getSiteUrl()}/enquire`,
    siteName: "Macho Halisi",
  },
};

interface EnquiryPageProps {
  searchParams: Promise<{
    destination?: string;
    itinerary?: string;
  }>;
}

export default async function EnquiryPage({ searchParams }: EnquiryPageProps) {
  const resolvedParams = await searchParams;
  const initialDestination = resolvedParams?.destination;
  const initialItinerary = resolvedParams?.itinerary;

  return (
    <SiteChrome>
      <SmoothScroll />
      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <ScrollReveal className="mb-12 pb-8 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>Tailor-Made Safari Studio</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-[#1E1913] tracking-[0.02em] leading-tight">
              Begin Your Journey
            </h1>
            <p className="font-sans font-light text-sm sm:text-base text-[#1E1913]/70 mt-3 max-w-2xl leading-relaxed">
              Share your wilderness aspirations. Our native safari directors will draft a bespoke
              day-by-day blueprint calibrated to the real movements of Tanzania&apos;s wildlife.
            </p>
          </ScrollReveal>

          {/* Two-Column Consultation Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Reassurance & Specialist Profile */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <ScrollReveal size="lift">
                <EnquiryConciergePanel />
              </ScrollReveal>
            </div>

            {/* Right: Multi-Step Interactive Journey Builder */}
            <div className="lg:col-span-8">
              <ScrollReveal delayMs={100} size="lift">
                <EnquiryStudioForm
                  initialDestination={initialDestination}
                  initialItineraryTitle={initialItinerary}
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
