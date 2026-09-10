import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES, getExpressApiUrl } from "@/lib/auth/constants";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { status: "error", message: "No refresh token provided" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    const expressUrl = `${getExpressApiUrl()}/auth/refresh`;
    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (res.ok && data.status === "ok" && data.accessToken) {
      const response = NextResponse.json({ status: "ok" }, { status: 200 });
      // The backend rotates the refresh token on every use, so the new one
      // must always replace the cookie alongside the new access token.
      setAuthCookies(response, data.accessToken, data.refreshToken);
      return response;
    }

    const response = NextResponse.json(data, { status: res.status });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Refresh proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
