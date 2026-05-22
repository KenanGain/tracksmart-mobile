/**
 * Mock backend — events the driver has on the calendar (deliveries,
 * pickups, meetings, maintenance, reminders).
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/calendar.ts`. New events scheduled in the UI are kept in
 * component state for the prototype — a real backend would persist here.
 */

/** Event category — drives the colour accent on the calendar. */
export type CalendarEventKind =
  | "delivery"
  | "pickup"
  | "meeting"
  | "maintenance"
  | "reminder";

export type CalendarEvent = {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  /** Display time, e.g. "10:00 AM". */
  time: string;
  kind: CalendarEventKind;
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: "ev-0519",
    date: "2026-05-19",
    title: "Trailer maintenance check",
    time: "01:00 PM",
    kind: "maintenance",
  },
  {
    id: "ev-0521",
    date: "2026-05-21",
    title: "POD drop-off — Varennes depot",
    time: "11:30 AM",
    kind: "delivery",
  },
  {
    id: "ev-0522",
    date: "2026-05-22",
    title: "Load pickup — Guelph terminal",
    time: "07:00 AM",
    kind: "pickup",
  },
  {
    id: "ev-0526",
    date: "2026-05-26",
    title: "Safety briefing with dispatch",
    time: "09:00 AM",
    kind: "meeting",
  },
  {
    id: "ev-0528",
    date: "2026-05-28",
    title: "Licence renewal reminder",
    time: "08:00 AM",
    kind: "reminder",
  },
];
