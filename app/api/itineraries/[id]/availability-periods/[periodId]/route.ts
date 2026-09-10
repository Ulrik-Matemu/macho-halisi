import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; periodId: string }> }
) {
  const { id, periodId } = await context.params;
  const body = await request.json();
  return proxyJsonResponse(request, `/itineraries/${id}/availability-periods/${periodId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; periodId: string }> }
) {
  const { id, periodId } = await context.params;
  return proxyJsonResponse(request, `/itineraries/${id}/availability-periods/${periodId}`, {
    method: "DELETE",
  });
}
