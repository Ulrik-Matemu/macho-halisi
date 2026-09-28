"use client";

import React, { useEffect, useState, useRef } from "react";
import { Printer, ShieldCheck, FileText, ArrowUp } from "lucide-react";
import { LegalDocument } from "@/data/legalData";

interface LegalPageShellProps {
  document: LegalDocument;
}

export default function LegalPageShell({ document }: LegalPageShellProps) {
  const [activeSectionId, setActiveSectionId] = useState(document.sections[0]?.id ?? "");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = window.document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Active TOC tracking
      const scrollPos = window.scrollY + 200;
      for (let i = document.sections.length - 1; i >= 0; i--) {
        const sec = document.sections[i];
        const el = window.document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [document.sections]);

  const scrollTo = (id: string) => {
    const el = window.document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Top Reading Progress Line */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-[#8A6A33] z-50 pointer-events-none transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="bg-[#F6F2EA] text-[#1E1913] pt-28 sm:pt-36 pb-20 sm:pb-32 min-h-screen">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="pb-10 mb-12 border-b border-[#1E1913]/10">
            <div className="flex items-center gap-2 text-xs font-sans font-light tracking-[0.25em] text-[#8A6A33] uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>{document.eyebrow}</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-[#1E1913] tracking-[0.02em]">
              {document.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-[#1E1913]/60">
              <span>Last Revised: {document.lastUpdated}</span>
              <span>•</span>
              <span>Tanzania Licensed Tour Operator (TALA)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Sticky Sidebar (TOC & In-Brief Cards) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white/80 border border-[#1E1913]/10 rounded-xl p-6 shadow-sm">
                <div className="font-mono text-xs uppercase tracking-widest text-[#8A6A33] mb-4">
                  Document Index
                </div>
                <nav className="space-y-1">
                  {document.sections.map((sec) => {
                    const isActive = sec.id === activeSectionId;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollTo(sec.id)}
                        className={`w-full text-left py-2 px-3 rounded text-xs font-sans transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1E1913] text-[#FBF7F0] font-medium"
                            : "text-[#1E1913]/70 hover:text-[#1E1913] hover:bg-black/5"
                        }`}
                      >
                        {sec.shortTitle}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-4 mt-4 border-t border-[#1E1913]/10">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded border border-[#1E1913]/20 hover:bg-white text-xs font-sans text-[#1E1913] transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#8A6A33]" />
                    <span>Print or Save PDF</span>
                  </button>
                </div>
              </div>

              {/* In-Brief Summary Cards */}
              <div className="bg-[#1E1913] text-[#FBF7F0] rounded-xl p-6 border border-[#8A6A33]/30 shadow-md space-y-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#E3C99A]">
                  Key Principles in Brief
                </div>
                <div className="space-y-3.5 text-xs font-sans">
                  {document.inBrief.map((item) => (
                    <div key={item.title} className="space-y-1">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E3C99A]" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-white/70 text-[11px] leading-relaxed pl-3">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Main Content */}
            <main className="lg:col-span-8 bg-white/70 border border-[#1E1913]/10 rounded-xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-10">
              {/* Lead Paragraph */}
              <div className="pb-8 border-b border-[#1E1913]/10">
                <p className="font-serif-luxury text-lg sm:text-xl font-light text-[#1E1913] leading-relaxed">
                  {document.leadParagraph}
                </p>
              </div>

              {/* Document Sections */}
              <div className="space-y-12">
                {document.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 space-y-4 pb-8 border-b border-[#1E1913]/10 last:border-b-0"
                  >
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1E1913] font-light">
                      {section.title}
                    </h2>

                    <div className="space-y-3 text-sm sm:text-[15px] font-sans font-light text-[#1E1913]/85 leading-relaxed">
                      {section.content.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    {section.subsections && (
                      <div className="space-y-4 pt-3 pl-4 border-l-2 border-[#8A6A33]/40">
                        {section.subsections.map((sub, sIdx) => (
                          <div key={sIdx} className="space-y-1.5">
                            <h3 className="font-serif-luxury text-lg text-[#1E1913]">
                              {sub.subtitle}
                            </h3>
                            {sub.text.map((t, tIdx) => (
                              <p
                                key={tIdx}
                                className="text-xs sm:text-sm font-sans font-light text-[#1E1913]/75 leading-relaxed"
                              >
                                {t}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
