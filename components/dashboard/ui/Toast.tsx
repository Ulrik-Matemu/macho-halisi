import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface InlineMessageProps {
  tone: "error" | "success";
  children: React.ReactNode;
}

/**
 * The `aria-live` region for inline save/action feedback — error banners
 * across the dashboard previously rendered with no role, so screen reader
 * users weren't told when a request failed. `role="alert"` (error) is an
 * assertive live region by default; success uses "status" (polite) since
 * it's not urgent.
 */
export function InlineMessage({ tone, children }: InlineMessageProps) {
  const isError = tone === "error";
  const color = isError ? "var(--dash-status-danger)" : "var(--dash-status-published)";
  return (
    <div
      role={isError ? "alert" : "status"}
      className="p-3.5 rounded-lg flex items-start gap-2.5 text-sm"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
      }}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
