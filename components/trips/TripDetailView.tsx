import { Icon } from "@/components/ui/Icon";
import { TripSummary } from "./TripCard";
import { TripMap } from "./TripMap";
import { TripStopRow } from "./TripStopRow";
import { TripSubmitCard } from "./TripSubmitCard";
import type { Trip } from "@/lib/data/trips";
import type { TripVariant } from "@/lib/api/trips";

/** Trip-level dispatch note. */
function TripNote({ note }: { note: string }) {
  return (
    <div className="rounded-card border border-warning/30 bg-warning/10 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-warning">
        <Icon name="info" className="h-4 w-4" />
        Dispatch Note
      </p>
      <p className="mt-1 text-sm text-ink">{note}</p>
    </div>
  );
}

/** Driver / dispatch details. */
function TripDetails({ trip }: { trip: Trip }) {
  const rows = [
    { icon: "package", label: "Equipment", value: trip.equipment },
    { icon: "truck", label: "Power unit", value: trip.powerUnit },
    { icon: "package", label: "Trailer", value: trip.trailer },
    { icon: "user", label: "Lead driver", value: trip.leadDriver },
    { icon: "user", label: "Team driver", value: trip.teamDriver || "—" },
    { icon: "user", label: "Dispatched by", value: trip.dispatchedBy },
    { icon: "clock", label: "Issued on", value: trip.issuedOn },
  ];
  return (
    <div className="rounded-card bg-surface p-4 shadow-card">
      <p className="text-sm font-bold text-ink">Trip Details</p>
      <dl className="mt-3 space-y-2.5 border-t border-ink/5 pt-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3"
          >
            <dt className="flex items-center gap-2 text-sm text-ink-muted">
              <Icon name={row.icon} className="h-4 w-4" />
              {row.label}
            </dt>
            <dd className="text-right text-sm font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * TripDetailView — the full trip screen (`/trips/[id]`): a summary card
 * with the route map, a progress strip, the dispatch note, trip details
 * and the stop timeline.
 */
export function TripDetailView({
  trip,
  variant,
}: {
  trip: Trip;
  variant: TripVariant;
}) {
  const total = trip.stops.length;
  const done = trip.stops.filter((stop) => stop.completed).length;
  const nextIndex = trip.stops.findIndex((stop) => !stop.completed);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="space-y-4">
      {/* Summary + map */}
      <div className="overflow-hidden rounded-card bg-surface shadow-card">
        <div className="p-4">
          <TripSummary trip={trip} variant={variant} />
        </div>
        <div className="px-4 pb-4">
          <TripMap stops={trip.stops} />
        </div>
      </div>

      {/* Progress */}
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

      {/* Submit documents, notes & photos */}
      <TripSubmitCard />

      {trip.note && <TripNote note={trip.note} />}

      <TripDetails trip={trip} />

      {/* Stop timeline */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Stops
        </p>
        <ol>
          {trip.stops.map((stop, index) => (
            <TripStopRow
              key={stop.id}
              stop={stop}
              index={index + 1}
              isLast={index === total - 1}
              isNext={index === nextIndex}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
