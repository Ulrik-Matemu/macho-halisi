import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function GET(request: NextRequest) {
  return proxyJsonResponse(request, "/enquiries/stats", { method: "GET" });
}
