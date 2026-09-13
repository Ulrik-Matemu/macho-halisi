import React from "react";

/**
 * First focusable element on every dashboard page. Previously there was no
 * way for a keyboard user to bypass the header/nav to reach the main
 * content — this jumps straight to <main id="main-content">.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      style={{ background: "var(--dash-accent-fill)", color: "var(--dash-accent-on-fill)" }}
    >
      Skip to main content
    </a>
  );
}
