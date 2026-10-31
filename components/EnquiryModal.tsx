"use client";

import React, { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { X, Check, Send, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import type { EnquirySeed } from "./EnquiryProvider";
import { trackContact, trackEvent } from "@/lib/analytics/track";
import { enquiryAttribution, formatEnquiryRef } from "@/lib/enquiries/submit";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-fills step 1 and shows a context pill when opened from an itinerary/accommodation page. */
  seed?: EnquirySeed | null;
}

const DESTINATION_OPTIONS = [
  "Serengeti & Ngorongoro Crater",
  "Great Migration River Crossing",
  "Kilimanjaro Summit Trek",
  "Zanzibar & Swahili Coast",
  "Tarangire & Lake Manyara",
  "Southern Circuit (Ruaha & Nyerere)",
  "Open to Specialist Advice",
];

const TRAVEL_WINDOW_OPTIONS = ["Next 3 Months", "Next 3–6 Months", "Next 6–12 Months", "Flexible"];

const PARTY_SIZE_OPTIONS = [
  "Solo Traveler",
  "Couple (2 Travelers)",
  "Small Family (3–4)",
  "Private Group (5–8)",
  "Large Expedition (8+)",
];

const ACCOMMODATION_OPTIONS = ["Luxury Tented Camps", "Crater-Rim Lodges", "Curated Mix (Bush & Coast)"];

const STEP_META: { id: 1 | 2 | 3; label: string }[] = [
  { id: 1, label: "Vision" },
  { id: 2, label: "Party" },
  { id: 3, label: "Details" },
];

const DEFAULT_VISION = {
  destinations: [] as string[],
  travelWindow: TRAVEL_WINDOW_OPTIONS[1],
};

const DEFAULT_PARTY = {
  partySize: PARTY_SIZE_OPTIONS[1],
  accommodationStyle: ACCOMMODATION_OPTIONS[0],
};

const DEFAULT_CONTACT = { name: "", email: "", phone: "", exactDates: "", budget: "", notes: "" };

/**
 * Shared enquiry modal — opened from the Navbar, fullscreen nav menu,
 * Footer, Hero, and itinerary/accommodation/destination CTAs via
 * EnquiryProvider. Rebuilt as a compact three-step wizard (rather than a
 * single dense form) to feel considered and bespoke rather than a wall of
 * fields, while staying deliberately lighter than the full /enquire studio
 * page (EnquiryStudioForm) it shares chip-selector language with.
 */
export default function EnquiryModal({ isOpen, onClose, seed }: EnquiryModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enquiryId, setEnquiryId] = useState("");

  const [vision, setVision] = useState(DEFAULT_VISION);
  const [party, setParty] = useState(DEFAULT_PARTY);
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  // Honeypot — hidden from people, filled in by naive form bots.
  const [website, setWebsite] = useState("");

  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fresh state every time the modal opens — including re-seeding from an
  // itinerary/accommodation context — rather than leaving stale input from
  // a previous, possibly-abandoned visit sitting in the fields.
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setSubmitted(false);
    setErrorMessage("");
    setVision({
      destinations: seed?.itineraryTitle ? [seed.itineraryTitle] : [],
      travelWindow: TRAVEL_WINDOW_OPTIONS[1],
    });
    setParty(DEFAULT_PARTY);
    setContact(DEFAULT_CONTACT);
    setWebsite("");
  }, [isOpen, seed?.itineraryId, seed?.itineraryTitle]);

  // Funnel analytics: how far visitors get through the wizard.
  useEffect(() => {
    if (isOpen && step > 1) trackEvent("enquiry_step", { form: "modal", step });
  }, [isOpen, step]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock the background page's scroll while the modal is open — matches
  // FullscreenNavMenu's approach — so scroll input reaches the modal's own
  // overflow-y-auto content instead of the page underneath it.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const toggleDestination = (dest: string) => {
    setVision((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter((d) => d !== dest)
        : [...prev.destinations, dest],
    }));
  };

  const handleClose = () => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const message = [
      seed?.itineraryTitle ? `Itinerary: ${seed.itineraryTitle}` : "",
      `Destinations of Interest: ${vision.destinations.join(", ") || "Open to specialist advice"}`,
      `Accommodation Style: ${party.accommodationStyle}`,
      contact.exactDates ? `Exact dates: ${contact.exactDates}` : "",
      contact.budget ? `Budget: ${contact.budget}` : "",
      contact.notes ? `Notes: ${contact.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          itineraryId: seed?.itineraryId || null,
          partySize: party.partySize,
          preferredDates: contact.exactDates ? `${contact.exactDates} (${vision.travelWindow})` : vision.travelWindow,
          message,
          website,
          ...enquiryAttribution("modal"),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.enquiryId) throw new Error(data.message || "Failed to submit enquiry");

      trackEvent("enquiry_submit", { form: "modal" });
      setEnquiryId(formatEnquiryRef(data.enquiryId));
      setSubmitted(true);
      autoCloseTimerRef.current = setTimeout(() => handleClose(), 6000);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      // Never show a confirmation for an enquiry that wasn't stored — keep
      // the guest's input in place so they can retry, and point them at
      // WhatsApp as the fallback.
      trackEvent("enquiry_error", { form: "modal" });
      setErrorMessage(
        err instanceof Error && err.message && err.message !== "Failed to fetch"
          ? err.message
          : "We couldn't send your enquiry just now. Please try again, or message us on WhatsApp at +255 789 718 505."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMeta = STEP_META[step - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-safari-tan/80 backdrop-blur-md animate-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-safari-cream border border-safari-russet/40 shadow-2xl p-6 sm:p-10 text-safari-night animate-nav-cascade">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close enquiry modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-safari-night/35 hover:border-safari-ochre flex items-center justify-center text-safari-night hover:text-safari-russet transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div>
            <Logo className="h-12 sm:h-14 mb-6" sizes="112px" />
            <div className="py-2 sm:py-4 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-safari-russet/20 border border-safari-ochre flex items-center justify-center text-safari-ochre">
                <Check className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-safari-russet block">
                  Confirmed
                </span>
                <h3 className="font-serif-luxury text-2xl font-light text-safari-night">
                  Asante Sana{contact.name ? `, ${contact.name.split(" ")[0]}` : ""}
                </h3>
                <p className="text-xs text-safari-night/85 max-w-sm mx-auto font-sans leading-relaxed">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </div>
              <div className="px-3.5 py-2 bg-safari-night/5 border border-safari-night/20 font-mono text-[11px] text-safari-russet">
                Ref: <span className="text-safari-night font-semibold">{enquiryId}</span>
              </div>
              <p className="text-[11px] text-safari-night/70 font-sans">
                Or WhatsApp{" "}
                <a href="https://wa.me/255789718505" onClick={() => trackContact("whatsapp", "enquiry-modal")} className="text-safari-russet underline hover:text-safari-night">
                  +255 789 718 505
                </a>
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="text-[11px] text-safari-night/65 hover:text-safari-night underline underline-offset-2 font-sans cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header: Logo top-left + compact step counter */}
            <div className="flex items-center justify-between mb-6 pr-10">
              <Logo className="h-12 sm:h-14 shrink-0" sizes="112px" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-safari-night/65">
                {step}/{STEP_META.length}
              </span>
            </div>

            <div className="mb-5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-safari-night font-light tracking-wide">
                Your {currentMeta.label}
              </h3>
              {seed?.itineraryTitle && (
                <p className="mt-3 px-3.5 py-2.5 border border-safari-ochre/40 bg-safari-ochre/10 text-safari-night text-sm font-sans">
                  <span className="block text-[10px] font-mono uppercase tracking-[3px] text-safari-russet mb-0.5">
                    You are enquiring about
                  </span>
                  {seed.itineraryTitle}
                </p>
              )}
            </div>

            {/* Progress Tracker */}
            <div className="flex items-center gap-1.5 mb-7">
              {STEP_META.map((s) => (
                <div key={s.id} className="flex-1 h-[3px] bg-safari-night/15 overflow-hidden">
                  <div
                    className="h-full bg-safari-ochre transition-all duration-500 ease-out"
                    style={{ width: step >= s.id ? "100%" : "0%" }}
                  />
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="p-3.5 mb-6 bg-red-100/70 border border-red-700/40 text-red-900 text-xs font-sans">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: VISION */}
            {step === 1 && (
              <div key={1} className="space-y-6 animate-sub-cascade">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-2">
                    Destinations
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DESTINATION_OPTIONS.map((dest) => {
                      const isSelected = vision.destinations.includes(dest);
                      return (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => toggleDestination(dest)}
                          className={`p-3 text-left text-xs font-sans border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-safari-ochre text-safari-night border-safari-ochre font-medium shadow-sm"
                              : "bg-safari-night/5 text-safari-night/85 border-safari-night/30 hover:border-safari-night/45 hover:text-safari-night"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{dest}</span>
                            {isSelected && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-2">
                    Travel Window
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TRAVEL_WINDOW_OPTIONS.map((window) => (
                      <button
                        key={window}
                        type="button"
                        onClick={() => setVision((prev) => ({ ...prev, travelWindow: window }))}
                        className={`p-2.5 text-xs font-sans border text-center transition-all cursor-pointer ${
                          vision.travelWindow === window
                            ? "bg-safari-night text-safari-cream border-safari-night font-medium"
                            : "bg-safari-night/5 text-safari-night/85 border-safari-night/30 hover:border-safari-night/45 hover:text-safari-night"
                        }`}
                      >
                        {window}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-safari-ochre hover:bg-safari-russet text-safari-night hover:text-white text-xs font-sans font-medium tracking-widest uppercase rounded transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PARTY */}
            {step === 2 && (
              <div key={2} className="space-y-6 animate-sub-cascade">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-2">
                    Party Size
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PARTY_SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setParty((prev) => ({ ...prev, partySize: size }))}
                        className={`p-3 text-left text-xs font-sans border transition-all cursor-pointer ${
                          party.partySize === size
                            ? "bg-safari-ochre text-safari-night border-safari-ochre font-medium shadow-sm"
                            : "bg-safari-night/5 text-safari-night/85 border-safari-night/30 hover:border-safari-night/45 hover:text-safari-night"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-2">
                    Preferred Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {ACCOMMODATION_OPTIONS.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setParty((prev) => ({ ...prev, accommodationStyle: style }))}
                        className={`p-3 text-left text-xs font-sans border transition-all cursor-pointer ${
                          party.accommodationStyle === style
                            ? "bg-safari-night text-safari-cream border-safari-night font-medium"
                            : "bg-safari-night/5 text-safari-night/85 border-safari-night/30 hover:border-safari-night/45 hover:text-safari-night"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-2 py-2.5 text-xs text-safari-night/80 hover:text-safari-night font-sans cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-safari-ochre hover:bg-safari-russet text-safari-night hover:text-white text-xs font-sans font-medium tracking-widest uppercase rounded transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <form key={3} onSubmit={handleSubmit} className="space-y-5 animate-sub-cascade">
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Leave this field empty
                    <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-modal-name" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                      Name *
                    </label>
                    <input id="enq-modal-name" autoComplete="name" maxLength={100}
                      type="text"
                      required
                      value={contact.name}
                      onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-modal-email" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                      Email *
                    </label>
                    <input id="enq-modal-email" autoComplete="email" maxLength={254}
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="safari@example.com"
                      className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enq-modal-phone-whatsapp" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input id="enq-modal-phone-whatsapp" autoComplete="tel" maxLength={40}
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-modal-exact-dates" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                      Exact Dates (Optional)
                    </label>
                    <input id="enq-modal-exact-dates" maxLength={100}
                      type="text"
                      value={contact.exactDates}
                      onChange={(e) => setContact((prev) => ({ ...prev, exactDates: e.target.value }))}
                      placeholder="e.g. 12–19 Feb 2027"
                      className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-modal-budget" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                      Budget (Optional)
                    </label>
                    <input id="enq-modal-budget" maxLength={100}
                      type="text"
                      value={contact.budget}
                      onChange={(e) => setContact((prev) => ({ ...prev, budget: e.target.value }))}
                      placeholder="e.g. USD 5,000 per person"
                      className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enq-modal-notes" className="block text-[10px] font-mono uppercase tracking-[5px] text-safari-russet mb-1.5">
                    Notes (Optional)
                  </label>
                  <textarea id="enq-modal-notes" maxLength={2000}
                    rows={2}
                    value={contact.notes}
                    onChange={(e) => setContact((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Anything else we should know…"
                    className="w-full bg-safari-night/5 border border-safari-night/30 px-3.5 py-2.5 text-sm text-safari-night placeholder-safari-night/50 focus:border-safari-ochre focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-2 py-2.5 text-xs text-safari-night/80 hover:text-safari-night font-sans cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-safari-ochre hover:bg-safari-russet disabled:opacity-60 text-safari-night hover:text-white text-xs font-sans font-semibold tracking-[0.25em] uppercase rounded transition-all cursor-pointer shadow-lg hover:shadow-[0_4px_24px_rgba(198,134,66,0.3)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Dispatching…" : "Submit Enquiry"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
