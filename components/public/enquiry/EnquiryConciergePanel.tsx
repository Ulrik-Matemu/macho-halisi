"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { trackContact } from "@/lib/analytics/track";

export default function EnquiryConciergePanel() {
  return (
    <div className="space-y-8">
      {/* Specialist Director Card */}
      <div className="bg-white/80 border border-safari-bark/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-safari-russet/40 bg-safari-champagne shrink-0">
            <Image
              src="/media/about/team/guide-welcome.jpg"
              alt="A Macho Halisi safari specialist"
              fill
              className="object-cover object-center"
            />
          </div>
          <div>
            <div className="font-serif-luxury text-lg text-safari-bark">
              Elibariki M.
            </div>
            <div className="font-sans text-xs text-safari-russet uppercase tracking-wider">
              Head of Safari Planning · Karatu, Tanzania
            </div>
          </div>
        </div>

        <p className="font-serif-luxury italic text-sm text-safari-bark/80 leading-relaxed border-t border-safari-bark/10 pt-4">
          &ldquo;When you enquire with Macho Halisi, you are not writing to a robotic call center. You are
          speaking directly to native Tanzanian naturalists who were born in these landscapes.&rdquo;
        </p>
      </div>

      {/* What Happens Next Timeline */}
      <div className="bg-safari-bark text-safari-cream p-6 sm:p-8 border border-safari-russet/30 shadow-lg space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-safari-sand">
          <Clock className="w-3.5 h-3.5" />
          <span>What Happens After You Inquire</span>
        </div>

        <div className="space-y-5 text-xs font-sans">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-safari-russet text-white flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
              1
            </span>
            <div>
              <div className="font-medium text-white text-sm">
                24-Hour Review by a Lead Naturalist
              </div>
              <p className="text-white/70 mt-0.5 leading-relaxed">
                Your desires are analyzed against real-time herd locations, weather cycles, and boutique camp availability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-safari-russet text-white flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
              2
            </span>
            <div>
              <div className="font-medium text-white text-sm">
                Tailor-Made Route Proposal
              </div>
              <p className="text-white/70 mt-0.5 leading-relaxed">
                You receive a day-by-day bespoke blueprint, including flight connections, private vehicle specs, and exact transparent pricing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-safari-russet text-white flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
              3
            </span>
            <div>
              <div className="font-medium text-white text-sm">
                Refinement & Private Guide Lock
              </div>
              <p className="text-white/70 mt-0.5 leading-relaxed">
                We adjust camps and pacing until your safari is perfect, securing your dates and assigning your dedicated naturalist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact Options */}
      <div className="bg-white/70 border border-safari-bark/10 p-6 space-y-4">
        <div className="font-mono text-xs text-safari-russet uppercase tracking-wider">
          Direct Specialist Concierge:
        </div>

        <div className="space-y-3 font-sans text-xs">
          <a
            href="https://wa.me/255754474792"
            onClick={() => trackContact("whatsapp", "enquire-page")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-medium">Direct WhatsApp Line</div>
              <div className="text-[11px] text-emerald-800">+255 754 474 792</div>
            </div>
          </a>

          <a
            href="tel:+255754474792"
            onClick={() => trackContact("phone", "enquire-page")}
            className="flex items-center gap-3 p-3 bg-black/5 hover:bg-black/10 text-safari-bark transition-colors"
          >
            <Phone className="w-4 h-4 text-safari-russet" />
            <div>
              <div className="font-medium">Direct Karatu Office</div>
              <div className="text-[11px] text-safari-bark/70">Mon – Sat · 08:00 – 18:00 EAT</div>
            </div>
          </a>

          <a
            href="mailto:info@machohalisi.com"
            onClick={() => trackContact("email", "enquire-page")}
            className="flex items-center gap-3 p-3 bg-black/5 hover:bg-black/10 text-safari-bark transition-colors"
          >
            <Mail className="w-4 h-4 text-safari-russet" />
            <div>
              <div className="font-medium">Email the Directors</div>
              <div className="text-[11px] text-safari-bark/70">info@machohalisi.com</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
