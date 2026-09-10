import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/dashboard/:path*"],
};
