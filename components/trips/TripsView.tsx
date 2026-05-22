"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { TripItineraryCard } from "./TripItineraryCard";
import { TripStopRow } from "./TripStopRow";
import type { Trip } from "@/lib/data/trips";
import type { TripsData } from "@/lib/api/trips";

/** Collapsible section with a blue-accented title. */
function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2"
      >
        <span className="h-6 w-1 shrink-0 rounded-full bg-brand" />
        <h2 className="flex-1 text-left text-xl font-bold text-ink">
          {title}
        </h2>
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          className="h-5 w-5 text-ink-muted"
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="py-2 text-center text-sm italic text-ink-muted">{text}</p>
  );
}

/** The current trip — itinerary card, a progress strip and the timeline. */
function CurrentTripBlock({ trip }: { trip: Trip }) {
  const total = trip.stops.length;
  const done = trip.stops.filter((stop) => stop.completed).length;
  const nextIndex = trip.stops.findIndex((stop) => !stop.completed);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="space-y-4">
      <TripItineraryCard trip={trip} variant="current" />

      {/* Progress strip */}
      {total > 0 && (
        <div className="rounded-card bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Trip Progress</p>
            <p className="text-sm font-semibold text-ink-muted">
              {done} of {total} stops
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <ol>
        {trip.stops.map((stop, index) => (
          <TripStopRow
            key={stop.id}
            stop={stop}
            isLast={index === total - 1}
            isNext={index === nextIndex}
          />
        ))}
      </ol>
    </div>
  );
}

/**
 * TripsView — the Trips screen: an "I'm Driving" toggle and three
 * collapsible sections (Current / Upcoming / Previous).
 */
export function TripsView({ trips }: { trips: TripsData }) {
  return (
    <div className="space-y-5">
      <Section title="Current Trip" defaultOpen>
        {trips.current ? (
          <CurrentTripBlock trip={trips.current} />
        ) : (
          <EmptyNote text="No current trip" />
        )}
      </Section>

      <Section title="Upcoming Trips" defaultOpen>
        {trips.upcoming.length === 0 ? (
          <EmptyNote text="No upcoming trips" />
        ) : (
          <div className="space-y-3">
            {trips.upcoming.map((trip) => (
              <TripItineraryCard key={trip.id} trip={trip} variant="previous" />
            ))}
          </div>
        )}
      </Section>

      <Section title="Previous Trips" defaultOpen>
        {trips.previous.length === 0 ? (
          <EmptyNote text="No previous trips" />
        ) : (
          <div className="space-y-3">
            {trips.previous.map((trip) => (
              <TripItineraryCard key={trip.id} trip={trip} variant="previous" />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
