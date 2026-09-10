export type UserRole = "ADMIN" | "EDITOR" | "AUTHOR" | "VIEWER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export type LoginSuccessResponse =
  | { status: "mfa_required"; challengeToken: string }
  | { status: "mfa_enrollment_required"; challengeToken: string };

export interface ErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

export interface MfaEnrollResponse {
  status: "ok";
  secret: string;
  qrCodeDataUrl: string;
}

export interface AuthTokensResponse {
  status: "ok";
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  status: "ok";
  user: AuthUser;
}
