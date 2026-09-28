"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ExperienceImage } from "@/data/experiences";

interface ExperienceMaskImageProps {
  image: ExperienceImage;
  sizes: string;
}

/**
 * Image that unmasks top-to-bottom (clip-path) while settling from 1.08x,
 * once it scrolls 14% above the bottom of the viewport — the design's
 * `[data-mask]` effect. Opens once and stays open; reduced motion skips
 * the transition entirely.
 */
export default function ExperienceMaskImage({ image, sizes }: ExperienceMaskImageProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Observe the (unclipped) parent: a target fully hidden by its own
    // clip-path has no visible area, so it would never count as intersecting.
    const el = ref.current?.parentElement;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -14% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`absolute inset-0 block motion-safe:transition-[clip-path,scale] motion-safe:duration-[1250ms,1600ms] motion-safe:ease-[cubic-bezier(.22,.7,.3,1)] ${
        open ? "[clip-path:inset(0_0_0_0)] scale-100" : "motion-safe:[clip-path:inset(0_0_100%_0)] motion-safe:scale-[1.08]"
      }`}
    >
      <Image src={image.url} alt={image.alt} fill sizes={sizes} className="object-cover object-center" />
    </span>
  );
}
