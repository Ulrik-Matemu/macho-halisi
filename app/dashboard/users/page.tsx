"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ManagedUser, ALL_ROLES } from "@/lib/users/types";
import { AuthUser, UserRole } from "@/lib/auth/types";
import {
  UserCog,
  UserPlus,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Ban,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ConfirmType = "deactivate" | "reactivate" | "resetMfa";

export default function UsersManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Row-action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmType;
    target: ManagedUser;
  } | null>(null);

  // Create-user panel
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "", role: "VIEWER" as UserRole });
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Reset-password modal (needs a text input, so it's separate from confirmModal)
  const [passwordModal, setPasswordModal] = useState<ManagedUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // 1. Fetch user session — this whole section is admin-only
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.status === "ok" && data.user) {
          if (data.user.role !== "ADMIN") {
            router.push("/dashboard");
            return;
          }
          setUser(data.user);
        } else {
          router.push("/dashboard/login?from=/dashboard/users");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    fetchUser();
  }, [router]);

  // 2. Fetch users list
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users?page=${page}&limit=20`);
      const data = await res.json();

      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setUsers(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Network error while connecting to server");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (user) loadUsers();
  }, [user, loadUsers]);

  // Create user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setCreateError(data.message || "Failed to create user.");
        return;
      }
      setCreateForm({ email: "", password: "", role: "VIEWER" });
      setCreateOpen(false);
      await loadUsers();
    } catch (err) {
      console.error("Create user error:", err);
      setCreateError("Network error while creating user.");
    } finally {
      setCreating(false);
    }
  };

  // Role change — low-risk, no confirm dialog
  const handleRoleChange = async (target: ManagedUser, role: UserRole) => {
    setActionLoading(target.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/users/${target.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setActionError(data.message || "Failed to change role.");
        return;
      }
      await loadUsers();
    } catch (err) {
      console.error("Role change error:", err);
      setActionError("Network error while changing role.");
    } finally {
      setActionLoading(null);
    }
  };

  // Deactivate / Reactivate / Reset MFA — routed through the confirm modal
  const handleExecuteConfirm = async () => {
    if (!confirmModal) return;
    const { type, target } = confirmModal;
    setActionLoading(target.id);
    setActionError(null);

    const endpoint =
      type === "deactivate"
        ? `/api/users/${target.id}/deactivate`
        : type === "reactivate"
        ? `/api/users/${target.id}/reactivate`
        : `/api/users/${target.id}/mfa/reset`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setActionError(data.message || `Failed to ${type} user.`);
        return;
      }

      setConfirmModal(null);
      await loadUsers();
    } catch (err) {
      console.error(`Action error ${type}:`, err);
      setActionError("Network error while performing action.");
    } finally {
      setActionLoading(null);
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal) return;
    setPasswordSubmitting(true);
    setPasswordError(null);
    try {
      const res = await fetch(`/api/users/${passwordModal.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setPasswordError(data.message || "Failed to reset password.");
        return;
      }
      setPasswordModal(null);
      setNewPassword("");
    } catch (err) {
      console.error("Reset password error:", err);
      setPasswordError("Network error while resetting password.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      ADMIN: "bg-[#c68642]/15 border-[#c68642]/40 text-[#ffdbac]",
      EDITOR: "bg-sky-500/15 border-sky-500/40 text-sky-200",
      AUTHOR: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
      VIEWER: "bg-zinc-700/30 border-white/20 text-white/50",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase border ${styles[role]}`}
      >
        {role}
      </span>
    );
  };

  const getActiveBadge = (isActive: boolean) =>
    isActive ? (
      <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
        ACTIVE
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-red-500/15 border border-red-500/40 text-red-300">
        DEACTIVATED
      </span>
    );

  return (
    <div className="flex-1 flex flex-col bg-[#080808]">
      {user && <DashboardHeader user={user} />}

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#c68642] uppercase">
              <UserCog className="w-3.5 h-3.5" />
              <span>Access Control</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
              User Management
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen((open) => !open)}
            className="px-4 py-2.5 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-[0.18em] uppercase font-medium rounded transition-all duration-200 flex items-center gap-2 self-start sm:self-auto shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.3)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New User</span>
          </button>
        </div>

        {/* Create User Panel */}
        {createOpen && (
          <form
            onSubmit={handleCreate}
            className="p-5 rounded-xl border border-white/10 bg-[#0e0e0e] space-y-4"
          >
            {createError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{createError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-[#c68642]"
                  placeholder="stakeholder@example.com"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1.5">
                  Temporary Password
                </label>
                <input
                  type="text"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-[#c68642]"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1.5">
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-[#c68642]"
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(false);
                  setCreateError(null);
                }}
                className="px-4 py-2 rounded text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2.5 rounded text-xs font-serif-luxury tracking-wider uppercase font-semibold bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Account</span>
              </button>
            </div>
          </form>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/50 rounded flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 bg-red-950/40 border border-red-800/50 rounded flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-7 h-7 text-[#c68642] animate-spin" />
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Loading users...
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d] space-y-4">
            <UserCog className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="font-serif-luxury text-lg text-white font-light">No Users Found</h3>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0e0e0e] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#121212] text-white/50 font-mono text-[10px] tracking-widest uppercase">
                    <th className="py-3.5 px-4 sm:px-6">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">MFA</th>
                    <th className="py-3.5 px-4">Created</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((managedUser) => {
                    const isSelf = user?.id === managedUser.id;
                    const rowBusy = actionLoading === managedUser.id;
                    return (
                      <tr key={managedUser.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-4 sm:px-6">
                          <span className="flex items-center gap-1.5 font-mono text-white">
                            <Mail className="w-3 h-3 text-[#c68642]" />
                            {managedUser.email}
                            {isSelf && <span className="text-white/30 text-[10px]">(you)</span>}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={managedUser.role}
                            disabled={isSelf || rowBusy}
                            onChange={(e) => handleRoleChange(managedUser, e.target.value as UserRole)}
                            className="bg-transparent border-none text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none"
                          >
                            {ALL_ROLES.map((role) => (
                              <option key={role} value={role} className="bg-[#121212] text-white">
                                {role}
                              </option>
                            ))}
                          </select>
                          <div className="mt-1">{getRoleBadge(managedUser.role)}</div>
                        </td>
                        <td className="py-4 px-4">{getActiveBadge(managedUser.isActive)}</td>
                        <td className="py-4 px-4">
                          {managedUser.mfaEnabled ? (
                            <span className="flex items-center gap-1 text-emerald-300 text-[11px]">
                              <ShieldCheck className="w-3 h-3" /> Enrolled
                            </span>
                          ) : (
                            <span className="text-white/30 text-[11px]">Not enrolled</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-white/50 text-[11px] font-mono">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-white/30" />
                            {new Date(managedUser.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="Reset Password"
                              onClick={() => {
                                setPasswordModal(managedUser);
                                setNewPassword("");
                                setPasswordError(null);
                              }}
                              className="p-1.5 text-sky-400 hover:text-sky-300 rounded hover:bg-sky-950/30 transition-colors cursor-pointer"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            {managedUser.mfaEnabled && (
                              <button
                                type="button"
                                title="Reset MFA"
                                onClick={() => setConfirmModal({ type: "resetMfa", target: managedUser })}
                                className="p-1.5 text-amber-400 hover:text-amber-300 rounded hover:bg-amber-950/30 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            {managedUser.isActive ? (
                              <button
                                type="button"
                                title="Deactivate Account"
                                disabled={isSelf}
                                onClick={() => setConfirmModal({ type: "deactivate", target: managedUser })}
                                className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Reactivate Account"
                                onClick={() => setConfirmModal({ type: "reactivate", target: managedUser })}
                                className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded hover:bg-emerald-950/30 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 border-t border-white/10 text-xs text-white/50">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal (Deactivate / Reactivate / Reset MFA) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#111111] border border-[#8d5524]/40 rounded-xl p-6 shadow-2xl space-y-5 text-white">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#c68642] block mb-1">
                Admin Action Confirmation
              </span>
              <h3 className="font-serif-luxury text-xl font-normal text-white">
                {confirmModal.type === "deactivate" && "Deactivate this User?"}
                {confirmModal.type === "reactivate" && "Reactivate this User?"}
                {confirmModal.type === "resetMfa" && "Reset MFA for this User?"}
              </h3>
              <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                {confirmModal.type === "deactivate" &&
                  `"${confirmModal.target.email}" will be blocked from logging in and their active sessions will be revoked.`}
                {confirmModal.type === "reactivate" &&
                  `"${confirmModal.target.email}" will be able to log in again.`}
                {confirmModal.type === "resetMfa" &&
                  `"${confirmModal.target.email}" will need to re-enroll their authenticator app on next login.`}
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => {
                  setConfirmModal(null);
                  setActionError(null);
                }}
                className="px-4 py-2 rounded text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={handleExecuteConfirm}
                className={`px-5 py-2.5 rounded text-xs font-serif-luxury tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  confirmModal.type === "deactivate"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac]"
                }`}
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>
                  {confirmModal.type === "deactivate" && "Confirm Deactivate"}
                  {confirmModal.type === "reactivate" && "Confirm Reactivate"}
                  {confirmModal.type === "resetMfa" && "Confirm Reset"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleResetPassword}
            className="max-w-md w-full bg-[#111111] border border-[#8d5524]/40 rounded-xl p-6 shadow-2xl space-y-5 text-white"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#c68642] block mb-1">
                Admin Action Confirmation
              </span>
              <h3 className="font-serif-luxury text-xl font-normal text-white">Reset Password</h3>
              <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                Set a new password for &quot;{passwordModal.email}&quot;. Their active sessions will be
                revoked and they&apos;ll need to log in again with this password.
              </p>
            </div>

            <div>
              <label className="block text-white/50 text-[10px] font-mono tracking-widest uppercase mb-1.5">
                New Password
              </label>
              <input
                type="text"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-[#c68642]"
                placeholder="Min. 8 characters"
              />
            </div>

            {passwordError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={passwordSubmitting}
                onClick={() => {
                  setPasswordModal(null);
                  setPasswordError(null);
                }}
                className="px-4 py-2 rounded text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordSubmitting}
                className="px-5 py-2.5 rounded text-xs font-serif-luxury tracking-wider uppercase font-semibold bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {passwordSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Reset Password</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
