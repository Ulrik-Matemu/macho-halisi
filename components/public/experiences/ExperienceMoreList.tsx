"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface ExperienceMoreItem {
  slug: string;
  /** Position in the full experiences list, e.g. "03". */
  num: string;
  line1: string;
  line2: string;
  tagline: string;
  image: string;
}

interface ExperienceMoreListProps {
  items: ExperienceMoreItem[];
}

/**
 * "More safari experiences" — full-width rows linking to the other
 * experience pages. On hover-capable pointers a 280×360 preview of the
 * hovered experience trails the cursor; its position is written straight
 * to the element's transform (eased by a CSS transition), so only
 * entering/leaving a row re-renders.
 */
export default function ExperienceMoreList({ items }: ExperienceMoreListProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointRef = useRef({ x: 0, y: 0 });

  const place = (visible: boolean) => {
    const el = previewRef.current;
    if (!el) return;
    const { x, y } = pointRef.current;
    el.style.transform = `translate3d(${x + 36}px, ${y - 180}px, 0) scale(${visible ? 1 : 0.92})`;
  };

  return (
    <section
      className="max-w-[1240px] mx-auto px-6 sm:px-16 pt-24 sm:pt-32 pb-28 sm:pb-36"
      onMouseMove={(e) => {
        pointRef.current = { x: e.clientX, y: e.clientY };
        place(hovered !== null);
      }}
      onMouseLeave={() => {
        setHovered(null);
        place(false);
      }}
    >
      <div className="font-sans font-light text-[11px] tracking-[0.42em] text-[#8A6A33] uppercase mb-10">
        More safari experiences
      </div>
      <div className="border-t border-[#1E1913]/16">
        {items.map((item, i) => (
          <Link
            key={item.slug}
            href={`/experiences/${item.slug}`}
            onMouseEnter={() => {
              setHovered(i);
              place(true);
            }}
            onMouseLeave={() => setHovered(null)}
            className="grid grid-cols-[48px_minmax(0,1fr)_24px] sm:grid-cols-[64px_minmax(0,1fr)_minmax(0,320px)_30px] gap-x-5 sm:gap-x-7 gap-y-2 items-baseline py-7 sm:py-[34px] border-b border-[#1E1913]/12 text-[#1E1913] hover:text-[#8A6A33] transition-colors"
          >
            <span className="font-sans font-light text-xs tracking-[0.24em] text-[#8A6A33]">{item.num}</span>
            <span className="font-serif-luxury font-light text-[clamp(26px,3.4vw,48px)] leading-[1.08] tracking-[0.02em]">
              {item.line1} <em>{item.line2}</em>
            </span>
            <span className="col-start-2 row-start-2 sm:col-start-auto sm:row-start-auto font-sans font-light text-[10.5px] sm:text-[11px] tracking-[0.24em] text-[#1E1913]/70 uppercase">
              {item.tagline}
            </span>
            <span aria-hidden className="col-start-3 row-start-1 sm:col-start-auto sm:row-start-auto font-sans font-light text-lg text-right">
              →
            </span>
          </Link>
        ))}
      </div>

      <div
        ref={previewRef}
        aria-hidden
        className="hidden [@media(hover:hover)]:block fixed left-0 top-0 w-[280px] h-[360px] overflow-hidden pointer-events-none z-30 bg-[#E7DFD1] transition-[opacity,transform] duration-[350ms,500ms] ease-[ease,cubic-bezier(.22,.7,.3,1)]"
        style={{ opacity: hovered !== null ? 1 : 0, transform: "translate3d(0,0,0) scale(0.92)" }}
      >
        {items.map((item, i) => (
          <Image
            key={item.slug}
            src={item.image}
            alt=""
            fill
            sizes="280px"
            className="object-cover object-center transition-opacity duration-300"
            style={{ opacity: hovered === i ? 1 : 0 }}
          />
        ))}
      </div>
    </section>
  );
}
