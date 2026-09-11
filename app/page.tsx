import SiteChrome from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import FeaturedItineraries from "@/components/public/FeaturedItineraries";
import SmoothScroll from "@/components/public/SmoothScroll";

// Server component: SiteChrome (client) owns the Navbar/menu/modal
// interaction state, and receives this page's server-rendered content as
// children. FeaturedItineraries fetches published itineraries with an
// `await`, which requires a server component and could not run inside the
// old "use client" version of this file.
export default function Home() {
  return (
    <SiteChrome>
      <SmoothScroll />
      <Hero />
      <FeaturedItineraries />
    </SiteChrome>
  );
}
