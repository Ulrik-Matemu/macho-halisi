"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Calendar, Users, MapPin, Send } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "Serengeti & Ngorongoro Crater",
    guests: "2 Travelers",
    travelWindow: "Next 3-6 Months",
    notes: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#111111] border border-[#8d5524]/40 rounded-xl shadow-2xl p-6 sm:p-10 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close enquiry modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 hover:border-[#c68642] flex items-center justify-center text-white hover:text-[#e0ac69] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#8d5524]/20 border border-[#c68642] flex items-center justify-center text-[#c68642]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-3xl font-light text-white tracking-wide">
              Safari Request Received
            </h3>
            <p className="text-xs sm:text-sm text-white/75 max-w-md font-sans leading-relaxed">
              Asante sana. A dedicated Macho Halisi safari naturalist will review
              your itinerary desires and connect with you within 24 hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#f1c27d] block mb-1">
                TAILOR-MADE EXPEDITIONS
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide">
                Begin Your Journey With Macho Halisi
              </h3>
              <p className="text-xs text-white/60 font-sans mt-1">
                Tell us your vision and our native safari specialists will craft
                a bespoke Tanzanian itinerary.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Lord / Lady / Dr / Mr / Ms"
                    className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white placeholder-white/30 focus:border-[#c68642] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="safari@example.com"
                    className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white placeholder-white/30 focus:border-[#c68642] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px]">
                    Phone or WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white placeholder-white/30 focus:border-[#c68642] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#e0ac69]" /> Destination of Interest
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full bg-[#1A1A1A] border border-white/15 rounded px-3 py-2.5 text-white focus:border-[#c68642] focus:outline-none transition-colors"
                  >
                    <option value="Serengeti & Ngorongoro Crater">
                      Serengeti & Ngorongoro Crater
                    </option>
                    <option value="Great Migration River Trail">
                      Great Migration River Trail
                    </option>
                    <option value="Mount Kilimanjaro Summit Trek">
                      Mount Kilimanjaro Summit Trek
                    </option>
                    <option value="Safari & Zanzibar Beach Escape">
                      Safari & Zanzibar Beach Escape
                    </option>
                    <option value="Southern Circuit (Ruaha & Nyerere)">
                      Southern Circuit (Ruaha & Nyerere)
                    </option>
                    <option value="Bespoke Private Expedition">
                      Bespoke Private Expedition
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#e0ac69]" /> Party Size
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="w-full bg-[#1A1A1A] border border-white/15 rounded px-3 py-2.5 text-white focus:border-[#c68642] focus:outline-none transition-colors"
                  >
                    <option value="Solo Traveler">Solo Traveler</option>
                    <option value="Couple (2 Travelers)">Couple (2 Travelers)</option>
                    <option value="Small Family (3-4)">Small Family (3-4)</option>
                    <option value="Private Group (5-8)">Private Group (5-8)</option>
                    <option value="Large Expedition (8+)">Large Expedition (8+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#e0ac69]" /> Anticipated Dates
                  </label>
                  <select
                    value={formData.travelWindow}
                    onChange={(e) =>
                      setFormData({ ...formData, travelWindow: e.target.value })
                    }
                    className="w-full bg-[#1A1A1A] border border-white/15 rounded px-3 py-2.5 text-white focus:border-[#c68642] focus:outline-none transition-colors"
                  >
                    <option value="Next 3 Months">Next 3 Months</option>
                    <option value="Next 3-6 Months">Next 3-6 Months</option>
                    <option value="Next 6-12 Months">Next 6-12 Months</option>
                    <option value="Next Year / Flexible">Next Year / Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium tracking-wider uppercase text-[10px]">
                  Special Requests or Desired Wildlife Encounters
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="e.g. River crossing dates, hot air balloon flight, luxury tented preference, dietary requirements..."
                  className="w-full bg-white/5 border border-white/15 rounded px-3 py-2 text-white placeholder-white/30 focus:border-[#c68642] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] text-xs font-semibold tracking-[0.25em] uppercase rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_4px_24px_rgba(198,134,66,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  SUBMIT EXPEDITION ENQUIRY
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
