"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Shift } from "@/lib/data/schedule";
import type {
  CalendarEvent,
  CalendarEventKind,
} from "@/lib/data/calendar-events";
import type { LoadTender } from "@/lib/data/bulletin";

/** Icon + colour per event kind. */
const KIND: Record<
  CalendarEventKind,
  { icon: string; dot: string; tag: string; tagText: string }
> = {
  delivery: {
    icon: "package",
    dot: "bg-brand",
    tag: "Delivery",
    tagText: "text-brand",
  },
  pickup: {
    icon: "package",
    dot: "bg-success",
    tag: "Pickup",
    tagText: "text-success",
  },
  meeting: {
    icon: "user",
    dot: "bg-warning",
    tag: "Meeting",
    tagText: "text-warning",
  },
  maintenance: {
    icon: "truck",
    dot: "bg-danger",
    tag: "Maintenance",
    tagText: "text-danger",
  },
  reminder: {
    icon: "bell",
    dot: "bg-ink-muted",
    tag: "Reminder",
    tagText: "text-ink-muted",
  },
};

/** One row in the agenda. */
type AgendaItem = {
  id: string;
  date: string;
  icon: string;
  dot: string;
  title: string;
  subtitle: string;
  tag: string;
  tagText: string;
};

/** Local YYYY-MM-DD for today (no timezone shift). */
function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** "Thursday, May 22" from an ISO date. */
function dayHeading(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * CalendarEventsList — the Schedule "List" view: a date-grouped agenda
 * combining shifts, scheduled events and load tenders.
 */
export function CalendarEventsList({
  shifts,
  calendarEvents,
  loads,
}: {
  shifts: Shift[];
  calendarEvents: CalendarEvent[];
  loads: LoadTender[];
}) {
  const [today] = useState(todayIso);

  // Build a single agenda list from the three sources.
  const items: AgendaItem[] = [
    ...shifts.map((shift) => ({
      id: `shift-${shift.id}`,
      date: shift.date,
      icon: "clock",
      dot: "bg-brand",
      title: shift.label,
      subtitle: `${shift.startTime} – ${shift.endTime} · ${shift.location}`,
      tag: "Shift",
      tagText: "text-brand",
    })),
    ...calendarEvents.map((event) => {
      const kind = KIND[event.kind];
      return {
        id: `event-${event.id}`,
        date: event.date,
        icon: kind.icon,
        dot: kind.dot,
        title: event.title,
        subtitle: event.time,
        tag: kind.tag,
        tagText: kind.tagText,
      };
    }),
    ...loads.map((load) => ({
      id: `load-${load.id}`,
      date: load.date,
      icon: "truck",
      dot: "bg-ink-muted",
      title: `${load.origin} → ${load.destination}`,
      subtitle: `Pickup ${load.pickupTime} · Delivery ${load.deliveryTime}`,
      tag: "Load Tender",
      tagText: "text-ink-muted",
    })),
  ];

  // Group by date, sorted ascending.
  const dates = [...new Set(items.map((i) => i.date))].sort();

  if (items.length === 0) {
    return (
      <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
        Nothing scheduled.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {dates.map((date) => (
        <section key={date}>
          {/* Date header */}
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-ink">{dayHeading(date)}</h2>
            {date === today && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Today
              </span>
            )}
          </div>

          {/* Items for the date */}
          <ul className="mt-2 space-y-2">
            {items
              .filter((item) => item.date === date)
              .map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-card"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.dot} text-white`}
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {item.subtitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-semibold ${item.tagText}`}
                  >
                    {item.tag}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
