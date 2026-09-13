import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="p-12 sm:p-16 text-center rounded-xl space-y-4"
      style={{ border: "1px dashed var(--dash-border-strong)", background: "var(--dash-surface-1)" }}
    >
      <Icon className="w-10 h-10 mx-auto" style={{ color: "var(--dash-text-subtle)" }} />
      <div className="space-y-1">
        <p className="dash-subtitle" style={{ color: "var(--dash-text)" }}>
          {title}
        </p>
        {description && (
          <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--dash-text-subtle)" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
