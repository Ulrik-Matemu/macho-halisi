import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";
import { ITINERARIES_TAG } from "@/lib/public/api";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await proxyJsonResponse(request, `/itineraries/${id}/publish`, {
    method: "PATCH",
  });

  // Publishing must show up on the public site immediately, not after the
  // fetch cache's normal 5-minute revalidate window (see lib/public/api.ts).
  if (response.ok) {
    revalidateTag(ITINERARIES_TAG, "max");
  }

  return response;
}
