import { NextRequest, NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expressUrl = `${getExpressApiUrl()}/auth/login`;

    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
