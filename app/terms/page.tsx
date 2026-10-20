import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import LegalPageShell from "@/components/public/legal/LegalPageShell";
import { TERMS_AND_CONDITIONS } from "@/data/legalData";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions | Macho Halisi Safaris",
  description:
    "Official booking conditions, payment schedules and cancellation tiers.",
  alternates: { canonical: `${getSiteUrl()}/terms` },
};

export default function TermsPage() {
  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Terms & booking conditions", path: "/terms" }]} />
      <SmoothScroll />
      <LegalPageShell document={TERMS_AND_CONDITIONS} />
    </SiteChrome>
  );
}
