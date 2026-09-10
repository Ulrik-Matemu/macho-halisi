"use client";

import React, { useState, useEffect, useCallback } from "react";
import { QrCode, ArrowLeft, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import Image from "next/image";

interface MfaEnrollFormProps {
  challengeToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function MfaEnrollForm({
  challengeToken,
  onSuccess,
  onBack,
}: MfaEnrollFormProps) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Fetch QR code and secret on mount
  const loadEnrollmentDetails = useCallback(async () => {
    setInitLoading(true);
    setInitError(null);

    try {
      const res = await fetch("/api/auth/mfa/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${challengeToken}`,
        },
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

  // 2. Submit confirmation code
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${challengeToken}`,
        },
        body: JSON.stringify({
          challengeToken,
          code: cleanCode,
        }),
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
      <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
        <p className="text-xs text-white/60 tracking-wider uppercase font-mono">
          Generating security credentials...
        </p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded text-xs text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold mb-1">MFA Setup Failed</p>
            <p>{initError}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded text-xs transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to login</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8d5524]/20 border border-[#c68642]/40 text-[#c68642] mb-1">
          <QrCode className="w-5 h-5" />
        </div>
        <h3 className="font-serif-luxury text-xl text-white font-normal">
          Set Up Two-Factor Authentication
        </h3>
        <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
          Scan this QR code with your authenticator app (Google Authenticator, 1Password, or Authy).
        </p>
      </div>

      {verifyError && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{verifyError}</div>
        </div>
      )}

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-white/20 max-w-[220px] mx-auto shadow-inner">
        {qrCodeDataUrl ? (
          <Image
            src={qrCodeDataUrl}
            alt="MFA QR Code"
            width={190}
            height={190}
            unoptimized
            className="w-full h-auto"
          />
        ) : (
          <div className="w-44 h-44 flex items-center justify-center text-black/50 text-xs">
            No QR Code
          </div>
        )}
      </div>

      {/* Manual Secret Fallback */}
      {secret && (
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 block">
            Manual Setup Key
          </span>
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <code className="bg-[#141414] border border-white/10 px-2.5 py-1 rounded text-xs font-mono text-[#f1c27d] tracking-widest select-all break-all">
              {secret}
            </code>
            <button
              type="button"
              onClick={copySecretToClipboard}
              aria-label="Copy secret"
              className="p-1.5 rounded border border-white/15 hover:border-[#c68642] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Code Input */}
      <div>
        <label
          htmlFor="enroll-code"
          className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2 text-center"
        >
          Enter 6-Digit Code from Authenticator
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
          className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded py-3 text-center text-2xl tracking-[0.4em] font-mono text-white placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={verifying || code.length !== 6}
          className="w-full py-3.5 px-4 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-[0.24em] uppercase font-medium rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Setup...</span>
            </>
          ) : (
            <span>Confirm & Enter Dashboard</span>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={verifying}
          className="w-full py-2.5 text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to email and password</span>
        </button>
      </div>
    </form>
  );
}
