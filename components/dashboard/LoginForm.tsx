"use client";

import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { LoginSuccessResponse } from "@/lib/auth/types";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";
import TurnstileWidget, { turnstileEnabled } from "@/components/TurnstileWidget";

interface LoginFormProps {
  onSuccess: (data: LoginSuccessResponse) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (turnstileEnabled && !captchaToken) {
      setError("Verifying your browser — please try again in a few seconds.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, turnstileToken: captchaToken }),
      });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setError(data.message || "Failed to sign in. Please verify your credentials.");
        return;
      }

      if (data.status === "mfa_required" || data.status === "mfa_enrollment_required") {
        onSuccess(data);
      } else {
        setError("Unexpected response from authentication service.");
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("Unable to reach authentication server. Please try again.");
    } finally {
      setLoading(false);
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <InlineMessage tone="error">{error}</InlineMessage>}

      <Field label="Email address">
        {({ id }) => (
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
            <input
              id={id}
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@machohalisi.com"
              disabled={loading}
              className={`${inputClass} pl-10`}
              style={inputStyle}
            />
          </div>
        )}
      </Field>

      <Field label="Password">
        {({ id }) => (
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
            <input
              id={id}
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              className={`${inputClass} pl-10`}
              style={inputStyle}
            />
          </div>
        )}
      </Field>

      <TurnstileWidget key={captchaKey} onToken={setCaptchaToken} theme="auto" />

      <Button type="submit" variant="primary" fullWidth loading={loading} size="md">
        {loading ? "Verifying credentials…" : "Continue"}
      </Button>
    </form>
  );
}
