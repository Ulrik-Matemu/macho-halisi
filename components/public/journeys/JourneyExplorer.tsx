"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useNavbarVisibility } from "@/components/SiteChrome";
import { useEnquiry } from "@/components/EnquiryProvider";
import ExperienceMaskImage from "@/components/public/experiences/ExperienceMaskImage";
import type { Journey, JourneyCollection } from "@/data/journeys";

type JourneyExplorerProps = Pick<JourneyCollection, "items" | "unit" | "facetLabel">;

type LengthBucket = "all" | "short" | "mid" | "long";
type View = "index" | "gallery";

const PER_PAGE = 8;
const SORTS = ["Recommended", "Shortest first", "Longest first", "Price, low to high"] as const;
const LENGTH_BUCKETS: LengthBucket[] = ["all", "short", "mid", "long"];

const pad = (n: number) => String(n).padStart(2, "0");
const formatPrice = (p: number | null) => (p == null ? "On request" : `$${p.toLocaleString("en-US")}`);

const chip = (active: boolean) =>
  `border-b transition-colors duration-300 cursor-pointer ${
    active ? "text-[#1E1913] border-[#8A6A33]" : "text-[#1E1913]/55 border-transparent hover:text-[#1E1913]"
  }`;

const LABEL = "font-sans font-light text-[10px] tracking-[0.3em] text-[#1E1913]/70 uppercase";

interface Row extends Journey {
  /** Position in the collection's recommended order, 0-based. */
  i: number;
}

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** A journey opens its itinerary page when it has one, else the enquiry modal. */
function JourneyLink({
  row,
  onEnquire,
  className,
  id,
  children,
}: {
  row: Row;
  onEnquire: () => void;
  className: string;
  id?: string;
  children: React.ReactNode;
}) {
  return row.itinerarySlug ? (
    <Link id={id} href={`/itineraries/${row.itinerarySlug}`} className={className}>
      {children}
    </Link>
  ) : (
    <button id={id} type="button" onClick={onEnquire} className={`${className} w-full text-left cursor-pointer`}>
      {children}
    </button>
  );
}


/**
 * The collection's journey list — ported from the design's renderVals():
 * length buckets (thirds of the collection's own range), a facet filter,
 * a cycling sort, Index/Gallery views and pagination. The sticky filter bar
 * hides the site Navbar while it is pinned so the two never stack.
 */
export default function JourneyExplorer({ items, unit, facetLabel }: JourneyExplorerProps) {
  const { setNavbarVisible } = useNavbarVisibility();
  const { openEnquiry } = useEnquiry();

  const [len, setLen] = useState<LengthBucket>("all");
  const [facet, setFacet] = useState("all");
  const [sort, setSort] = useState(0);
  const [view, setView] = useState<View>("index");
  const [page, setPage] = useState(1);
  const [grow, setGrow] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const growTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Bars grow in the first time the list scrolls into view…
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(growTimer.current), []);

  // Hide the global Navbar while the filter bar is pinned to the top.
  useEffect(() => {
    let pinned = false;
    const onScroll = () => {
      const section = sectionRef.current;
      const bar = barRef.current;
      if (!section || !bar) return;
      const rect = section.getBoundingClientRect();
      const next = rect.top <= 0 && rect.bottom > bar.offsetHeight;
      if (next !== pinned) {
        pinned = next;
        setNavbarVisible(!next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  /** …and regrow from zero after every filter, sort, view or page change. */
  const regrow = () => {
    setGrow(false);
    clearTimeout(growTimer.current);
    growTimer.current = setTimeout(() => setGrow(true), 60);
  };

  const scrollToList = () => {
    requestAnimationFrame(() => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > top) window.scrollTo({ top });
    });
  };

  const { hi, t1, t2 } = useMemo(() => {
    const lens = items.map((i) => i.length);
    const lo = Math.min(...lens);
    const hi = Math.max(...lens);
    return { hi, t1: lo + (hi - lo) / 3, t2: lo + ((hi - lo) * 2) / 3 };
  }, [items]);

  const bucketOf = (l: number): LengthBucket => (l <= t1 ? "short" : l <= t2 ? "mid" : "long");
  const bucketLabel: Record<LengthBucket, string> = {
    all: "All",
    short: `Up to ${Math.floor(t1)}${unit === "hours" ? " hrs" : " days"}`,
    mid: `${Math.floor(t1) + 1} – ${Math.floor(t2)}`,
    long: `${Math.floor(t2) + 1}+`,
  };
  const facets = useMemo(() => [...new Set(items.map((i) => i.facet))], [items]);

  let rows: Row[] = items.map((it, i) => ({ ...it, i }));
  if (len !== "all") rows = rows.filter((r) => bucketOf(r.length) === len);
  if (facet !== "all") rows = rows.filter((r) => r.facet === facet);
  const priceKey = (p: number | null) => (p == null ? Infinity : p);
  if (sort === 1) rows.sort((a, b) => a.length - b.length);
  if (sort === 2) rows.sort((a, b) => b.length - a.length);
  if (sort === 3) rows.sort((a, b) => priceKey(a.price) - priceKey(b.price));

  const pagesN = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pagesN);
  const slice = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const from = rows.length ? (current - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(rows.length, current * PER_PAGE);

  const axisMax = unit === "hours" ? Math.max(8, hi) : Math.max(10, hi);
  const step = axisMax > 12 ? 2 : 1;
  const ticks: number[] = [];
  for (let d = step; d <= axisMax; d += step) ticks.push(d);

  const filtered = len !== "all" || facet !== "all";
  const lengthLabel = (l: number) => `${l}${unit === "hours" ? " hrs" : l === 1 ? " day" : " days"}`;

  const change = (fn: () => void, scroll = false) => {
    fn();
    regrow();
    if (scroll) scrollToList();
  };
  const clear = () =>
    change(() => {
      setLen("all");
      setFacet("all");
      setPage(1);
    });
  const goToPage = (p: number) => change(() => setPage(p), true);

  return (
    <section ref={sectionRef} className="mt-20 sm:mt-[110px]">
      <div
        ref={barRef}
        className="sticky top-0 z-40 bg-[rgba(246,242,234,.94)] backdrop-blur-[10px] border-b border-[#1E1913]/[0.12]"
      >
        <div className="max-w-[1340px] mx-auto px-6 sm:px-16 py-[18px] flex flex-wrap items-center justify-between gap-x-7 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-[34px] gap-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className={LABEL}>Length</span>
              {LENGTH_BUCKETS.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={len === k}
                  onClick={() =>
                    change(() => {
                      setLen(k);
                      setPage(1);
                    })
                  }
                  className={`py-[5px] font-sans font-light text-[13px] tracking-[0.06em] ${chip(len === k)}`}
                >
                  {bucketLabel[k]}
                </button>
              ))}
            </div>
            <span className="hidden sm:block w-px h-[18px] bg-[#1E1913]/[0.18]" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className={LABEL}>{facetLabel}</span>
              {["all", ...facets].map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={facet === k}
                  onClick={() =>
                    change(() => {
                      setFacet(k);
                      setPage(1);
                    })
                  }
                  className={`py-[5px] font-sans font-light text-[13px] tracking-[0.06em] ${chip(facet === k)}`}
                >
                  {k === "all" ? "All" : k}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-[26px] gap-y-2">
            <button
              type="button"
              onClick={() =>
                change(() => {
                  setSort((s) => (s + 1) % SORTS.length);
                  setPage(1);
                })
              }
              className="py-[5px] font-sans font-light text-[10.5px] tracking-[0.26em] uppercase text-[#1E1913] cursor-pointer"
            >
              Sort · <span className="text-[#8A6A33]">{SORTS[sort]}</span>
            </button>
            <span className="w-px h-[18px] bg-[#1E1913]/[0.18]" />
            <div className="flex gap-4">
              {(["index", "gallery"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => change(() => setView(v))}
                  className={`py-[5px] font-sans font-light text-[10.5px] tracking-[0.26em] uppercase ${chip(view === v)}`}
                >
                  {v === "index" ? "Index" : "Gallery"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={listRef} className="max-w-[1340px] mx-auto px-6 sm:px-16 pt-11">
        <div className="flex items-baseline justify-between gap-6 mb-[26px]">
          <span className="font-sans font-light text-[11px] tracking-[0.28em] text-[#1E1913]/70 uppercase">
            {rows.length ? `Showing ${pad(from)} – ${pad(to)} of ${pad(rows.length)} journeys` : "No journeys"}
          </span>
          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="font-sans font-light text-[10.5px] tracking-[0.26em] text-[#8A6A33] uppercase cursor-pointer hover:text-[#1E1913] transition-colors"
            >
              Clear filters ×
            </button>
          )}
        </div>

        {rows.length === 0 && (
          <div className="py-[110px] text-center border-t border-[#1E1913]/[0.16]">
            <p className="m-0 mb-[22px] font-serif-luxury font-light italic text-[32px] text-[#1E1913]">
              Nothing quite matches that.
            </p>
            <button
              type="button"
              onClick={clear}
              className="font-sans font-light text-[11px] tracking-[0.3em] text-[#8A6A33] uppercase cursor-pointer hover:text-[#1E1913] transition-colors"
            >
              Show all journeys
            </button>
          </div>
        )}

        {view === "index" && rows.length > 0 && (
          <div>
            <div className="hidden md:grid grid-cols-[56px_minmax(0,1fr)_minmax(0,1.25fr)_150px_24px] gap-9 items-end pb-3.5 border-b border-[#1E1913]/20">
              <span className={LABEL}>No.</span>
              <span className={LABEL}>Journey</span>
              <div className="relative h-[30px]">
                <span className={`absolute left-0 top-0 ${LABEL}`}>Length in {unit}, to scale</span>
                {ticks.map((d) => (
                  <span
                    key={d}
                    className="absolute bottom-0 -translate-x-1/2 font-sans font-light text-[10px] text-[#1E1913]/60"
                    style={{ left: `${((d / axisMax) * 100).toFixed(2)}%` }}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <span className={`${LABEL} text-right`}>From</span>
              <span />
            </div>

            {slice.map((r, k) => {
              const barW = grow ? `${((r.length / axisMax) * 100).toFixed(2)}%` : "0%";
              const delay = grow ? `${(k * 0.06).toFixed(2)}s` : "0s";
              return (
                <JourneyLink
                  key={r.name}
                  id={toSlug(r.name)}
                  row={r}
                  onEnquire={() => openEnquiry()}
                  className="grid grid-cols-[40px_minmax(0,1fr)_auto] md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1.25fr)_150px_24px] gap-x-5 gap-y-5 md:gap-9 items-center py-7 md:py-[34px] border-b border-[#1E1913]/[0.12] text-[#1E1913] hover:bg-[rgba(201,164,106,.07)] transition-colors scroll-mt-36"
                >
                  <span className="self-start md:self-center pt-2 md:pt-0 font-sans font-light text-xs tracking-[0.22em] text-[#8A6A33]">
                    {pad(r.i + 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-serif-luxury font-light text-[clamp(24px,2.3vw,32px)] leading-[1.14] tracking-[0.03em] mb-2">
                      {r.name}
                    </div>
                    <div className="font-sans font-light text-[13px] leading-[1.7] text-[#1E1913]/66">{r.sub}</div>
                  </div>
                  <div className="relative min-w-0 max-md:col-start-2 max-md:col-span-2 max-md:row-start-2">
                    <div className="relative h-3.5">
                      <span className="absolute left-0 right-0 top-1.5 h-px bg-[#1E1913]/[0.12]" />
                      <span
                        className="absolute left-0 top-[5px] h-[3px] bg-[#8A6A33] motion-safe:transition-[width] motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(.22,.7,.3,1)]"
                        style={{ width: barW, transitionDelay: delay }}
                      />
                      <span
                        className="absolute top-0.5 w-[9px] h-[9px] rounded-full bg-[#1E1913] -translate-x-1/2 motion-safe:transition-[left] motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(.22,.7,.3,1)]"
                        style={{ left: barW, transitionDelay: delay }}
                      />
                    </div>
                    <div className="flex gap-5 mt-3 font-sans font-light text-[10.5px] tracking-[0.2em] text-[#1E1913]/70 uppercase">
                      <span className="text-[#1E1913]">{lengthLabel(r.length)}</span>
                      <span>{r.facet}</span>
                    </div>
                  </div>
                  <span className="self-start md:self-center max-md:col-start-3 max-md:row-start-1 font-serif-luxury font-light text-lg md:text-[21px] tracking-[0.04em] text-[#8A6A33] text-right whitespace-nowrap">
                    {formatPrice(r.price)}
                  </span>
                  <span className="hidden md:block font-sans font-light text-base text-[#8A6A33] text-right">→</span>
                </JourneyLink>
              );
            })}
          </div>
        )}

        {view === "gallery" && rows.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-x-9 gap-y-14 pt-3">
            {slice.map((r, k) => (
              <JourneyLink
                key={r.name}
                id={toSlug(r.name)}
                row={r}
                onEnquire={() => openEnquiry()}
                className={`block text-[#1E1913] group scroll-mt-36 ${["", "sm:mt-14", "sm:mt-[22px]"][k % 3]}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-[22px]">
                  <ExperienceMaskImage image={r.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                  <span className="absolute top-[18px] left-[18px] font-sans font-light text-[11px] tracking-[0.22em] text-[#FBF7F0] [text-shadow:0_1px_10px_rgba(18,14,10,.6)] pointer-events-none">
                    {pad(r.i + 1)}
                  </span>
                </div>
                <div className="flex gap-[18px] font-sans font-light text-[10.5px] tracking-[0.24em] text-[#8A6A33] uppercase mb-3">
                  <span>{lengthLabel(r.length)}</span>
                  <span>{r.facet}</span>
                </div>
                <div className="font-serif-luxury font-light text-[28px] leading-[1.14] tracking-[0.03em] mb-2.5 group-hover:text-[#8A6A33] transition-colors">
                  {r.name}
                </div>
                <div className="font-sans font-light text-[13.5px] leading-[1.8] text-[#1E1913]/66 mb-4">{r.sub}</div>
                <div className="flex items-baseline justify-between pt-3.5 border-t border-[#1E1913]/[0.14]">
                  <span className="font-serif-luxury font-light text-xl text-[#8A6A33]">{formatPrice(r.price)}</span>
                  <span className="font-sans font-light text-[10.5px] tracking-[0.26em] uppercase">View →</span>
                </div>
              </JourneyLink>
            ))}
          </div>
        )}

        {pagesN > 1 && (
          <div className="flex items-center justify-between gap-6 mt-16 pt-7 border-t border-[#1E1913]/[0.14]">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => goToPage(current - 1)}
              className="py-2 font-sans font-light text-[10.5px] tracking-[0.3em] uppercase text-[#1E1913] disabled:text-[#1E1913]/30 cursor-pointer disabled:cursor-default"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-[22px]">
              {Array.from({ length: pagesN }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => goToPage(n)}
                  className={`px-0.5 py-1.5 font-serif-luxury font-light text-[19px] tracking-[0.1em] ${chip(n === current)}`}
                >
                  {pad(n)}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={current === pagesN}
              onClick={() => goToPage(current + 1)}
              className="py-2 font-sans font-light text-[10.5px] tracking-[0.3em] uppercase text-[#1E1913] disabled:text-[#1E1913]/30 cursor-pointer disabled:cursor-default"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
