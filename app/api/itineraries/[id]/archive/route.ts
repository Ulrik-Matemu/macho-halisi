import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";
import { ITINERARIES_TAG } from "@/lib/public/api";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await proxyJsonResponse(request, `/itineraries/${id}/archive`, {
    method: "PATCH",
  });

  // Archiving must pull an itinerary off the public site immediately.
  if (response.ok) {
    revalidateTag(ITINERARIES_TAG, "max");
  }

  return response;
}
