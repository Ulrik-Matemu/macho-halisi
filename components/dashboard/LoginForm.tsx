"use client";

import React, { useState } from "react";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { LoginSuccessResponse } from "@/lib/auth/types";

interface LoginFormProps {
  onSuccess: (data: LoginSuccessResponse) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@machohalisi.com"
            disabled={loading}
            className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded pl-10 pr-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[11px] font-medium tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={loading}
            className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded pl-10 pr-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-[0.24em] uppercase font-medium rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <span>Continue with MFA</span>
          )}
        </button>
      </div>
    </form>
  );
}
