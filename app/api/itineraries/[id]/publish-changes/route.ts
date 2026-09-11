import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";
import { ITINERARIES_TAG } from "@/lib/public/api";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await proxyJsonResponse(request, `/itineraries/${id}/publish-changes`, {
    method: "PATCH",
  });

  // This is the actual "go live" moment for an edit to an already-published
  // itinerary, so it must show up immediately — same reasoning as /publish.
  if (response.ok) {
    revalidateTag(ITINERARIES_TAG, "max");
  }

  return response;
}
