import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Every enquiry matching the inbox filters (or an id list), for PDF/XLSX exports.
export async function GET(request: NextRequest) {
  return proxyJsonResponse(request, `/enquiries/export${request.nextUrl.search}`, { method: "GET" });
}
