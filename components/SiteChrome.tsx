"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import Navbar from "./Navbar";
import FullscreenNavMenu from "./FullscreenNavMenu";
import EnquiryModal from "./EnquiryModal";
import { EnquiryProvider, useEnquiry } from "./EnquiryProvider";

interface NavbarVisibilityContextValue {
  setNavbarVisible: (visible: boolean) => void;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextValue | null>(null);

/**
 * Lets a page-level client island — e.g. the itinerary detail page's own
 * sticky contextual bar, which takes over the price/Enquire role once the
 * hero scrolls past — hide the global Navbar and show it again, without
 * every other page needing to know this exists. Nothing calls this outside
 * pages that opt in, so the Navbar defaults to visible everywhere else.
 */
export function useNavbarVisibility(): NavbarVisibilityContextValue {
  const ctx = useContext(NavbarVisibilityContext);
  if (!ctx) {
    throw new Error("useNavbarVisibility() must be called within a <SiteChrome>");
  }
  return ctx;
}

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
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { isOpen: isEnquiryOpen, openEnquiry, closeEnquiry } = useEnquiry();

  const navbarVisibilityValue = useMemo(
    () => ({ setNavbarVisible: setIsNavbarVisible }),
    []
  );

  return (
    <NavbarVisibilityContext.Provider value={navbarVisibilityValue}>
      <main className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#8d5524] selection:text-[#ffdbac]">
        <Navbar
          isVisible={isNavbarVisible}
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
    </NavbarVisibilityContext.Provider>
  );
}

export default function SiteChrome({ children }: { children?: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <SiteChromeInner>{children}</SiteChromeInner>
    </EnquiryProvider>
  );
}
