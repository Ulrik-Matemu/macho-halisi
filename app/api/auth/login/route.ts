import { NextRequest, NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";
import { backendHeaders, clientIp } from "@/lib/auth/backend";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  try {
    const { turnstileToken, ...body } = (await request.json()) ?? {};
    if (!(await verifyTurnstile(turnstileToken, clientIp(request)))) {
      return NextResponse.json(
        { status: "error", message: "Browser verification failed. Please reload the page and try again." },
        { status: 400 }
      );
    }
    const expressUrl = `${getExpressApiUrl()}/auth/login`;

    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...backendHeaders(request),
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
