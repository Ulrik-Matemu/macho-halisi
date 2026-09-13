"use client";

import React, { useId } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode;
}

/**
 * Wires a label to its control via htmlFor/id and to its hint/error via
 * aria-describedby — the current forms mostly render `<label>` as an
 * unassociated sibling of the input, so a screen reader announces neither
 * relationship. `error` renders as role="alert" so validation is announced
 * the moment it appears.
 */
export default function Field({ label, hint, error, required, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div>
      <label htmlFor={id} className="dash-label block mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
        {label}
        {required && (
          <span style={{ color: "var(--dash-status-danger)" }} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-xs mt-1.5" style={{ color: "var(--dash-text-subtle)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs mt-1.5" style={{ color: "var(--dash-status-danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "dash-focusable w-full rounded-md px-3.5 py-2.5 text-sm placeholder:opacity-50 transition-colors disabled:opacity-60";

export const inputStyle: React.CSSProperties = {
  background: "var(--dash-surface-2)",
  border: "1px solid var(--dash-border-strong)",
  color: "var(--dash-text)",
};
