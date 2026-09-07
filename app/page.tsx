"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FullscreenNavMenu from "../components/FullscreenNavMenu";
import EnquiryModal from "../components/EnquiryModal";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#8d5524] selection:text-[#ffdbac]">
      {/* Top Navbar */}
      <Navbar
        isVisible={true}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* Multi-Video Looping Hero Section with Scroll Storytelling */}
      <Hero
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* Fullscreen 3-Column Luxury Navigation Menu */}
      <FullscreenNavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* Safari Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </main>
  );
}
