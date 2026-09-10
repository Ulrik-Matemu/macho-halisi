"use client";

import React, { useState } from "react";
import { KeyRound, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface MfaChallengeFormProps {
  challengeToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function MfaChallengeForm({
  challengeToken,
  onSuccess,
  onBack,
}: MfaChallengeFormProps) {
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
        body: JSON.stringify({
          challengeToken,
          code: cleanCode,
        }),
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8d5524]/20 border border-[#c68642]/40 text-[#c68642] mb-1">
          <KeyRound className="w-5 h-5" />
        </div>
        <h3 className="font-serif-luxury text-xl text-white font-normal">
          Two-Factor Authentication
        </h3>
        <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
          Open your authenticator app (e.g. Google Authenticator, 1Password) and enter the 6-digit code.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      <div>
        <label
          htmlFor="mfa-code"
          className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2 text-center"
        >
          6-Digit Security Code
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
          className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded py-3 text-center text-2xl tracking-[0.4em] font-mono text-white placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-3.5 px-4 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-[0.24em] uppercase font-medium rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>Verify & Enter Dashboard</span>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-full py-2.5 text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to email and password</span>
        </button>
      </div>
    </form>
  );
}
