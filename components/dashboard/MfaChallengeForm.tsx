"use client";

import React, { useState } from "react";
import { KeyRound, ArrowLeft } from "lucide-react";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface MfaChallengeFormProps {
  challengeToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function MfaChallengeForm({ challengeToken, onSuccess, onBack }: MfaChallengeFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.replace(/\s+/g, "");
    if (cleanCode.length !== 6) {
      setError("Please enter a 6-digit authentication code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken, code: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setError(data.message || "Invalid authentication code. Please try again.");
        return;
      }
      onSuccess();
    } catch (err) {
      console.error("MFA verification error:", err);
      setError("Failed to verify code with authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-1" style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}>
          <KeyRound className="w-5 h-5" />
        </div>
        <h3 className="dash-title" style={{ color: "var(--dash-text)" }}>
          Two-factor authentication
        </h3>
        <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: "var(--dash-text-subtle)" }}>
          Open your authenticator app and enter the 6-digit code.
        </p>
      </div>

      {error && <InlineMessage tone="error">{error}</InlineMessage>}

      <div>
        <label htmlFor="mfa-code" className="dash-label block mb-2 text-center" style={{ color: "var(--dash-text-muted)" }}>
          6-digit security code
        </label>
        <input
          id="mfa-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          required
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          disabled={loading}
          className="dash-focusable dash-code w-full rounded-md py-3 text-center text-2xl tracking-[0.4em] disabled:opacity-50"
          style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)", color: "var(--dash-text)" }}
        />
      </div>

      <div className="space-y-3 pt-1">
        <Button type="submit" variant="primary" fullWidth loading={loading} disabled={code.length !== 6}>
          Verify & enter dashboard
        </Button>
        <Button type="button" variant="ghost" fullWidth disabled={loading} icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={onBack}>
          Back to email and password
        </Button>
      </div>
    </form>
  );
}
