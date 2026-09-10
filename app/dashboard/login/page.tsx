"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/dashboard/LoginForm";
import MfaChallengeForm from "@/components/dashboard/MfaChallengeForm";
import MfaEnrollForm from "@/components/dashboard/MfaEnrollForm";
import { LoginSuccessResponse } from "@/lib/auth/types";

type AuthStep = "credentials" | "mfa_challenge" | "mfa_enrollment";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/dashboard";

  const [step, setStep] = useState<AuthStep>("credentials");
  const [challengeToken, setChallengeToken] = useState<string>("");

  const handleLoginSuccess = (data: LoginSuccessResponse) => {
    setChallengeToken(data.challengeToken);
    if (data.status === "mfa_required") {
      setStep("mfa_challenge");
    } else if (data.status === "mfa_enrollment_required") {
      setStep("mfa_enrollment");
    }
  };

  const handleMfaComplete = () => {
    // Navigate into the authenticated dashboard
    router.push(fromPath);
    router.refresh();
  };

  const handleBackToCredentials = () => {
    setChallengeToken("");
    setStep("credentials");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#0d0d0d] border border-[#8d5524]/30 rounded-xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Decorative top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8d5524] via-[#c68642] to-[#8d5524]" />

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="mb-4 inline-block group">
          <div className="relative h-12 aspect-[180/94] rounded overflow-hidden border border-white/20 bg-black group-hover:border-[#c68642] transition-colors">
            <Image
              src="/media/macho-halisi-logo-2.jpg"
              alt="Macho Halisi Logo"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </Link>
        <span className="font-serif-luxury text-xl sm:text-2xl text-white font-light tracking-[0.14em] uppercase">
          Macho Halisi
        </span>
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#f1c27d] mt-1">
          Staff & Operations Portal
        </span>
      </div>

      {/* Step Views */}
      {step === "credentials" && (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}

      {step === "mfa_challenge" && (
        <MfaChallengeForm
          challengeToken={challengeToken}
          onSuccess={handleMfaComplete}
          onBack={handleBackToCredentials}
        />
      )}

      {step === "mfa_enrollment" && (
        <MfaEnrollForm
          challengeToken={challengeToken}
          onSuccess={handleMfaComplete}
          onBack={handleBackToCredentials}
        />
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-white/40 font-mono">Loading authentication...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
