"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FullscreenNavMenu from "../components/FullscreenNavMenu";
import EnquiryModal from "../components/EnquiryModal";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Reveal navbar upon first cursor movement, touch, or scroll AFTER loading finishes
    const handleUserInteraction = () => {
      setIsNavbarVisible(true);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };

    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    // Fallback timer: reveal after 4s if user doesn't move mouse
    const fallbackTimer = setTimeout(() => {
      setIsNavbarVisible(true);
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, [isLoaded]);

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#8d5524] selection:text-[#ffdbac]">
      {/* Luxury Loading Screen with Cheetah Eyes Reveal */}
      <LoadingScreen
        isReady={isVideoReady}
        onComplete={() => setIsLoaded(true)}
      />

      {/* Top Navbar with Cursor-Triggered Reveal */}
      <Navbar
        isVisible={isNavbarVisible}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* Multi-Video Looping Hero Section */}
      <Hero
        isLoaded={isLoaded}
        onVideoReady={() => setIsVideoReady(true)}
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
