import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TripOverviewCard } from "./TripOverviewCard";
import { TripStopRow } from "./TripStopRow";
import { TripSubmitCard } from "./TripSubmitCard";
import type { Trip } from "@/lib/data/trips";
import type { TripVariant } from "@/lib/api/trips";

/** An entry-point row card (Expense / Report an Issue). */
function ActionRow({
  href,
  icon,
  iconClass,
  title,
  subtitle,
}: {
  href: string;
  icon: string;
  iconClass: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-card"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-ink">{title}</span>
        <span className="block text-xs text-ink-muted">{subtitle}</span>
      </span>
      <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-ink-muted" />
    </Link>
  );
}

/**
 * TripDetailView — the full trip screen (`/trips/[id]`): the overview
 * card (summary + map + expandable details & dispatch note), a progress
 * strip, the Submit / Expense / Report-an-Issue actions and the stop
 * timeline.
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
      {/* Summary + map + expandable trip details */}
      <TripOverviewCard trip={trip} variant={variant} />

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

      {/* Submit a trip expense */}
      <ActionRow
        href="/expenses/new"
        icon="dollar"
        iconClass="bg-brand-light text-brand"
        title="Expense"
        subtitle="Submit an expense for this trip"
      />

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

      {/* Report an issue → the work-order / maintenance request form */}
      <ActionRow
        href="/maintenance/new"
        icon="wrench"
        iconClass="bg-danger/10 text-danger"
        title="Report an Issue"
        subtitle="Send a maintenance request to the office"
      />
    </div>
  );
}
