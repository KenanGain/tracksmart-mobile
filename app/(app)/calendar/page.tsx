import type { Metadata } from "next";
import { getUpcomingEvents } from "@/lib/api/bulletin";
import { getWorkingDates, getShifts, getClockRecords } from "@/lib/api/schedule";
import { getCalendarEvents } from "@/lib/api/calendar";
import { CalendarScreen } from "@/components/calendar/CalendarScreen";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const [loads, workingDates, shifts, clockRecords, calendarEvents] =
    await Promise.all([
      getUpcomingEvents(),
      getWorkingDates(),
      getShifts(),
      getClockRecords(),
      getCalendarEvents(),
    ]);

  return (
    <CalendarScreen
      loads={loads}
      workingDates={workingDates}
      shifts={shifts}
      clockRecords={clockRecords}
      calendarEvents={calendarEvents}
    />
  );
}
