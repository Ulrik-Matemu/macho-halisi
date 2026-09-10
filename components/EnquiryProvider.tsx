"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Optional pre-fill data for the enquiry modal — set when a visitor opens
 * it from a specific itinerary page rather than the generic Navbar/menu
 * "Enquire" entry points. The modal itself does not yet consume this (see
 * components/EnquiryModal.tsx) — that wiring lands with the enquiry
 * pipeline — but the context shape is established here so every call site
 * that opens the modal already has a stable, single API to call.
 */
export interface EnquirySeed {
  itineraryId?: string;
  itineraryTitle?: string;
}

interface EnquiryContextValue {
  isOpen: boolean;
  seed: EnquirySeed | null;
  openEnquiry: (seed?: EnquirySeed) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seed, setSeed] = useState<EnquirySeed | null>(null);

  const openEnquiry = useCallback((nextSeed?: EnquirySeed) => {
    setSeed(nextSeed ?? null);
    setIsOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, seed, openEnquiry, closeEnquiry }),
    [isOpen, seed, openEnquiry, closeEnquiry]
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

/**
 * Lets any client component in the tree — including small islands dropped
 * into otherwise server-rendered pages, like an itinerary detail page's
 * "Enquire About This Journey" button — open the shared enquiry modal
 * without prop-drilling through server components that can't hold state.
 */
export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry() must be called within an <EnquiryProvider>");
  }
  return ctx;
}
