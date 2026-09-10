import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES, getExpressApiUrl } from "./constants";
import { setAuthCookies, clearAuthCookies } from "./cookies";

interface ServerFetchResult {
  response: Response;
  newAccessToken?: string;
  newRefreshToken?: string;
}

/**
 * Server-side authenticated fetcher for Next.js Route Handlers.
 * Extracts `mh_access_token` from incoming cookies, proxies to Express with Bearer token.
 * If 401 is encountered and `mh_refresh_token` exists, transparently refreshes the session,
 * retries the request, and allows setting the updated cookie on the outgoing NextResponse.
 */
export async function serverFetch(
  request: NextRequest,
  endpoint: string,
  init: RequestInit = {}
): Promise<ServerFetchResult> {
  let accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  let newAccessToken: string | undefined = undefined;
  let newRefreshToken: string | undefined = undefined;

  const expressBase = getExpressApiUrl();
  const targetUrl = `${expressBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(init.headers || {});
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // 1. Initial attempt
  let res = await fetch(targetUrl, {
    ...init,
    headers,
  });

  // 2. If 401 Unauthorized and refresh token exists, attempt auto-refresh
  if (res.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${expressBase}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.status === "ok" && typeof refreshData.accessToken === "string") {
          newAccessToken = refreshData.accessToken;
          // The backend now rotates the refresh token on every use (and
          // revokes the presented one), so the old cookie value is dead
          // the moment this response arrives — the new one must replace it.
          if (typeof refreshData.refreshToken === "string") {
            newRefreshToken = refreshData.refreshToken;
          }
          headers.set("Authorization", `Bearer ${newAccessToken}`);

          // Retry the original request with new token
          res = await fetch(targetUrl, {
            ...init,
            headers,
          });
        }
      }
    } catch (refreshErr) {
      console.warn("Auto-refresh attempt failed in serverFetch:", refreshErr);
    }
  }

  return { response: res, newAccessToken, newRefreshToken };
}

/**
 * Helper to proxy the JSON body from Express directly into a NextResponse,
 * attaching the refreshed auth cookie if a rotation occurred.
 */
export async function proxyJsonResponse(
  request: NextRequest,
  endpoint: string,
  init: RequestInit = {}
): Promise<NextResponse> {
  try {
    const { response, newAccessToken, newRefreshToken } = await serverFetch(request, endpoint, init);
    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    if (newAccessToken) {
      setAuthCookies(nextResponse, newAccessToken, newRefreshToken);
    }

    if (response.status === 401 && !newAccessToken) {
      clearAuthCookies(nextResponse);
    }

    return nextResponse;
  } catch (err: any) {
    console.error(`Proxy error for ${endpoint}:`, err);
    return NextResponse.json(
      { status: "error", message: "Failed to communicate with backend server" },
      { status: 502 }
    );
  }
}
