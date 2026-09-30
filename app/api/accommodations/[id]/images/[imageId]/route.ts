import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await context.params;
  return proxyJsonResponse(request, `/accommodations/${id}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await context.params;
  const body = await request.json();
  return proxyJsonResponse(request, `/accommodations/${id}/images/${imageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
