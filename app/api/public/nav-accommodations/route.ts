import { NextResponse } from "next/server";
import { getPublishedAccommodations } from "@/lib/public/api";

// Feeds the fullscreen nav menu's CAMPS & LODGES column. The menu is a client
// component mounted on every page, so it can't call the server-only public
// fetcher directly; this hands it a trimmed list. getPublishedAccommodations
// is already cached (5 min, ACCOMMODATIONS_TAG), so opening the menu doesn't
// hit the backend each time.
export async function GET() {
  const { data, degraded } = await getPublishedAccommodations({ limit: 50 });

  return NextResponse.json(
    {
      degraded: !!degraded,
      accommodations: data.map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        locationText: a.locationText,
        image: a.heroImage?.url ?? a.images[0]?.url ?? null,
      })),
    },
    // Don't let the browser/CDN pin a degraded (backend-down) empty list.
    { headers: { "Cache-Control": degraded ? "no-store" : "public, max-age=60" } }
  );
}
