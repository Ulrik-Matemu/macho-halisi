import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyJsonResponse(request, `/users/${id}/deactivate`, {
    method: "POST",
  });
}
