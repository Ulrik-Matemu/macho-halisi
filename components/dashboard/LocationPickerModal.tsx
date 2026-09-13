"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search, Loader2 } from "lucide-react";
import Dialog from "@/components/dashboard/ui/Dialog";
import Button from "@/components/dashboard/ui/Button";
import { inputClass, inputStyle } from "@/components/dashboard/ui/Field";

// Roughly the centroid of Tanzania — the default view when no coordinates
// are set yet, since this operator's itineraries are Tanzania-based.
const DEFAULT_CENTER: [number, number] = [34.888, -6.369];

interface GeocodeResult {
  id: string;
  placeName: string;
  lng: number;
  lat: number;
}

// Only the fields this component reads from a Nominatim search result.
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Tanzania's rough bounding box (west, south, east, north) — soft search
// bias, not a hard filter, since an itinerary can reasonably include a
// neighboring-country stop (e.g. a Maasai Mara extension into Kenya).
const TANZANIA_VIEWBOX = "29.3,-11.8,40.5,-0.9";

interface LocationPickerModalProps {
  initialLat?: number | null;
  initialLng?: number | null;
  title: string;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
}

/**
 * A click-or-search coordinate picker, shared by the destinations catalog
 * and the itinerary editor's Days tab. See prior implementation notes:
 * search uses OpenStreetMap's Nominatim (Mapbox's own geocoder has near-zero
 * POI coverage for East African parks/reserves), Mapbox GL still renders
 * the map itself.
 */
export default function LocationPickerModal({ initialLat, initialLng, title, onConfirm, onClose }: LocationPickerModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasInitial = initialLat != null && initialLng != null;
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: initialLat ?? DEFAULT_CENTER[1],
    lng: initialLng ?? DEFAULT_CENTER[0],
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !containerRef.current) return;

    if (!mapboxgl.supported()) {
      queueMicrotask(() => setMapError("This browser doesn't support the interactive map (WebGL unavailable)."));
      return;
    }

    mapboxgl.accessToken = token;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [position.lng, position.lat],
        zoom: hasInitial ? 10 : 5.5,
        attributionControl: false,
      });
    } catch (err) {
      console.warn("Failed to initialize the map picker:", err);
      queueMicrotask(() => setMapError("The interactive map failed to load. Enter coordinates manually instead."));
      return;
    }
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const marker = new mapboxgl.Marker({ color: "#c68642", draggable: true }).setLngLat([position.lng, position.lat]).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat();
      setPosition({ lat, lng });
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      setPosition({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token || query.trim().length < 2) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=5&viewbox=${TANZANIA_VIEWBOX}`;
        const res = await fetch(url);
        const data: NominatimResult[] = await res.json();
        setResults(
          (Array.isArray(data) ? data : []).map((r) => ({ id: String(r.place_id), placeName: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }))
        );
      } catch (err) {
        console.error("Geocoding search failed:", err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, token]);

  const flyTo = (lat: number, lng: number, zoom = 11) => {
    setPosition({ lat, lng });
    markerRef.current?.setLngLat([lng, lat]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 1000 });
  };

  const selectResult = (result: GeocodeResult) => {
    flyTo(result.lat, result.lng);
    setResults([]);
    setQuery(result.placeName);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {token && (
            <Button variant="primary" onClick={() => onConfirm(position.lat, position.lng)}>
              Use this location
            </Button>
          )}
        </>
      }
    >
      {token ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                if (value.trim().length < 2) setResults([]);
              }}
              placeholder="Search for a place, park, or lodge..."
              aria-label="Search for a location"
              className={`${inputClass} pl-9 pr-9`}
              style={inputStyle}
            />
            {searching && <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--dash-text-subtle)" }} />}
            {results.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl max-h-56 overflow-y-auto" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)" }}>
                {results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => selectResult(result)}
                    className="dash-focusable w-full text-left px-3.5 py-2.5 text-sm transition-colors"
                    style={{ color: "var(--dash-text-muted)", borderBottom: "1px solid var(--dash-border)" }}
                  >
                    {result.placeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {mapError ? (
            <div className="w-full rounded-lg p-4 text-sm" style={{ border: "1px solid var(--dash-accent-soft-border)", background: "var(--dash-accent-soft)", color: "var(--dash-accent)" }}>
              {mapError} Search above still works — pick a result and confirm to use its coordinates, or close this
              and enter latitude/longitude manually.
            </div>
          ) : (
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden" style={{ border: "1px solid var(--dash-border)" }}>
              <div className="absolute inset-0">
                <div ref={containerRef} className="w-full h-full" />
              </div>
            </div>
          )}

          <div className="dash-code text-xs" style={{ color: "var(--dash-text-subtle)" }}>
            Lat {position.lat.toFixed(5)}, Lng {position.lng.toFixed(5)}
            {!mapError && " — click the map or drag the pin to fine-tune."}
          </div>
        </div>
      ) : (
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          Map picker unavailable — NEXT_PUBLIC_MAPBOX_TOKEN isn&apos;t configured. Enter coordinates manually instead.
        </p>
      )}
    </Dialog>
  );
}
