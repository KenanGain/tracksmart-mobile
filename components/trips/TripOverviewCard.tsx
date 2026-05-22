"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { TripSummary } from "./TripCard";
import { TripMap } from "./TripMap";
import type { Trip } from "@/lib/data/trips";
import type { TripVariant } from "@/lib/api/trips";

/**
 * TripOverviewCard — the trip detail header: the summary + route map and
 * an expandable **Trip Details** section (equipment, drivers, dispatch),
 * combined into one card. Tapping the Trip Details row expands it.
 */
export function TripOverviewCard({
  trip,
  variant,
}: {
  trip: Trip;
  variant: TripVariant;
}) {
  const [open, setOpen] = useState(false);

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
    <div className="overflow-hidden rounded-card bg-surface shadow-card">
      {/* Summary */}
      <div className="p-4">
        <TripSummary trip={trip} variant={variant} />
      </div>

      {/* Route map */}
      <div className="px-4 pb-4">
        <TripMap stops={trip.stops} />
      </div>

      {/* Expandable trip details */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 border-t border-ink/5 p-4"
      >
        <p className="text-sm font-bold text-ink">Trip Details</p>
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          className="h-5 w-5 text-ink-muted"
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-ink/5 p-4">
          {trip.note && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-warning">
                <Icon name="info" className="h-3.5 w-3.5" />
                Dispatch Note
              </p>
              <p className="mt-1 text-sm text-ink">{trip.note}</p>
            </div>
          )}
          <dl className="space-y-2.5">
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
      )}
    </div>
  );
}
