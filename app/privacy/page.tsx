import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import LegalPageShell from "@/components/public/legal/LegalPageShell";
import { PRIVACY_POLICY } from "@/data/legalData";
import { getSiteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Macho Halisi Safaris",
  description:
    "Macho Halisi Safaris privacy policy and data stewardship guidelines. How we safeguard guest information for park permits and domestic flights.",
  alternates: { canonical: `${getSiteUrl()}/privacy` },
};

export default function PrivacyPage() {
  return (
    <SiteChrome>
      <Breadcrumbs visible={false} items={[{ name: "Privacy policy", path: "/privacy" }]} />
      <SmoothScroll />
      <LegalPageShell document={PRIVACY_POLICY} />
    </SiteChrome>
  );
}
