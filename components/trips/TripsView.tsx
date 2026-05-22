"use client";

import { useState } from "react";
import { PillTabs } from "@/components/ui/PillTabs";
import { TripCard } from "./TripCard";
import type { TripsData } from "@/lib/api/trips";

type Tab = "current" | "upcoming" | "previous";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "current", label: "Current", icon: "truck" },
  { key: "upcoming", label: "Upcoming", icon: "calendar" },
  { key: "previous", label: "Previous", icon: "clock" },
];

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="py-8 text-center text-sm italic text-ink-muted">{text}</p>
  );
}

/**
 * TripsView — the Trips screen: a Current / Upcoming / Previous tab bar.
 * Every trip is a summary card; tapping one opens its detail page at
 * `/trips/[id]`. Only the current trip's card shows the route map.
 */
export function TripsView({ trips }: { trips: TripsData }) {
  const [tab, setTab] = useState<Tab>("current");

  return (
    <div className="space-y-4">
      {/* Tab bar — shared rounded pill bubbles */}
      <PillTabs
        tabs={TABS}
        active={tab}
        onChange={(key) => setTab(key as Tab)}
      />

      {/* Current */}
      {tab === "current" &&
        (trips.current ? (
          <TripCard trip={trips.current} variant="current" />
        ) : (
          <EmptyNote text="No current trip" />
        ))}

      {/* Upcoming */}
      {tab === "upcoming" &&
        (trips.upcoming.length === 0 ? (
          <EmptyNote text="No upcoming trips" />
        ) : (
          <div className="space-y-3">
            {trips.upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} variant="upcoming" />
            ))}
          </div>
        ))}

      {/* Previous */}
      {tab === "previous" &&
        (trips.previous.length === 0 ? (
          <EmptyNote text="No previous trips" />
        ) : (
          <div className="space-y-3">
            {trips.previous.map((trip) => (
              <TripCard key={trip.id} trip={trip} variant="previous" />
            ))}
          </div>
        ))}
    </div>
  );
}
