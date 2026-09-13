"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const BreadcrumbContext = createContext<{
  trailingLabel?: string;
  setTrailingLabel: (label: string | undefined) => void;
} | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [trailingLabel, setTrailingLabel] = useState<string | undefined>(undefined);
  return (
    <BreadcrumbContext.Provider value={{ trailingLabel, setTrailingLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Lets a page override the final breadcrumb segment TopBar renders — e.g.
 * the itinerary editor sets its title once the record loads. Resets on
 * unmount so navigating away doesn't leak a stale label onto the next page.
 */
export function useSetBreadcrumb(label: string | undefined) {
  const ctx = useContext(BreadcrumbContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setTrailingLabel(label);
    return () => ctx.setTrailingLabel(undefined);
  }, [ctx, label]);
}

export function useBreadcrumbLabel(): string | undefined {
  const ctx = useContext(BreadcrumbContext);
  return ctx?.trailingLabel;
}
