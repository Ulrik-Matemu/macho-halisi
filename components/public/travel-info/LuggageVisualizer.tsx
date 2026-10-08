"use client";

import React from "react";
import { Check, X, Plane, AlertTriangle } from "lucide-react";

export default function LuggageVisualizer() {
  return (
    <section id="luggage" className="py-16 sm:py-24 border-b border-safari-bark/10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-safari-russet uppercase mb-2">
          <Plane className="w-3.5 h-3.5 text-safari-gold" />
          <span>Aviation Regulations</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-safari-bark">
          Bush Flight Luggage Rules (15 kg / 33 lbs)
        </h2>
        <p className="text-sm text-safari-bark/70 font-sans mt-2 max-w-2xl leading-relaxed">
          Why your safari bag must be soft-sided without rigid internal frames or wheels, and how to pack
          effortlessly within internal aviation constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Approved Soft Duffel Card */}
        <div className="bg-safari-bark text-safari-cream p-6 sm:p-8 border border-safari-russet/40 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="font-serif-luxury text-lg text-white">
                  Permitted: Soft-Sided Duffel Bag
                </div>
              </div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                100% Accepted
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-white/80 font-sans font-light">
              <p className="leading-relaxed">
                Light aircraft such as the Cessna Grand Caravan 208B store passenger luggage in narrow,
                contoured belly pods underneath the aircraft. Bags must be squeezed into tight spaces.
              </p>

              <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-wider text-safari-sand">
                  Specification Standards:
                </div>
                <ul className="space-y-1.5 text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="text-safari-sand">•</span> Max dimensions: 60 x 35 x 30 cm (24 x 14 x 12 in)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-safari-sand">•</span> Max total weight: 15 kg (33 lbs) incl. hand luggage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-safari-sand">•</span> Material: Heavy canvas, cordura, or soft ballistic nylon
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-safari-sand font-mono">
            Complimentary laundry service is provided daily at all Macho Halisi luxury camps.
          </div>
        </div>

        {/* Prohibited Hard Suitcase Card */}
        <div className="bg-[#EAE4D7]/70 border border-safari-bark/15 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-safari-bark/10 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="font-serif-luxury text-lg text-safari-bark">
                  Prohibited: Hard-Shell Suitcases
                </div>
              </div>
              <span className="font-mono text-xs text-red-600 uppercase tracking-wider">
                Refused at Gate
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-safari-bark/80 font-sans font-light">
              <p className="leading-relaxed">
                Rigid hardshell suitcases (including Rimowa, Samsonite hardside, and rigid-framed
                roller bags) physically cannot pass through the narrow access doors of bush aircraft pods.
              </p>

              <div className="p-4 bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-sans font-medium text-xs text-amber-900 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Luggage Storage Solution
                </div>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  Traveling with hard suitcases internationally? You may leave your large hard luggage
                  in Macho Halisi&apos;s secure Arusha/Karatu storage facility, transferring your safari items
                  into a complimentary duffel bag provided upon arrival.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-safari-bark/10 text-xs text-safari-russet font-sans">
            Need an extra freight seat for professional camera gear? We can charter extra payload capacity.
          </div>
        </div>
      </div>
    </section>
  );
}
