import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyJsonResponse(request, `/users/${id}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
