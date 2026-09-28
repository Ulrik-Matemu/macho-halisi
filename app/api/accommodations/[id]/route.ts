import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";
import { ACCOMMODATIONS_TAG } from "@/lib/public/api";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyJsonResponse(request, `/accommodations/${id}`, {
    method: "GET",
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyJsonResponse(request, `/accommodations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await proxyJsonResponse(request, `/accommodations/${id}`, {
    method: "DELETE",
  });

  // A deleted PUBLISHED accommodation must disappear from the public site
  // immediately rather than lingering until the next revalidate window.
  if (response.ok) {
    revalidateTag(ACCOMMODATIONS_TAG, "max");
  }

  return response;
}
