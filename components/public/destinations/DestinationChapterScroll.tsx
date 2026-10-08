"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { DestinationChapter } from "@/data/destinations";

interface DestinationChapterScrollProps {
  eyebrow: string;
  chapters: DestinationChapter[];
  /** Which side the sticky image panel sits on at desktop widths. */
  imageSide: "left" | "right";
}

/**
 * Sticky image panel that crossfades between chapters as the visitor
 * scrolls past the matching text block, with a thin per-chapter progress
 * indicator beneath it. Uses IntersectionObserver to track which block is
 * active — the same primitive ScrollReveal already relies on elsewhere in
 * this codebase — rather than a manual scroll-position poll.
 */
export default function DestinationChapterScroll({
  eyebrow,
  chapters,
  imageSide,
}: DestinationChapterScrollProps) {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = blockRefs.current.findIndex((el) => el === entry.target);
          if (idx !== -1) setActive(idx);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    blockRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [chapters.length]);

  const imagePanel = (
    <div className="lg:sticky lg:top-24">
      <div className="relative w-full h-[420px] sm:h-[560px] lg:h-[calc(100vh-200px)] lg:min-h-[360px] lg:max-h-[760px] overflow-hidden bg-safari-champagne">
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.title}
            className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ opacity: active === idx ? 1 : 0 }}
          >
            <Image
              src={chapter.image.url}
              alt={chapter.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute left-6 bottom-5 font-sans font-light text-[10.5px] tracking-[0.3em] text-safari-cream uppercase [text-shadow:0_1px_12px_rgba(18,11,6,0.7)]">
          {chapters[active]?.title}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {chapters.map((chapter, idx) => (
          <span
            key={chapter.title}
            className="flex-1 h-[2px] transition-colors duration-500"
            style={{ background: active === idx ? "#8d5524" : "rgba(30,18,9,0.16)" }}
          />
        ))}
      </div>
    </div>
  );

  const textPanel = (
    <div className="flex flex-col">
      {chapters.map((chapter, idx) => (
        <div
          key={chapter.title}
          ref={(el) => {
            blockRefs.current[idx] = el;
          }}
          className="min-h-[60vh] lg:min-h-[78vh] flex flex-col justify-center py-10"
        >
          <div className="font-sans font-light text-[11px] tracking-[0.42em] text-safari-russet uppercase mb-5">
            {eyebrow} · {String(idx + 1)}
          </div>
          <h3 className="font-serif-luxury font-light text-3xl sm:text-4xl leading-[1.14] tracking-[0.03em] text-safari-bark mb-5">
            {chapter.title}
          </h3>
          <p className="font-sans font-light text-[15.5px] leading-[2.05] text-safari-bark/68 max-w-[520px]">
            {chapter.text}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
      {imageSide === "left" ? (
        <>
          {imagePanel}
          {textPanel}
        </>
      ) : (
        <>
          <div className="lg:order-2">{imagePanel}</div>
          <div className="lg:order-1">{textPanel}</div>
        </>
      )}
    </div>
  );
}
