"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ManagedUser, ALL_ROLES } from "@/lib/users/types";
import { UserRole } from "@/lib/auth/types";
import { useAuth } from "@/lib/dashboard/auth-context";
import {
  UserCog,
  UserPlus,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Ban,
  CheckCircle2,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Dialog from "@/components/dashboard/ui/Dialog";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import DataTable, { Column } from "@/components/dashboard/ui/DataTable";
import { formatShortDate } from "@/lib/dashboard/format";

type ConfirmType = "deactivate" | "reactivate" | "resetMfa";

const ROLE_TONE: Record<UserRole, string> = {
  ADMIN: "var(--dash-accent)",
  EDITOR: "var(--dash-status-review)",
  AUTHOR: "var(--dash-status-published)",
  VIEWER: "var(--dash-text-subtle)",
};

function RoleBadge({ role }: { role: UserRole }) {
  const color = ROLE_TONE[role];
  return (
    <span className="dash-badge" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, borderColor: `color-mix(in srgb, ${color} 35%, transparent)` }}>
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </span>
  );
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return <span className={`dash-badge ${isActive ? "dash-badge--published" : "dash-badge--danger"}`}>{isActive ? "Active" : "Deactivated"}</span>;
}

export default function UsersManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: ConfirmType; target: ManagedUser } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "", role: "VIEWER" as UserRole });
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [passwordModal, setPasswordModal] = useState<ManagedUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

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

  const handleExecuteConfirm = async () => {
    if (!confirmModal) return;
    const { type, target } = confirmModal;
    setActionLoading(target.id);
    setActionError(null);

    const endpoint =
      type === "deactivate" ? `/api/users/${target.id}/deactivate` : type === "reactivate" ? `/api/users/${target.id}/reactivate` : `/api/users/${target.id}/mfa/reset`;

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

  if (!user) return null;

  const columns: Column<ManagedUser>[] = [
    {
      key: "email",
      header: "Email",
      render: (u) => (
        <span className="dash-code flex items-center gap-1.5 text-sm" style={{ color: "var(--dash-text)" }}>
          <Mail className="w-3 h-3" style={{ color: "var(--dash-accent)" }} />
          {u.email}
          {user.id === u.id && (
            <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
              (you)
            </span>
          )}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => {
        const isSelf = user.id === u.id;
        const rowBusy = actionLoading === u.id;
        return (
          <div className="space-y-1">
            <label className="sr-only" htmlFor={`role-${u.id}`}>
              Role for {u.email}
            </label>
            <select
              id={`role-${u.id}`}
              value={u.role}
              disabled={isSelf || rowBusy}
              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
              className="dash-focusable bg-transparent text-sm rounded disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "var(--dash-text-muted)" }}
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role} style={{ background: "var(--dash-surface-2)", color: "var(--dash-text)" }}>
                  {role}
                </option>
              ))}
            </select>
            <div>
              <RoleBadge role={u.role} />
            </div>
          </div>
        );
      },
    },
    { key: "status", header: "Status", render: (u) => <ActiveBadge isActive={u.isActive} /> },
    {
      key: "mfa",
      header: "MFA",
      render: (u) =>
        u.mfaEnabled ? (
          <span className="flex items-center gap-1 text-sm" style={{ color: "var(--dash-status-published)" }}>
            <ShieldCheck className="w-3.5 h-3.5" /> Enrolled
          </span>
        ) : (
          <span className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
            Not enrolled
          </span>
        ),
    },
    {
      key: "created",
      header: "Created",
      render: (u) => (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dash-text-subtle)" }}>
          <Clock className="w-3 h-3" />
          {formatShortDate(u.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (u) => {
        const isSelf = user.id === u.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <IconButton
              label="Reset password"
              tone="info"
              onClick={() => {
                setPasswordModal(u);
                setNewPassword("");
                setPasswordError(null);
              }}
            >
              <KeyRound className="w-4 h-4" />
            </IconButton>
            {u.mfaEnabled && (
              <IconButton label="Reset MFA" tone="warning" onClick={() => setConfirmModal({ type: "resetMfa", target: u })}>
                <RotateCcw className="w-4 h-4" />
              </IconButton>
            )}
            {u.isActive ? (
              <IconButton label="Deactivate account" tone="danger" disabled={isSelf} onClick={() => setConfirmModal({ type: "deactivate", target: u })}>
                <Ban className="w-4 h-4" />
              </IconButton>
            ) : (
              <IconButton label="Reactivate account" tone="success" onClick={() => setConfirmModal({ type: "reactivate", target: u })}>
                <CheckCircle2 className="w-4 h-4" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User management"
        description="Manage staff accounts, roles, and two-factor authentication."
        actions={
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setCreateOpen((v) => !v)}>
            New user
          </Button>
        }
      />

      {createOpen && (
        <form onSubmit={handleCreate} className="p-5 rounded-xl space-y-4" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
          {createError && <InlineMessage tone="error">{createError}</InlineMessage>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Email">
              {({ id }) => (
                <input
                  id={id}
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="stakeholder@example.com"
                />
              )}
            </Field>
            <Field label="Temporary password">
              {({ id }) => (
                <input
                  id={id}
                  type="text"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Min. 8 characters"
                />
              )}
            </Field>
            <Field label="Role">
              {({ id }) => (
                <select id={id} value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })} className={inputClass} style={inputStyle}>
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setCreateOpen(false);
                setCreateError(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={creating}>
              Create account
            </Button>
          </div>
        </form>
      )}

      {error && <InlineMessage tone="error">{error}</InlineMessage>}
      {actionError && <InlineMessage tone="error">{actionError}</InlineMessage>}

      {loading ? (
        <SkeletonRows rows={5} label="Loading users" />
      ) : users.length === 0 ? (
        <EmptyState icon={UserCog} title="No users found" />
      ) : (
        <div className="space-y-4">
          <DataTable
            caption="Users"
            columns={columns}
            rows={users}
            rowKey={(u) => u.id}
            renderCard={(u) => (
              <div className="p-4 rounded-lg space-y-3" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="dash-code text-sm truncate" style={{ color: "var(--dash-text)" }}>
                    {u.email}
                  </span>
                  <ActiveBadge isActive={u.isActive} />
                </div>
                <div className="flex items-center gap-3">
                  <RoleBadge role={u.role} />
                  <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    {u.mfaEnabled ? "MFA enrolled" : "MFA not enrolled"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <span className="text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                    {formatShortDate(u.createdAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <IconButton
                      label="Reset password"
                      tone="info"
                      onClick={() => {
                        setPasswordModal(u);
                        setNewPassword("");
                        setPasswordError(null);
                      }}
                    >
                      <KeyRound className="w-4 h-4" />
                    </IconButton>
                    {u.isActive ? (
                      <IconButton label="Deactivate" tone="danger" disabled={user.id === u.id} onClick={() => setConfirmModal({ type: "deactivate", target: u })}>
                        <Ban className="w-4 h-4" />
                      </IconButton>
                    ) : (
                      <IconButton label="Reactivate" tone="success" onClick={() => setConfirmModal({ type: "reactivate", target: u })}>
                        <CheckCircle2 className="w-4 h-4" />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          />

          {totalPages > 1 && (
            <nav aria-label="Users pagination" className="flex items-center justify-end gap-3 text-sm" style={{ color: "var(--dash-text-subtle)" }}>
              <IconButton label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </IconButton>
              <span className="dash-code">
                Page {page} of {totalPages}
              </span>
              <IconButton label="Next page" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </IconButton>
            </nav>
          )}
        </div>
      )}

      <Dialog
        open={Boolean(confirmModal)}
        onClose={() => {
          setConfirmModal(null);
          setActionError(null);
        }}
        title={
          confirmModal?.type === "deactivate" ? "Deactivate this user?" : confirmModal?.type === "reactivate" ? "Reactivate this user?" : "Reset MFA for this user?"
        }
        description={
          confirmModal?.type === "deactivate"
            ? `"${confirmModal.target.email}" will be blocked from logging in and their active sessions will be revoked.`
            : confirmModal?.type === "reactivate"
            ? `"${confirmModal?.target.email}" will be able to log in again.`
            : `"${confirmModal?.target.email}" will need to re-enroll their authenticator app on next login.`
        }
        footer={
          <>
            <Button variant="ghost" disabled={Boolean(actionLoading)} onClick={() => setConfirmModal(null)}>
              Cancel
            </Button>
            <Button variant={confirmModal?.type === "deactivate" ? "danger" : "primary"} loading={Boolean(actionLoading)} onClick={handleExecuteConfirm}>
              {confirmModal?.type === "deactivate" && "Confirm deactivate"}
              {confirmModal?.type === "reactivate" && "Confirm reactivate"}
              {confirmModal?.type === "resetMfa" && "Confirm reset"}
            </Button>
          </>
        }
      />

      <Dialog
        open={Boolean(passwordModal)}
        onClose={() => {
          setPasswordModal(null);
          setPasswordError(null);
        }}
        title="Reset password"
        description={passwordModal ? `Set a new password for "${passwordModal.email}". Their active sessions will be revoked and they'll need to log in again with this password.` : undefined}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={passwordSubmitting}
              onClick={() => {
                setPasswordModal(null);
                setPasswordError(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="reset-password-form" variant="primary" loading={passwordSubmitting}>
              Reset password
            </Button>
          </>
        }
      >
        <form id="reset-password-form" onSubmit={handleResetPassword} className="space-y-4">
          <Field label="New password">
            {({ id }) => (
              <input id={id} type="text" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} style={inputStyle} placeholder="Min. 8 characters" />
            )}
          </Field>
          {passwordError && <InlineMessage tone="error">{passwordError}</InlineMessage>}
        </form>
      </Dialog>
    </div>
  );
}
