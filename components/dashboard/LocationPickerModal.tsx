"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search, Loader2, MapPin, X } from "lucide-react";

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
 * (app/dashboard/destinations/page.tsx) and the itinerary editor's Days tab
 * (components/dashboard/itineraries/DaysTab.tsx) — both need the same
 * "search a place or click the map" way to fill in a latitude/longitude
 * pair, so it lives here rather than duplicated per caller. A modal rather
 * than inline: both callers render many cards in a list, and a live
 * Mapbox instance per card would be wasteful.
 *
 * This never saves anything itself — onConfirm just hands back a
 * { lat, lng } pair, and each caller drops it into whatever save path it
 * already has (draft state + a Save button here, immediate autosave
 * there).
 *
 * Search uses OpenStreetMap's Nominatim, not Mapbox's own geocoder —
 * verified directly (see the map/journey-map feature's implementation
 * notes) that Mapbox's Geocoding/Search Box API has essentially no POI
 * coverage for East African national parks and reserves (searching
 * "Serengeti" returns a golf estate in South Africa and streets in
 * Australia; "Ngorongoro Crater" returns nothing relevant), while
 * Nominatim resolves them correctly. Mapbox GL still renders the map
 * itself — this is a search-provider swap only, gated on the same token
 * since without it there's no map to click on anyway.
 */
export default function LocationPickerModal({
  initialLat,
  initialLng,
  title,
  onConfirm,
  onClose,
}: LocationPickerModalProps) {
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

  // Mount the map once, with a single draggable marker. Mapbox GL needs
  // WebGL, which some browsers/environments don't have (disabled hardware
  // acceleration, a headless test runner, certain locked-down corporate
  // setups) — `new mapboxgl.Map(...)` throws synchronously in that case,
  // so this falls back to a message instead of crashing the page. Search
  // and the manual lat/lng inputs outside this modal still work either way.
  useEffect(() => {
    if (!token || !containerRef.current) return;

    if (!mapboxgl.supported()) {
      // Deferred rather than called directly in the effect body, so this
      // is a follow-up update rather than a synchronous render-in-render.
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
      // warn, not error — see the matching comment in ItineraryMap.tsx.
      // This is fully handled (falls back to the manual inputs) rather
      // than a page-level failure Next's dev overlay should interrupt on.
      console.warn("Failed to initialize the map picker:", err);
      queueMicrotask(() => setMapError("The interactive map failed to load. Enter coordinates manually instead."));
      return;
    }
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const marker = new mapboxgl.Marker({ color: "#c68642", draggable: true })
      .setLngLat([position.lng, position.lat])
      .addTo(map);
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
    // Mounts once — subsequent position changes (click/drag/search) are
    // applied imperatively below rather than by re-mounting the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Debounced place-name search via OpenStreetMap's Nominatim (see the
  // component doc comment for why not Mapbox's own geocoder). Nominatim's
  // usage policy caps this at ~1 request/second — the 400ms debounce plus
  // this being a low-traffic internal admin tool keeps it well within
  // that, and no API key is required.
  useEffect(() => {
    // A too-short query clears results via the input's own onChange
    // instead of here, so this effect never calls setState synchronously
    // in its body — only from inside the debounced async callback below.
    if (!token || query.trim().length < 2) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query.trim()
        )}&format=json&limit=5&viewbox=${TANZANIA_VIEWBOX}`;
        const res = await fetch(url);
        const data: NominatimResult[] = await res.json();
        setResults(
          (Array.isArray(data) ? data : []).map((r) => ({
            id: String(r.place_id),
            placeName: r.display_name,
            lat: Number(r.lat),
            lng: Number(r.lon),
          }))
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#111] border border-white/15 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c68642]" />
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {token ? (
          <>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  if (value.trim().length < 2) setResults([]);
                }}
                placeholder="Search for a place, park, or lodge..."
                className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#c68642] rounded pl-8 pr-8 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
              />
              {searching && (
                <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
              {results.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#161616] border border-white/15 rounded-lg overflow-hidden shadow-xl max-h-56 overflow-y-auto">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => selectResult(result)}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border-b border-white/5 last:border-b-0"
                    >
                      {result.placeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {mapError ? (
              <div className="w-full rounded-lg border border-amber-800/40 bg-amber-950/20 p-4 text-xs text-amber-200/90">
                {mapError} Search above still works — pick a result and confirm to use its coordinates,
                or close this and enter latitude/longitude manually.
              </div>
            ) : (
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-white/10">
                {/* Inner wrapper, not the ref div itself, carries the
                    absolute-fill positioning — mapbox-gl.css sets
                    `.mapboxgl-map { position: relative }`, which Mapbox GL
                    tags directly onto the div we pass as `container` and
                    which overrides a Tailwind `.absolute` class on that
                    same element, collapsing it to height:0. See
                    ItineraryMap.tsx for the same fix on the public site. */}
                <div className="absolute inset-0">
                  <div ref={containerRef} className="w-full h-full" />
                </div>
              </div>
            )}

            <div className="text-[11px] font-mono text-white/50">
              Lat {position.lat.toFixed(5)}, Lng {position.lng.toFixed(5)}
              {!mapError && " — click the map or drag the pin to fine-tune."}
            </div>
          </>
        ) : (
          <p className="text-xs text-white/50">
            Map picker unavailable — NEXT_PUBLIC_MAPBOX_TOKEN isn&apos;t configured. Enter coordinates
            manually instead.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {token && (
            <button
              type="button"
              onClick={() => onConfirm(position.lat, position.lng)}
              className="px-5 py-2.5 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors cursor-pointer"
            >
              Use This Location
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
