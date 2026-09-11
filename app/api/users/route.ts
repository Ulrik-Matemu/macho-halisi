import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyJsonResponse(request, `/users${search}`, {
    method: "GET",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyJsonResponse(request, "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
