import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import LegalPageShell from "@/components/public/legal/LegalPageShell";
import { TERMS_AND_CONDITIONS } from "@/data/legalData";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions | Macho Halisi Safaris",
  description:
    "Official booking conditions, payment schedules, cancellation tiers, and AMREF Flying Doctors coverage terms for Macho Halisi Safaris (TALA Licensed).",
  alternates: { canonical: `${getSiteUrl()}/terms` },
};

export default function TermsPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <LegalPageShell document={TERMS_AND_CONDITIONS} />
    </SiteChrome>
  );
}
