"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const GOLD = "#e0ac69";

interface AccommodationMapProps {
  latitude: number;
  longitude: number;
  label: string;
  className?: string;
}

/**
 * Single-pin Mapbox wrapper for an accommodation's location. Renders nothing
 * when NEXT_PUBLIC_MAPBOX_TOKEN is unset or WebGL is unavailable — the map is
 * additive polish, never a blocking dependency.
 */
export default function AccommodationMap({ latitude, longitude, label, className }: AccommodationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !containerRef.current) return;

    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [longitude, latitude],
        zoom: 7,
        attributionControl: false,
        cooperativeGestures: true,
      });
    } catch (err) {
      console.warn("Mapbox failed to initialize:", err);
      setUnsupported(true);
      return;
    }

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const el = document.createElement("div");
    el.style.width = "18px";
    el.style.height = "18px";
    el.style.borderRadius = "50%";
    el.style.background = GOLD;
    el.style.border = "3px solid #1e1209";
    el.style.boxShadow = "0 0 0 2px rgba(224,172,105,0.5)";

    new mapboxgl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setText(label))
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, latitude, longitude, label]);

  if (!token || unsupported) return null;

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full h-[360px] rounded-lg overflow-hidden border border-white/10"}
      aria-label={`Map showing the location of ${label}`}
    />
  );
}
