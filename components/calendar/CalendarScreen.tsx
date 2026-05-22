"use client";

import { useState } from "react";
import { CalendarEventsList } from "./CalendarEventsList";
import { CalendarView } from "./CalendarView";
import type { LoadTender } from "@/lib/data/bulletin";
import type { Shift, ClockRecord } from "@/lib/data/schedule";
import type { CalendarEvent } from "@/lib/data/calendar-events";

type View = "calendar" | "list";

/**
 * CalendarScreen — the Calendar tab. A toggle switches between the
 * month-grid Calendar view and the upcoming-loads List view.
 */
export function CalendarScreen({
  loads,
  workingDates,
  shifts,
  clockRecords,
  calendarEvents,
}: {
  loads: LoadTender[];
  workingDates: string[];
  shifts: Shift[];
  clockRecords: ClockRecord[];
  calendarEvents: CalendarEvent[];
}) {
  const [view, setView] = useState<View>("calendar");

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex gap-1 rounded-lg bg-surface-muted p-1">
        {(["calendar", "list"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setView(option)}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
              view === option ? "bg-brand text-white" : "text-ink-muted"
            }`}
          >
            {option === "calendar" ? "Calendar" : "List"}
          </button>
        ))}
      </div>

      {view === "calendar" ? (
        <CalendarView
          workingDates={workingDates}
          shifts={shifts}
          clockRecords={clockRecords}
          calendarEvents={calendarEvents}
        />
      ) : (
        <CalendarEventsList events={loads} />
      )}
    </div>
  );
}
