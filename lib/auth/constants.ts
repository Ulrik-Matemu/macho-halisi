export const AUTH_COOKIES = {
  ACCESS_TOKEN: "mh_access_token",
  REFRESH_TOKEN: "mh_refresh_token",
} as const;

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN_MAX_AGE: 15 * 60, // 15 minutes (matches backend JWT)
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60, // 7 days (matches Prisma refresh token)
} as const;

export function getExpressApiUrl(): string {
  return process.env.EXPRESS_API_URL || "http://localhost:4000";
}
