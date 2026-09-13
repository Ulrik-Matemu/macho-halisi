import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="dash-display" style={{ color: "var(--dash-text)" }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm max-w-2xl" style={{ color: "var(--dash-text-subtle)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
}
