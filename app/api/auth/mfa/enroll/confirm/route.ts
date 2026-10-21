import { NextRequest, NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeToken, code } = body;

    let token = challengeToken;
    const authHeader = request.headers.get("authorization");
    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    if (!token || !code) {
      return NextResponse.json(
        { status: "error", message: "Missing challenge token or verification code" },
        { status: 400 }
      );
    }

    const expressUrl = `${getExpressApiUrl()}/auth/mfa/enroll/confirm`;
    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (res.ok && data.status === "ok" && data.accessToken && data.refreshToken) {
      const response = NextResponse.json({ status: "ok" }, { status: 200 });
      setAuthCookies(response, data.accessToken, data.refreshToken);
      return response;
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("MFA enroll confirm proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
