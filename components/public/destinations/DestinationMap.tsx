"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const INK = "#1e1209";
const CREAM = "#fff6ea";
const GOLD_LIGHT = "#f1c27d";

interface DestinationMapProps {
  lat: number;
  lng: number;
  zoom: number;
  label: string;
  className?: string;
}

/**
 * Single-marker Mapbox wrapper for a destination's location. Unlike
 * ItineraryMap (components/public/itinerary/ItineraryMap.tsx), which needs
 * ≥2 pins and always draws a route line between them, this just centers a
 * static map on one point with one marker — no route. Shares the same
 * token/WebGL-guard/cleanup pattern so it degrades the same way (renders
 * nothing) when NEXT_PUBLIC_MAPBOX_TOKEN is unset or WebGL is unavailable.
 */
export default function DestinationMap({ lat, lng, zoom, label, className }: DestinationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    if (!token || !containerRef.current) return;
    if (!mapboxgl.supported()) {
      queueMicrotask(() => setUnsupported(true));
      return;
    }

    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom,
        attributionControl: false,
      });
    } catch (err) {
      console.warn("Failed to initialize the destination map:", err);
      queueMicrotask(() => setUnsupported(true));
      return;
    }
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const el = document.createElement("div");
    el.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 999px;
      background: ${INK};
      border: 2px solid ${GOLD_LIGHT};
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    `;
    new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
          `<div style="font-family:sans-serif;font-size:12px;color:${INK};">${escapeHtml(label)}</div>`
        )
      )
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token || unsupported) return null;

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full" style={{ background: CREAM }} />
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
