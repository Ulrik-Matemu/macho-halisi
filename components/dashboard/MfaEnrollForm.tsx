"use client";

import React, { useState, useEffect, useCallback } from "react";
import { QrCode, ArrowLeft, Copy, Check } from "lucide-react";
import Image from "next/image";
import Button from "@/components/dashboard/ui/Button";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface MfaEnrollFormProps {
  challengeToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function MfaEnrollForm({ challengeToken, onSuccess, onBack }: MfaEnrollFormProps) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadEnrollmentDetails = useCallback(async () => {
    setInitLoading(true);
    setInitError(null);
    try {
      const res = await fetch("/api/auth/mfa/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${challengeToken}` },
        body: JSON.stringify({ challengeToken }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setInitError(data.message || "Failed to initiate MFA enrollment.");
        return;
      }
      setSecret(data.secret);
      setQrCodeDataUrl(data.qrCodeDataUrl);
    } catch (err) {
      console.error("MFA enroll fetch error:", err);
      setInitError("Failed to connect to authentication server for setup.");
    } finally {
      setInitLoading(false);
    }
  }, [challengeToken]);

  useEffect(() => {
    loadEnrollmentDetails();
  }, [loadEnrollmentDetails]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);

    const cleanCode = code.replace(/\s+/g, "");
    if (cleanCode.length !== 6) {
      setVerifyError("Please enter a 6-digit confirmation code.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/auth/mfa/enroll/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${challengeToken}` },
        body: JSON.stringify({ challengeToken, code: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setVerifyError(data.message || "Invalid verification code. Please check your authenticator app.");
        return;
      }
      onSuccess();
    } catch (err) {
      console.error("MFA confirmation error:", err);
      setVerifyError("Failed to complete MFA confirmation.");
    } finally {
      setVerifying(false);
    }
  };

  const copySecretToClipboard = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (initLoading) {
    return (
      <div role="status" className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid var(--dash-border-strong)", borderTopColor: "var(--dash-accent)" }} />
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          Generating security credentials…
        </p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="space-y-6">
        <InlineMessage tone="error">
          <p className="font-medium mb-1">MFA setup failed</p>
          <p>{initError}</p>
        </InlineMessage>
        <Button variant="secondary" fullWidth icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
          Return to login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-1" style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}>
          <QrCode className="w-5 h-5" />
        </div>
        <h3 className="dash-title" style={{ color: "var(--dash-text)" }}>
          Set up two-factor authentication
        </h3>
        <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "var(--dash-text-subtle)" }}>
          Scan this QR code with your authenticator app (Google Authenticator, 1Password, or Authy).
        </p>
      </div>

      {verifyError && <InlineMessage tone="error">{verifyError}</InlineMessage>}

      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg max-w-[220px] mx-auto">
        {qrCodeDataUrl ? (
          <Image src={qrCodeDataUrl} alt="MFA QR Code" width={190} height={190} unoptimized className="w-full h-auto" />
        ) : (
          <div className="w-44 h-44 flex items-center justify-center text-black/50 text-sm">No QR code</div>
        )}
      </div>

      {secret && (
        <div className="space-y-1.5 text-center">
          <span className="dash-label block" style={{ color: "var(--dash-text-subtle)" }}>
            Manual setup key
          </span>
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <code className="dash-code px-2.5 py-1 rounded tracking-widest select-all break-all" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)", color: "var(--dash-accent)" }}>
              {secret}
            </code>
            <button
              type="button"
              onClick={copySecretToClipboard}
              aria-label="Copy secret"
              className="dash-focusable p-1.5 rounded-md transition-colors"
              style={{ border: "1px solid var(--dash-border-strong)", color: "var(--dash-text-muted)" }}
            >
              {copied ? <Check className="w-3.5 h-3.5" style={{ color: "var(--dash-status-published)" }} /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="enroll-code" className="dash-label block mb-2 text-center" style={{ color: "var(--dash-text-muted)" }}>
          Enter 6-digit code from authenticator
        </label>
        <input
          id="enroll-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          disabled={verifying}
          className="dash-focusable dash-code w-full rounded-md py-3 text-center text-2xl tracking-[0.4em] disabled:opacity-50"
          style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)", color: "var(--dash-text)" }}
        />
      </div>

      <div className="space-y-3 pt-1">
        <Button type="submit" variant="primary" fullWidth loading={verifying} disabled={code.length !== 6}>
          Confirm & enter dashboard
        </Button>
        <Button type="button" variant="ghost" fullWidth disabled={verifying} icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={onBack}>
          Back to email and password
        </Button>
      </div>
    </form>
  );
}
