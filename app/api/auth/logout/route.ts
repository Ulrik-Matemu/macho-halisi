import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES, getExpressApiUrl } from "@/lib/auth/constants";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    if (refreshToken) {
      try {
        const expressUrl = `${getExpressApiUrl()}/auth/logout`;
        await fetch(expressUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        console.warn("Express logout revocation failed, proceeding with local cookie clear:", err);
      }
    }

    const response = NextResponse.json({ status: "ok", message: "Logged out" }, { status: 200 });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    const response = NextResponse.json(
      { status: "error", message: "Error during logout" },
      { status: 500 }
    );
    clearAuthCookies(response);
    return response;
  }
}
