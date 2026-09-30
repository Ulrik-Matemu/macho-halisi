import { NextRequest, NextResponse } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Read-only proxy for the admin monitoring reports. POST /monitoring/uptime
// is written by the GitHub Actions cron directly against the backend and
// is deliberately not reachable through here.
const ALLOWED = new Set(["uptime", "performance", "web-vitals", "errors", "system"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  if (path.length !== 1 || !ALLOWED.has(path[0])) {
    return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
  }
  return proxyJsonResponse(request, `/monitoring/${path[0]}${request.nextUrl.search}`, { method: "GET" });
}
