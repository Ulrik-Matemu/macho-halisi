import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Bulk delete / status change for selected inbox rows.
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyJsonResponse(request, "/enquiries/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
