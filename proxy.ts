import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { clientIp } from "@/lib/auth/backend";
import { hit } from "@/lib/rateLimit";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Per-IP ceilings for the public routes a bot would hammer (see
// lib/rateLimit.ts for why these are a first line only).
const API_LIMITS: { prefix: string; limit: number; windowMs: number }[] = [
  { prefix: "/api/enquiries", limit: 10, windowMs: 15 * 60 * 1000 },
  { prefix: "/api/auth/login", limit: 20, windowMs: 15 * 60 * 1000 },
  { prefix: "/api/auth/mfa", limit: 20, windowMs: 15 * 60 * 1000 },
  { prefix: "/api/track", limit: 120, windowMs: 60 * 1000 },
  { prefix: "/api/public", limit: 60, windowMs: 60 * 1000 },
];

/**
 * CSRF guard. The auth cookies are SameSite=Lax, which already keeps them
 * off cross-site POSTs; this also refuses any state-changing request whose
 * Origin names another site. Browsers always send Origin on these methods,
 * so a missing one means a non-browser client — which can't carry a
 * visitor's cookies anyway.
 */
function isCrossSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

function handleApi(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (MUTATING_METHODS.has(request.method) && isCrossSite(request)) {
    return NextResponse.json({ status: "error", message: "Forbidden" }, { status: 403 });
  }

  const rule = API_LIMITS.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  // Only the public, anonymous routes count — the admin endpoints under
  // /api/enquiries/admin are behind auth and the backend's own limits.
  if (rule && !pathname.startsWith("/api/enquiries/admin")) {
    const ip = clientIp(request) ?? "unknown";
    const retryAfter = hit(`${rule.prefix}:${ip}`, rule.limit, rule.windowMs);
    if (retryAfter !== null) {
      return NextResponse.json(
        { status: "error", message: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  }

  return NextResponse.next();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return handleApi(request);
  }

  const hasAccessToken = request.cookies.has(AUTH_COOKIES.ACCESS_TOKEN);
  const hasRefreshToken = request.cookies.has(AUTH_COOKIES.REFRESH_TOKEN);
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  const isLoginPage = pathname.startsWith("/dashboard/login");

  // 1. If accessing login while authenticated, redirect to /dashboard
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. If accessing protected /dashboard routes while unauthenticated, redirect to /dashboard/login
  if (!isAuthenticated) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
