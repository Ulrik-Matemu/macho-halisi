import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await context.params;
  return proxyJsonResponse(request, `/itineraries/${id}/images/${imageId}`, {
    method: "DELETE",
  });
}
