import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Staff inbox list. The public submission endpoint stays at POST /api/enquiries.
export async function GET(request: NextRequest) {
  return proxyJsonResponse(request, `/enquiries${request.nextUrl.search}`, { method: "GET" });
}
