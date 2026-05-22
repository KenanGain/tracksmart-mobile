import { monthShort, dayOfMonth } from "@/lib/format";
import type { LoadTender } from "@/lib/data/bulletin";

/**
 * CalendarEventsList — upcoming load tenders shown as calendar events,
 * each with a date chip.
 */
export function CalendarEventsList({ events }: { events: LoadTender[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">Upcoming Loads</h2>

      {events.length === 0 ? (
        <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
          No upcoming events.
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex gap-3 rounded-card bg-surface p-4 shadow-card"
            >
              {/* Date chip */}
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-light">
                <span className="text-[10px] font-bold uppercase tracking-wide text-brand">
                  {monthShort(event.date)}
                </span>
                <span className="text-lg font-bold leading-none text-brand">
                  {dayOfMonth(event.date)}
                </span>
              </div>

              {/* Event detail */}
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">
                  {event.origin} → {event.destination}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Pickup {event.pickupTime} · Delivery {event.deliveryTime}
                </p>
                <p className="mt-1 text-xs font-semibold text-brand">
                  Load Tender
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
