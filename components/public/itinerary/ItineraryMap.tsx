"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ItineraryMapPin } from "@/lib/public/api";

const GOLD = "#C9A46A";
const GOLD_LIGHT = "#E3C99A";
const INK = "#1E1913";
const CREAM = "#F6F2EA";

const ROUTE_SOURCE_ID = "itinerary-route";
const ROUTE_LAYER_ID = "itinerary-route-line";

interface ItineraryMapProps {
  pins: ItineraryMapPin[];
  /**
   * When set, the camera flies to this pin and its marker pulses — used by
   * the day-by-day sticky panel to sync the map to scroll position. When
   * omitted, the map just fits all pins in view and sits still — used by
   * the journey overview section.
   */
  activeIndex?: number;
  /** Clicking a marker (or, in overview mode, notifying which day to jump to). */
  onPinClick?: (dayNumber: number) => void;
  className?: string;
}

/**
 * Shared Mapbox GL wrapper for the itinerary detail page's two map
 * placements (journey overview + scroll-synced route panel — see
 * ItineraryJourneyOverviewMap and the toggle in ItineraryRouteSection).
 * Renders nothing (returns null) when NEXT_PUBLIC_MAPBOX_TOKEN is unset or
 * there are fewer than 2 usable pins — the map is additive polish, never a
 * blocking dependency for itineraries without geo data yet.
 */
export default function ItineraryMap({ pins, activeIndex, onPinClick, className }: ItineraryMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onPinClickRef = useRef(onPinClick);
  useEffect(() => {
    onPinClickRef.current = onPinClick;
  }, [onPinClick]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  // Mapbox GL needs WebGL, which isn't guaranteed (disabled hardware
  // acceleration, some in-app browsers, locked-down setups) — its
  // constructor throws synchronously when unavailable, so this is caught
  // below and treated the same as "no token": the component quietly
  // renders nothing rather than crashing the itinerary page for a visitor.
  const [unsupported, setUnsupported] = useState(false);

  // Mount: create the map, draw the route line, and drop one marker per pin.
  useEffect(() => {
    if (!token || !containerRef.current || pins.length === 0) return;
    if (!mapboxgl.supported()) {
      // Deferred rather than called directly in the effect body, so this
      // is a follow-up update rather than a synchronous render-in-render.
      queueMicrotask(() => setUnsupported(true));
      return;
    }

    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [pins[0]!.lng, pins[0]!.lat],
        zoom: 6,
        attributionControl: false,
      });
    } catch (err) {
      // Deliberately warn, not error — this is already fully handled
      // (falls back to rendering nothing) and Next's dev overlay treats
      // console.error as a page-level failure worth interrupting on,
      // which this isn't. Genuinely more likely with two Mapbox contexts
      // open on one page (this map plus the route section's toggleable
      // one) under software-rendered WebGL, which supports far fewer
      // concurrent contexts than real hardware — expect this to be rare
      // to nonexistent for real visitors on real GPUs.
      console.warn("Failed to initialize the itinerary map:", err);
      queueMicrotask(() => setUnsupported(true));
      return;
    }
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: pins.map((p) => [p.lng, p.lat]),
          },
        },
      });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": GOLD,
          "line-width": 2.5,
          "line-dasharray": [0.2, 1.6],
        },
      });

      const bounds = new mapboxgl.LngLatBounds();
      pins.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 64, maxZoom: 10, duration: 0 });
    });

    markersRef.current = pins.map((pin) => {
      // Mapbox positions markers by setting `transform` on the element
      // passed to `new Marker({ element })` directly — so the active-pin
      // pulse scale must live on an *inner* element instead, or it would
      // clobber Mapbox's own translate and the pin would jump off-place.
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `Day ${pin.dayNumber}: ${pin.label}`);
      el.style.cssText = "background: none; border: none; padding: 0; cursor: pointer;";

      const inner = document.createElement("div");
      inner.className = "itinerary-map-marker-inner";
      inner.style.cssText = `
        width: ${pin.isHighlight ? 30 : 24}px;
        height: ${pin.isHighlight ? 30 : 24}px;
        border-radius: 999px;
        background: ${INK};
        border: 2px solid ${pin.isHighlight ? GOLD_LIGHT : CREAM};
        color: ${CREAM};
        font-family: sans-serif;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.02em;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        transition: transform 200ms ease;
      `;
      inner.textContent = String(pin.dayNumber);
      el.appendChild(inner);
      el.addEventListener("click", () => onPinClickRef.current?.(pin.dayNumber));

      const popup = pin.blurb
        ? new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
            `<div style="font-family:sans-serif;font-size:12px;color:${INK};max-width:200px;line-height:1.5;">
              <strong style="display:block;margin-bottom:2px;">${escapeHtml(pin.label)}</strong>
              ${escapeHtml(pin.blurb)}
            </div>`
          )
        : undefined;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map);

      return marker;
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // Pins are effectively static for the life of this component instance
    // (one map per rendered itinerary) — only activeIndex changes on scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Sync mode: fly the camera to the active pin and pulse its marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || activeIndex === undefined) return;
    const pin = pins[activeIndex];
    if (!pin) return;

    if (map.loaded()) {
      map.flyTo({ center: [pin.lng, pin.lat], zoom: 9.5, duration: 1200, essential: true });
    }

    markersRef.current.forEach((marker, idx) => {
      const inner = marker.getElement().querySelector<HTMLElement>(".itinerary-map-marker-inner");
      if (!inner) return;
      inner.style.transform = idx === activeIndex ? "scale(1.25)" : "scale(1)";
      inner.style.zIndex = idx === activeIndex ? "10" : "1";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  if (!token || pins.length < 2 || unsupported) return null;

  // `className` (typically "absolute inset-0" from a caller) must land on
  // a plain wrapper, not on the div passed to `new mapboxgl.Map()` —
  // mapbox-gl.css ships `.mapboxgl-map { position: relative }`, which
  // Mapbox GL tags directly onto that container element and which wins
  // over a Tailwind `.absolute` class on the same element (same
  // specificity, later in the cascade), collapsing it to height:0 and
  // silently rendering nothing. The inner div just fills the wrapper.
  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
