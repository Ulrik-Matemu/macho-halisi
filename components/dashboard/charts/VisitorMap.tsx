"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { countryName } from "@/lib/dashboard/format";

interface VisitorMapProps {
  /** ISO 3166-1 alpha-2 country code → unique visitors. */
  countries: { code: string; visitors: number }[];
}

// Sequential single-hue ramp (amber), low → high. Low values sit close to
// the dark map surface; the brightest step is the dashboard accent. Mapbox
// paint can't read CSS variables, so the hexes live here.
const RAMP_LOW = [0x4a, 0x35, 0x20];
const RAMP_HIGH = [0xe0, 0xac, 0x69];

function rampColor(t: number): string {
  const c = RAMP_LOW.map((lo, i) => Math.round(lo + (RAMP_HIGH[i] - lo) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/**
 * Choropleth of visitors by country over Mapbox's country-boundaries
 * tileset. Only rendered when NEXT_PUBLIC_MAPBOX_TOKEN is set — the
 * Countries table beside it carries the same numbers either way.
 */
export default function VisitorMap({ countries }: VisitorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  // Only ever rendered client-side (next/dynamic, ssr: false), so the
  // WebGL support check is safe during the initial render.
  const [failed, setFailed] = useState(() => !mapboxgl.supported());
  const countsRef = useRef<Map<string, number>>(new Map());
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || failed || !containerRef.current) return;
    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [20, 10],
        zoom: 0.8,
        attributionControl: false,
        renderWorldCopies: false,
      });
    } catch {
      // The Mapbox constructor throwing (e.g. WebGL context lost) is an
      // external failure — fall back to the Countries list.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource("countries", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      map.addLayer({
        id: "visitor-fill",
        type: "fill",
        source: "countries",
        "source-layer": "country_boundaries",
        paint: { "fill-color": rampColor(0), "fill-opacity": 0 },
        filter: ["any", ["==", "all", ["get", "worldview"]], ["in", "US", ["get", "worldview"]]],
      });
      setReady(true);
    });

    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 8 });
    map.on("mousemove", "visitor-fill", (e) => {
      const feature = e.features?.[0];
      const code = (feature as { properties?: Record<string, unknown> } | undefined)?.properties?.iso_3166_1 as string | undefined;
      if (!code) return;
      const visitors = countsRef.current.get(code);
      if (!visitors) {
        popup.remove();
        return;
      }
      map.getCanvas().style.cursor = "default";
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="font:12px system-ui;color:#1a1105"><strong>${countryName(code)}</strong><br/>${visitors.toLocaleString("en-US")} visitors</div>`
        )
        .addTo(map);
    });
    map.on("mouseleave", "visitor-fill", () => popup.remove());

    return () => {
      popup.remove();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create the map once per token; `failed` only ever flips to true
  }, [token]);

  // Recolor whenever the data changes.
  useEffect(() => {
    countsRef.current = new Map(countries.filter((c) => /^[A-Z]{2}$/.test(c.code)).map((c) => [c.code, c.visitors]));
    const map = mapRef.current;
    if (!map || !ready) return;
    const valid = [...countsRef.current.entries()];
    if (valid.length === 0) {
      map.setPaintProperty("visitor-fill", "fill-opacity", 0);
      return;
    }
    const max = Math.max(1, ...valid.map(([, v]) => v));
    const color: unknown[] = ["match", ["get", "iso_3166_1"]];
    const opacity: unknown[] = ["match", ["get", "iso_3166_1"]];
    for (const [code, visitors] of valid) {
      color.push(code, rampColor(visitors / max));
      opacity.push(code, 0.85);
    }
    color.push(rampColor(0));
    opacity.push(0);
    map.setPaintProperty("visitor-fill", "fill-color", color as mapboxgl.ExpressionSpecification);
    map.setPaintProperty("visitor-fill", "fill-opacity", opacity as mapboxgl.ExpressionSpecification);
  }, [countries, ready]);

  if (!token || failed) return null;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="World map shaded by visitors per country. The Countries list alongside shows the same figures."
      className="w-full h-72 rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--dash-border)" }}
    />
  );
}
