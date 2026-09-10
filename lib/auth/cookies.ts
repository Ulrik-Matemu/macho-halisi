import { NextResponse } from "next/server";
import { AUTH_COOKIES, TOKEN_EXPIRY } from "./constants";

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: AUTH_COOKIES.ACCESS_TOKEN,
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY.ACCESS_TOKEN_MAX_AGE,
  });

  if (refreshToken) {
    response.cookies.set({
      name: AUTH_COOKIES.REFRESH_TOKEN,
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRY.REFRESH_TOKEN_MAX_AGE,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: AUTH_COOKIES.ACCESS_TOKEN,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: AUTH_COOKIES.REFRESH_TOKEN,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
