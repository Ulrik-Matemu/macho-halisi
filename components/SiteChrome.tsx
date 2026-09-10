"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import FullscreenNavMenu from "./FullscreenNavMenu";
import EnquiryModal from "./EnquiryModal";
import { EnquiryProvider, useEnquiry } from "./EnquiryProvider";

/**
 * Owns every piece of client-only interaction chrome shared by every public
 * page — the Navbar, the fullscreen nav menu, and the enquiry modal — so
 * that pages can stay plain server components and pass server-rendered
 * content as children. Deliberately does NOT render Hero: that belongs only
 * to the homepage, which composes it explicitly as a child
 * (`<SiteChrome><Hero />...</SiteChrome>`) rather than SiteChrome assuming
 * every page wants the full-bleed video hero.
 */
function SiteChromeInner({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen: isEnquiryOpen, openEnquiry, closeEnquiry } = useEnquiry();

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#8d5524] selection:text-[#ffdbac]">
      <Navbar
        isVisible={true}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenEnquiry={() => openEnquiry()}
      />

      {children}

      <FullscreenNavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenEnquiry={() => openEnquiry()}
      />

      <EnquiryModal isOpen={isEnquiryOpen} onClose={closeEnquiry} />
    </main>
  );
}

export default function SiteChrome({ children }: { children?: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <SiteChromeInner>{children}</SiteChromeInner>
    </EnquiryProvider>
  );
}
