import { UserRole } from "@/lib/auth/types";

export const ALL_ROLES: UserRole[] = ["ADMIN", "EDITOR", "AUTHOR", "VIEWER"];

export interface ManagedUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  status: "ok";
  data: ManagedUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
