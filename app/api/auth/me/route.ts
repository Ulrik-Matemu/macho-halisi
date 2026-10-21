import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES, getExpressApiUrl } from "@/lib/auth/constants";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  try {
    let accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    // Helper to query Express /auth/me
    async function fetchMe(token: string) {
      const expressUrl = `${getExpressApiUrl()}/auth/me`;
      return fetch(expressUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // 1. If access token is present, try it first
    if (accessToken) {
      const res = await fetchMe(accessToken);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
      }
    }

    // 2. If access token is missing or rejected (e.g. expired 15m), attempt auto-refresh using refreshToken
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${getExpressApiUrl()}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.status === "ok" && typeof refreshData.accessToken === "string") {
            const newAccessToken: string = refreshData.accessToken;
            // The backend rotates + revokes the presented refresh token on
            // every /auth/refresh call. If we don't persist the new one
            // here, the cookie is left holding an already-dead token — the
            // *next* refresh attempt would then hit reuse detection and
            // revoke the whole session. So the rotated cookie must be
            // written regardless of what fetchMe() below does next.
            const newRefreshToken: string | undefined =
              typeof refreshData.refreshToken === "string" ? refreshData.refreshToken : undefined;

            const meRes = await fetchMe(newAccessToken);
            if (meRes.ok) {
              const meData = await meRes.json();
              const response = NextResponse.json(meData, { status: 200 });
              setAuthCookies(response, newAccessToken, newRefreshToken);
              return response;
            }

            // Refresh succeeded but /auth/me still rejected the new access
            // token (unexpected, but possible e.g. the user was deleted).
            // Still persist the rotated refresh token rather than clearing
            // it outright, since it is genuinely valid — clearing it would
            // discard a working session over an unrelated failure. If it
            // truly can't be used, the next call will fail the same way
            // and fall through to the unauthorized branch below.
            if (newRefreshToken) {
              const response = NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
              );
              setAuthCookies(response, newAccessToken, newRefreshToken);
              return response;
            }
          }
        }
      } catch (refreshErr) {
        console.warn("Auto-refresh attempt failed during /auth/me:", refreshErr);
      }
    }

    // 3. Both access token and refresh token failed/missing
    const response = NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Me proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
