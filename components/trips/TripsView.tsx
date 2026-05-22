"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { TripCard } from "./TripCard";
import type { TripsData } from "@/lib/api/trips";

/** Collapsible section with a blue-accented title + count badge. */
function Section({
  title,
  count,
  defaultOpen,
  children,
}: {
  title: string;
  count?: number;
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
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-muted">
            {count}
          </span>
        )}
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

/**
 * TripsView — the Trips screen: three collapsible sections (Current /
 * Upcoming / Previous). Every trip is a summary card; tapping one opens
 * its detail page at `/trips/[id]`.
 */
export function TripsView({ trips }: { trips: TripsData }) {
  return (
    <div className="space-y-5">
      <Section title="Current Trip" defaultOpen>
        {trips.current ? (
          <TripCard trip={trips.current} variant="current" />
        ) : (
          <EmptyNote text="No current trip" />
        )}
      </Section>

      <Section title="Upcoming Trips" count={trips.upcoming.length} defaultOpen>
        {trips.upcoming.length === 0 ? (
          <EmptyNote text="No upcoming trips" />
        ) : (
          <div className="space-y-3">
            {trips.upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} variant="upcoming" />
            ))}
          </div>
        )}
      </Section>

      <Section title="Previous Trips" count={trips.previous.length}>
        {trips.previous.length === 0 ? (
          <EmptyNote text="No previous trips" />
        ) : (
          <div className="space-y-3">
            {trips.previous.map((trip) => (
              <TripCard key={trip.id} trip={trip} variant="previous" />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
