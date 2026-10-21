"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Whether the bot check is configured; forms only wait for a token when it is. */
export const turnstileEnabled = !!SITE_KEY;

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile bot check. Invisible for most visitors — it only
 * shows a checkbox when Cloudflare wants an interaction. Reports a fresh
 * token through onToken (null when it expires or errors). Tokens are
 * single-use, so remount it (change its `key`) after every submission.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
 */
export default function TurnstileWidget({
  onToken,
  theme = "light",
}: {
  onToken: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId: string | null = null;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [theme]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="empty:hidden" />;
}
