"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
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
      {/* Tab bar — rounded pill bubbles */}
      <div className="flex gap-1 rounded-full bg-surface-muted p-1 shadow-inner">
        {TABS.map((option) => {
          const active = tab === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTab(option.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-brand text-white shadow-nav"
                  : "text-ink-muted"
              }`}
            >
              <Icon name={option.icon} className="h-4 w-4" />
              {option.label}
            </button>
          );
        })}
      </div>

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
