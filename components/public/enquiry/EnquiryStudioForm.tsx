"use client";

import React, { useState } from "react";
import {
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Compass,
} from "lucide-react";
import EnquirySummaryCard, { EnquirySelectionState } from "./EnquirySummaryCard";

interface EnquiryStudioFormProps {
  initialDestination?: string;
  initialItineraryTitle?: string;
}

export default function EnquiryStudioForm({
  initialDestination,
  initialItineraryTitle,
}: EnquiryStudioFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [state, setState] = useState<EnquirySelectionState>({
    destinations: initialDestination
      ? [initialDestination]
      : initialItineraryTitle
      ? [initialItineraryTitle]
      : [],
    travelWindow: "Next 3–6 Months",
    tripLength: "8–10 Days",
    partySize: "Couple (2 Travelers)",
    accommodationStyle: "Luxury Canvas Tented Camps",
    specialInterests: [],
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredChannel: "WhatsApp",
    notes: "",
  });

  const toggleDestination = (dest: string) => {
    setState((prev) => {
      const exists = prev.destinations.includes(dest);
      return {
        ...prev,
        destinations: exists
          ? prev.destinations.filter((d) => d !== dest)
          : [...prev.destinations, dest],
      };
    });
  };

  const toggleInterest = (interest: string) => {
    setState((prev) => {
      const exists = prev.specialInterests.includes(interest);
      return {
        ...prev,
        specialInterests: exists
          ? prev.specialInterests.filter((i) => i !== interest)
          : [...prev.specialInterests, interest],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const messageContent = [
        `Destination Desires: ${state.destinations.join(", ") || "Open to suggestions"}`,
        `Trip Length: ${state.tripLength}`,
        `Travel Window: ${state.travelWindow}`,
        `Accommodation: ${state.accommodationStyle}`,
        `Special Interests: ${state.specialInterests.join(", ") || "None specified"}`,
        `Preferred Contact Method: ${contactData.preferredChannel}`,
        contactData.notes ? `Guest Notes: ${contactData.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        partySize: state.partySize,
        preferredDates: `${state.travelWindow} (${state.tripLength})`,
        message: messageContent,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit enquiry");
      }

      setEnquiryId(data.enquiryId || `MH-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again or reach out via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#1E1913] text-[#FBF7F0] p-8 sm:p-14 border border-[#8A6A33]/40 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#8A6A33]/20 border border-[#E3C99A] text-[#E3C99A] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3C99A] block">
            Expedition Request Confirmed
          </span>
          <h3 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light">
            Asante Sana, {contactData.name.split(" ")[0]}
          </h3>
          <p className="font-sans font-light text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
            Your safari desires have reached our primary planning desk in Karatu. A dedicated master
            naturalist will review your profile and reach out within 24 hours.
          </p>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 max-w-md mx-auto font-mono text-xs text-[#E3C99A]">
          Reference ID: <span className="text-white font-bold">{enquiryId}</span>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-white/60 font-sans">
          Prefer an immediate chat? Reach our Karatu office on WhatsApp at{" "}
          <a
            href="https://wa.me/255700000000"
            className="text-[#E3C99A] underline hover:text-white"
          >
            +255 754 474 792
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Steps Column */}
      <div className="lg:col-span-8 bg-white/80 border border-[#1E1913]/10 p-6 sm:p-10 shadow-sm">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1E1913]/10">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1E1913] text-white flex items-center justify-center font-mono text-xs">
              {step}
            </span>
            <span className="font-serif-luxury text-lg text-[#1E1913]">
              {step === 1 && "Destinations & Wildlife Vision"}
              {step === 2 && "Dates, Rhythm & Companions"}
              {step === 3 && "Accommodations & Style"}
              {step === 4 && "Contact & Direct Channels"}
            </span>
          </div>
          <span className="font-mono text-xs text-[#8A6A33]">Step {step} of 4</span>
        </div>

        {errorMessage && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: DESTINATIONS */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-[#1E1913]/70 font-sans">
              Select the ecosystems that inspire you. You may select several, or leave open for our
              specialist recommendations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                "Serengeti National Park",
                "Ngorongoro Crater",
                "Tarangire & Baobabs",
                "Mount Kilimanjaro Trek",
                "Zanzibar Archipelago",
                "Lake Manyara & Rift Valley",
                "Ruaha & Nyerere (Wild South)",
                "Great Migration River Crossing",
                "Open to Specialist Advice",
              ].map((dest) => {
                const isSelected = state.destinations.includes(dest);
                return (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => toggleDestination(dest)}
                    className={`p-3.5 text-left text-xs font-sans border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1E1913] text-[#FBF7F0] border-[#1E1913] shadow-sm font-medium"
                        : "bg-white/60 hover:bg-white text-[#1E1913] border-[#1E1913]/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{dest}</span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#E3C99A]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1913] hover:bg-[#8A6A33] text-white text-xs font-sans tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                <span>Continue to Rhythm & Timing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TIMING & PARTY */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Travel Window */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-2">
                Anticipated Travel Window
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Next 3 Months", "Next 3–6 Months", "Next 6–12 Months", "2027 / Flexible"].map(
                  (window) => (
                    <button
                      key={window}
                      type="button"
                      onClick={() => setState({ ...state, travelWindow: window })}
                      className={`p-3 text-xs font-sans border text-center transition-all cursor-pointer ${
                        state.travelWindow === window
                          ? "bg-[#1E1913] text-white border-[#1E1913] font-medium"
                          : "bg-white/60 text-[#1E1913] border-[#1E1913]/15"
                      }`}
                    >
                      {window}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Estimated Trip Duration */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-2">
                Estimated Safari Length
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["5–7 Days", "8–10 Days", "11–14 Days", "15+ Days"].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setState({ ...state, tripLength: len })}
                    className={`p-3 text-xs font-sans border text-center transition-all cursor-pointer ${
                      state.tripLength === len
                        ? "bg-[#1E1913] text-white border-[#1E1913] font-medium"
                        : "bg-white/60 text-[#1E1913] border-[#1E1913]/15"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-2">
                Party Composition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Solo Traveler",
                  "Couple (2 Travelers)",
                  "Small Family (3–4)",
                  "Private Group (5–8)",
                  "Multi-Generational Expedition (8+)",
                ].map((party) => (
                  <button
                    key={party}
                    type="button"
                    onClick={() => setState({ ...state, partySize: party })}
                    className={`p-3 text-xs font-sans border text-left transition-all cursor-pointer ${
                      state.partySize === party
                        ? "bg-[#1E1913] text-white border-[#1E1913] font-medium"
                        : "bg-white/60 text-[#1E1913] border-[#1E1913]/15"
                    }`}
                  >
                    {party}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E1913]/70 hover:text-[#1E1913] font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1913] hover:bg-[#8A6A33] text-white text-xs font-sans tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                <span>Continue to Style & Tastes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACCOMMODATION & INTERESTS */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-2">
                Preferred Lodging Character
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: "Luxury Canvas Tented Camps",
                    desc: "Intimate, handcrafted canvas under the stars with en-suite showers & butler service.",
                  },
                  {
                    name: "Crater Rim & Permanent Lodges",
                    desc: "Stone lodges perched high on volcanic calderas with panoramic picture windows & log fires.",
                  },
                  {
                    name: "Curated Mix (Bush & Coast Villas)",
                    desc: "A combination of wild mobile safari camps followed by beachfront private ocean villas.",
                  },
                ].map((style) => (
                  <button
                    key={style.name}
                    type="button"
                    onClick={() => setState({ ...state, accommodationStyle: style.name })}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      state.accommodationStyle === style.name
                        ? "bg-[#1E1913] text-[#FBF7F0] border-[#1E1913] shadow-md"
                        : "bg-white/60 hover:bg-white text-[#1E1913] border-[#1E1913]/15"
                    }`}
                  >
                    <div className="font-serif-luxury text-sm font-medium mb-1">{style.name}</div>
                    <div className="font-sans text-xs opacity-75 leading-relaxed">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-2">
                Special Desires & Experiences
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hot Air Balloon Safari",
                  "Guided Walking Bush Safaris",
                  "Fine-Art Wildlife Photography",
                  "Authentic Maasai Cultural Boma",
                  "Honeymoon / Milestone Celebration",
                  "Bird Watching Focus",
                  "Zanzibar Spice Tour",
                  "Whale Shark Swimming (Mafia)",
                ].map((interest) => {
                  const isSelected = state.specialInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded text-xs font-sans border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#8A6A33] text-white border-[#8A6A33]"
                          : "bg-white/60 text-[#1E1913] border-[#1E1913]/15 hover:bg-white"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E1913]/70 hover:text-[#1E1913] font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1913] hover:bg-[#8A6A33] text-white text-xs font-sans tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                <span>Final Step: Contact Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT & SUBMIT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  placeholder="e.g. Lord / Dr / Eleanor Vance"
                  className="w-full bg-white border border-[#1E1913]/15 px-3.5 py-2.5 text-sm text-[#1E1913] placeholder-[#1E1913]/30 focus:border-[#8A6A33] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="e.g. eleanor@example.com"
                  className="w-full bg-white border border-[#1E1913]/15 px-3.5 py-2.5 text-sm text-[#1E1913] placeholder-[#1E1913]/30 focus:border-[#8A6A33] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-1">
                  Phone or WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full bg-white border border-[#1E1913]/15 px-3.5 py-2.5 text-sm text-[#1E1913] placeholder-[#1E1913]/30 focus:border-[#8A6A33] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-1">
                  Preferred Contact Channel
                </label>
                <select
                  value={contactData.preferredChannel}
                  onChange={(e) =>
                    setContactData({ ...contactData, preferredChannel: e.target.value })
                  }
                  className="w-full bg-white border border-[#1E1913]/15 px-3.5 py-2.5 text-sm text-[#1E1913] focus:border-[#8A6A33] focus:outline-none"
                >
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Email">Detailed Email</option>
                  <option value="Phone Call">Direct Phone Call</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A6A33] mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={contactData.notes}
                onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                placeholder="Specific wildlife desires, dietary requirements, flight schedule, or celebrations..."
                className="w-full bg-white border border-[#1E1913]/15 p-3 text-sm text-[#1E1913] placeholder-[#1E1913]/30 focus:border-[#8A6A33] focus:outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#1E1913]/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E1913]/70 hover:text-[#1E1913] font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#8A6A33] hover:bg-[#A37E3E] disabled:opacity-60 text-white text-xs font-sans tracking-widest uppercase rounded shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Dispatching to Karatu…" : "Submit Expedition Blueprint"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Real-time Summary Card (Sticky Desktop) */}
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        <EnquirySummaryCard state={state} />
      </div>
    </div>
  );
}
