import { NextRequest, NextResponse } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Read-only proxy for the admin analytics reports. Only the named report
// endpoints are reachable — never /analytics/ingest, which is server-to-
// server with the shared secret (see app/api/track).
const ALLOWED = new Set(["overview", "timeseries", "breakdown", "realtime"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  if (path.length !== 1 || !ALLOWED.has(path[0])) {
    return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
  }
  return proxyJsonResponse(request, `/analytics/${path[0]}${request.nextUrl.search}`, { method: "GET" });
}
