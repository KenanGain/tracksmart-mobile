"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@/components/ui/Icon";
import type { MapStop } from "./TripMapLeaflet";

/**
 * TripMap — the route map widget. The Leaflet map is loaded client-only
 * (`ssr: false`) because Leaflet needs the DOM. The embedded map is a
 * preview; tapping it opens a full-screen interactive map.
 *
 * The wrappers are `isolate` so Leaflet's internal z-indexes stay scoped
 * below the app's TopBar / BottomNav.
 */
const TripMapLeaflet = dynamic(() => import("./TripMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-xs text-ink-muted">
      Loading map…
    </div>
  ),
});

/** Full-screen interactive map, opened by tapping the preview. */
function FullMap({
  stops,
  onClose,
}: {
  stops: MapStop[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const from = stops[0]?.location;
  const to = stops[stops.length - 1]?.location;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-shell -translate-x-1/2 flex-col bg-surface">
      <header className="flex h-topbar shrink-0 items-center border-b border-ink/5 px-2 pt-safe-top">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close map"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-base font-semibold text-ink">Route Map</h2>
          {from && to && (
            <p className="text-[11px] text-ink-muted">
              {from} → {to}
            </p>
          )}
        </div>
        <span className="h-9 w-9 shrink-0" aria-hidden="true" />
      </header>
      <div className="isolate min-h-0 flex-1">
        <TripMapLeaflet stops={stops} interactive className="h-full w-full" />
      </div>
    </div>
  );
}

export function TripMap({ stops }: { stops: MapStop[] }) {
  const [full, setFull] = useState(false);

  return (
    <>
      <div className="relative isolate h-44 overflow-hidden rounded-xl border border-ink/10">
        <TripMapLeaflet stops={stops} />
        {/* Tap layer — opens the full-screen map (above all Leaflet panes). */}
        <button
          type="button"
          onClick={() => setFull(true)}
          aria-label="Open full map"
          className="absolute inset-0 z-[1000] flex items-end justify-end p-2"
        >
          <span className="flex items-center gap-1 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold text-brand shadow-card">
            <Icon name="map" className="h-4 w-4" />
            Full map
          </span>
        </button>
      </div>

      {full && <FullMap stops={stops} onClose={() => setFull(false)} />}
    </>
  );
}
