/**
 * Calendar service — scheduled events for the Calendar screen.
 *
 * Frontend ⇄ this file ⇄ lib/data/calendar-events.ts (mock backend).
 */
import {
  calendarEvents,
  type CalendarEvent,
} from "@/lib/data/calendar-events";

/** All calendar events, sorted by date. */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  return [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date));
}
