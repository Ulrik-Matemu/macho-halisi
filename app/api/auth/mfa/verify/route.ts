import { NextRequest, NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeToken, code } = body;

    if (!challengeToken || !code) {
      return NextResponse.json(
        { status: "error", message: "Missing challenge token or verification code" },
        { status: 400 }
      );
    }

    const expressUrl = `${getExpressApiUrl()}/auth/mfa/verify`;
    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ challengeToken, code }),
    });

    const data = await res.json();

    if (res.ok && data.status === "ok" && data.accessToken && data.refreshToken) {
      const response = NextResponse.json({ status: "ok" }, { status: 200 });
      setAuthCookies(response, data.accessToken, data.refreshToken);
      return response;
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("MFA verify proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
