import { Icon } from "@/components/ui/Icon";
import type { Trip } from "@/lib/data/trips";

type StringField =
  | "startDate"
  | "leadDriver"
  | "teamDriver"
  | "dispatchedBy"
  | "issuedOn";

const ROWS: { icon: string; label: string; field: StringField }[] = [
  { icon: "calendar", label: "Start date", field: "startDate" },
  { icon: "user", label: "Lead driver", field: "leadDriver" },
  { icon: "user", label: "Team driver", field: "teamDriver" },
  { icon: "user", label: "Dispatched by", field: "dispatchedBy" },
  { icon: "clock", label: "Issued on", field: "issuedOn" },
];

/**
 * TripItineraryCard — the trip summary card. `current` is solid blue,
 * `previous` is a light-blue tint. A status pill sits in the header.
 */
export function TripItineraryCard({
  trip,
  variant,
}: {
  trip: Trip;
  variant: "current" | "previous";
}) {
  const isCurrent = variant === "current";

  return (
    <div
      className={`rounded-card p-5 shadow-card ${
        isCurrent ? "bg-brand text-white" : "bg-brand-light text-ink"
      }`}
    >
      {/* Header — title + status pill */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-medium uppercase tracking-wide ${
              isCurrent ? "text-white/70" : "text-ink-muted"
            }`}
          >
            Driver Trip Itinerary
          </p>
          <p className="text-lg font-bold">{trip.id}</p>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            isCurrent
              ? "bg-white/15 text-white"
              : "bg-success/10 text-success"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isCurrent ? "bg-white" : "bg-success"
            }`}
          />
          {isCurrent ? "In Progress" : "Completed"}
        </span>
      </div>

      <dl
        className={`mt-4 space-y-2.5 border-t pt-4 ${
          isCurrent ? "border-white/20" : "border-ink/10"
        }`}
      >
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3"
          >
            <dt
              className={`flex items-center gap-2 text-sm ${
                isCurrent ? "text-white/80" : "text-ink-muted"
              }`}
            >
              <Icon name={row.icon} className="h-4 w-4" />
              {row.label}
            </dt>
            <dd className="text-right text-sm font-semibold">
              {trip[row.field] || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
