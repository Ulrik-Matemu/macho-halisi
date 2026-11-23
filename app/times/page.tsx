import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SmoothScroll from "@/components/public/SmoothScroll";
import ScrollProgressBar from "@/components/public/ScrollProgressBar";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import TimesHero from "@/components/public/times/TimesHero";
import TimesMarquee from "@/components/public/times/TimesMarquee";
import TimesIntro from "@/components/public/times/TimesIntro";
import FilmReel from "@/components/public/times/FilmReel";
import PhotoJournal from "@/components/public/times/PhotoJournal";
import LongRoad from "@/components/public/times/LongRoad";
import TimesStay from "@/components/public/times/TimesStay";
import TimesClosing from "@/components/public/times/TimesClosing";
import { getSiteUrl, OG_DEFAULT_IMAGE } from "@/lib/site";

const TITLE = "Macho Halisi Times — Safari Films & Photography from Tanzania";
const DESCRIPTION =
  "Short films, photographs and field notes from Macho Halisi's journeys across the Serengeti, Ngorongoro, Tarangire, Lake Manyara, Kilimanjaro and Zanzibar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/times` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getSiteUrl()}/times`,
    siteName: "Macho Halisi",
    images: [OG_DEFAULT_IMAGE],
  },
};

export default function TimesPage() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <ScrollProgressBar />
      <Breadcrumbs visible={false} items={[{ name: "Macho Halisi Times", path: "/times" }]} />

      <TimesHero />
      <TimesMarquee />
      <TimesIntro />
      <FilmReel />
      <PhotoJournal />
      <LongRoad />
      <TimesStay />
      <TimesClosing />
    </SiteChrome>
  );
}
