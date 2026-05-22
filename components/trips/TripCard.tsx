import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TripMap } from "./TripMap";
import type { Trip } from "@/lib/data/trips";

export type TripVariant = "current" | "upcoming" | "previous";

/** Status pill — colour + label depend on the trip variant. */
function StatusPill({ trip, variant }: { trip: Trip; variant: TripVariant }) {
  const style =
    variant === "current"
      ? "bg-brand text-white"
      : variant === "upcoming"
        ? "bg-warning/15 text-warning"
        : "bg-success/10 text-success";

  const label =
    variant === "current"
      ? "In Progress"
      : variant === "upcoming"
        ? (trip.countdown ?? "Scheduled")
        : "Completed";

  const dot =
    variant === "current"
      ? "bg-white"
      : variant === "upcoming"
        ? "bg-warning"
        : "bg-success";

  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/** A meta chip in the card footer row (stops / unit / equipment). */
function Meta({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-ink-muted">
      <Icon name={icon} className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

/**
 * TripSummary — the textual summary of a trip: id + status pill, route,
 * date window and a meta row. Shared by the list card and the detail
 * view.
 */
export function TripSummary({
  trip,
  variant,
}: {
  trip: Trip;
  variant: TripVariant;
}) {
  const stopCount = trip.stops.length;
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
            Driver Trip
          </p>
          <p className="text-xl font-bold text-ink">{trip.id}</p>
        </div>
        <StatusPill trip={trip} variant={variant} />
      </div>

      <p className="mt-2 text-sm font-bold text-ink">
        {trip.origin} <span className="text-ink-muted">→</span>{" "}
        {trip.destination}
      </p>

      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
        <Icon name="calendar" className="h-3.5 w-3.5" />
        {trip.startDate} → {trip.endDate}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/5 pt-3">
        <Meta
          icon="route"
          text={`${stopCount} ${stopCount === 1 ? "stop" : "stops"}`}
        />
        <Meta icon="truck" text={trip.powerUnit} />
        <Meta icon="package" text={`${trip.equipment}, ${trip.trailer}`} />
      </div>
    </>
  );
}

/**
 * TripCard — a trip summary card. The text summary and the footer link to
 * the trip detail page (`/trips/[id]`); the map opens the full-screen
 * map, so it is deliberately not wrapped in the detail link.
 */
export function TripCard({
  trip,
  variant,
}: {
  trip: Trip;
  variant: TripVariant;
}) {
  return (
    <div className="overflow-hidden rounded-card bg-surface shadow-card">
      <Link href={`/trips/${trip.id}`} className="block p-4">
        <TripSummary trip={trip} variant={variant} />
      </Link>
      <div className="px-4 pb-4">
        <TripMap stops={trip.stops} />
      </div>
      <Link
        href={`/trips/${trip.id}`}
        className="flex items-center justify-center gap-1 border-t border-ink/5 py-2.5 text-xs font-semibold text-brand"
      >
        View trip
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
