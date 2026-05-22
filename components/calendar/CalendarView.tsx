"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ScheduleEventSheet } from "./ScheduleEventSheet";
import type { Shift, ClockRecord } from "@/lib/data/schedule";
import type {
  CalendarEvent,
  CalendarEventKind,
} from "@/lib/data/calendar-events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Colour + label per event kind. */
const KIND_STYLES: Record<
  CalendarEventKind,
  { label: string; accent: string; text: string }
> = {
  delivery: { label: "Delivery", accent: "bg-brand", text: "text-brand" },
  pickup: { label: "Pickup", accent: "bg-success", text: "text-success" },
  meeting: { label: "Meeting", accent: "bg-warning", text: "text-warning" },
  maintenance: {
    label: "Maintenance",
    accent: "bg-danger",
    text: "text-danger",
  },
  reminder: {
    label: "Reminder",
    accent: "bg-ink-muted",
    text: "text-ink-muted",
  },
};

/** Local YYYY-MM-DD for a Date (no timezone shift). */
function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type Cell = { date: Date; iso: string; inMonth: boolean };

/**
 * CalendarView — a month grid with prev/next navigation. Each day block
 * shows dots for a working day, scheduled events and a clock record.
 * Below the grid: the selected day's events, shifts and timesheet, plus a
 * "Schedule Event" action.
 */
export function CalendarView({
  workingDates,
  shifts,
  clockRecords,
  calendarEvents,
}: {
  workingDates: string[];
  shifts: Shift[];
  clockRecords: ClockRecord[];
  calendarEvents: CalendarEvent[];
}) {
  // Lazy init so values are stable between SSR and hydration.
  const [todayIso] = useState(() => toIso(new Date()));
  const today = new Date(`${todayIso}T12:00:00`);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(todayIso);
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [sheetOpen, setSheetOpen] = useState(false);

  const working = new Set(workingDates);
  const clockedDates = new Set(clockRecords.map((r) => r.date));

  // 42 cells (6 weeks) starting on the Sunday on/before the 1st.
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(viewYear, viewMonth, 1 - firstWeekday + i);
    cells.push({
      date,
      iso: toIso(date),
      inMonth: date.getMonth() === viewMonth,
    });
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const selectedLabel = new Date(`${selected}T12:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "short", month: "long", day: "numeric" },
  );
  const selectedEvents = events.filter((e) => e.date === selected);
  const selectedShifts = shifts.filter((s) => s.date === selected);
  const selectedClock = clockRecords.find((r) => r.date === selected) ?? null;

  return (
    <div className="space-y-4">
      {/* Month grid */}
      <div className="rounded-card bg-surface p-3 shadow-card">
        {/* Month navigation */}
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
          >
            <Icon name="chevron-left" className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-bold text-ink">{monthLabel}</h2>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
          >
            <Icon name="chevron-right" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="py-1 text-center text-xs font-medium text-ink-muted"
            >
              {day}
            </span>
          ))}

          {cells.map((cell) => {
            const isToday = cell.iso === todayIso;
            const isSelected = cell.iso === selected;
            const isWorking = working.has(cell.iso);
            const hasEvent = events.some((e) => e.date === cell.iso);
            const hasClock = clockedDates.has(cell.iso);
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelected(cell.iso)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg bg-surface-muted text-sm font-medium ${
                  cell.inMonth ? "text-ink" : "text-ink-muted/40"
                } ${
                  isSelected
                    ? "ring-2 ring-ink"
                    : isToday
                      ? "ring-1 ring-brand/50"
                      : ""
                }`}
              >
                {cell.date.getDate()}
                <span className="absolute bottom-1 flex gap-0.5">
                  {isWorking && (
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  )}
                  {hasEvent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  )}
                  {hasClock && (
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex justify-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Working
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Event
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            Clocked in
          </span>
        </div>
      </div>

      {/* Selected day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">{selectedLabel}</h2>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Icon name="plus" className="h-4 w-4" />
            Schedule
          </button>
        </div>

        {/* Events */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Events
          </p>
          {selectedEvents.length === 0 ? (
            <div className="mt-2 rounded-card bg-surface p-4 text-center text-sm text-ink-muted shadow-card">
              No events scheduled
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedEvents.map((event) => {
                const style = KIND_STYLES[event.kind];
                return (
                  <li
                    key={event.id}
                    className="flex gap-3 rounded-card bg-surface p-3 shadow-card"
                  >
                    <span
                      className={`mt-0.5 h-full w-1 shrink-0 rounded-full ${style.accent}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {event.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {event.time}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[11px] font-semibold ${style.text}`}
                    >
                      {style.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Shifts */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Shifts
          </p>
          {selectedShifts.length === 0 ? (
            <div className="mt-2 rounded-card bg-surface p-4 text-center text-sm text-ink-muted shadow-card">
              No shifts scheduled
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedShifts.map((shift) => (
                <li
                  key={shift.id}
                  className="rounded-card bg-surface p-3 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      {shift.label}
                    </p>
                    <p className="text-xs font-semibold text-brand">
                      {shift.startTime} – {shift.endTime}
                    </p>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    <Icon name="map-pin" className="h-3.5 w-3.5" />
                    {shift.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Timesheet */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Timesheet
          </p>
          {selectedClock === null ? (
            <div className="mt-2 rounded-card bg-surface p-4 text-center text-sm text-ink-muted shadow-card">
              No clock records
            </div>
          ) : (
            <div className="mt-2 rounded-card bg-surface p-4 shadow-card">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Clock in</span>
                <span className="font-semibold text-ink">
                  {selectedClock.clockIn}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-ink-muted">Clock out</span>
                <span className="font-semibold text-ink">
                  {selectedClock.clockOut ?? "On the clock"}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-ink/5 pt-2 text-sm">
                <span className="text-ink-muted">Hours worked</span>
                <span
                  className={`font-bold ${
                    selectedClock.hours === null ? "text-warning" : "text-ink"
                  }`}
                >
                  {selectedClock.hours === null
                    ? "In progress"
                    : `${selectedClock.hours.toFixed(1)} h`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ScheduleEventSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        defaultDate={selected}
        onAdd={(event) => setEvents((prev) => [...prev, event])}
      />
    </div>
  );
}
