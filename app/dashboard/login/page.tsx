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
    if (data.status === "mfa_required") setStep("mfa_challenge");
    else if (data.status === "mfa_enrollment_required") setStep("mfa_enrollment");
  };

  const handleMfaComplete = () => {
    router.push(fromPath);
    router.refresh();
  };

  const handleBackToCredentials = () => {
    setChallengeToken("");
    setStep("credentials");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-xl shadow-2xl" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}>
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="mb-4 inline-block">
          <div className="relative h-12 aspect-[180/94] rounded overflow-hidden" style={{ border: "1px solid var(--dash-border-strong)" }}>
            <Image src="/media/macho-halisi-logo-2.jpg" alt="Macho Halisi Logo" fill priority className="object-cover object-center" />
          </div>
        </Link>
        <span className="dash-title" style={{ color: "var(--dash-text)" }}>
          Macho Halisi
        </span>
        <span className="text-sm mt-1" style={{ color: "var(--dash-text-subtle)" }}>
          Staff & operations portal
        </span>
      </div>

      {step === "credentials" && <LoginForm onSuccess={handleLoginSuccess} />}
      {step === "mfa_challenge" && <MfaChallengeForm challengeToken={challengeToken} onSuccess={handleMfaComplete} onBack={handleBackToCredentials} />}
      {step === "mfa_enrollment" && <MfaEnrollForm challengeToken={challengeToken} onSuccess={handleMfaComplete} onBack={handleBackToCredentials} />}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div data-app="dashboard" className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--dash-bg)" }}>
      <Suspense fallback={<div className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>Loading authentication...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
