import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function GET(request: NextRequest) {
  return proxyJsonResponse(request, "/destinations", {
    method: "GET",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyJsonResponse(request, "/destinations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
