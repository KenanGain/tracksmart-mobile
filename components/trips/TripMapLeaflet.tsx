"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

export type MapStop = {
  lat: number;
  lng: number;
  name?: string;
  location?: string;
};

/** A numbered red pin — matches the stop numbers on the timeline. */
function numberedIcon(n: number) {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:9999px;background:#b91c1c;color:#ffffff;font-weight:700;font-size:12px;border:2px solid #ffffff;box-shadow:0 1px 4px rgba(15,23,42,0.4)">${n}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

/**
 * TripMapLeaflet — the real map. Rendered client-only (Leaflet needs the
 * DOM); `TripMap` loads it via `next/dynamic` with `ssr: false`.
 *
 * OpenStreetMap tiles need no API key. The route is a straight polyline
 * through the stop coordinates (no routing engine in the prototype).
 * `interactive` enables pan / zoom and marker popups — the embedded
 * preview turns it off; the full-screen map turns it on.
 */
export default function TripMapLeaflet({
  stops,
  interactive = false,
  className = "h-44 w-full",
}: {
  stops: MapStop[];
  interactive?: boolean;
  className?: string;
}) {
  const positions = stops.map((s) => [s.lat, s.lng] as [number, number]);
  const bounds = L.latLngBounds(positions);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [28, 28] }}
      className={className}
      dragging={interactive}
      scrollWheelZoom={false}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      zoomControl={interactive}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={positions}
        pathOptions={{ color: "#1d4ed8", weight: 4, opacity: 0.9 }}
      />
      {stops.map((stop, i) => (
        <Marker
          key={i}
          position={[stop.lat, stop.lng]}
          icon={numberedIcon(i + 1)}
        >
          {interactive && stop.name && (
            <Popup>
              <strong>
                {i + 1}. {stop.name}
              </strong>
              {stop.location ? <br /> : null}
              {stop.location}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
