/**
 * Schedule service — shifts and clock records for the Calendar screen.
 *
 * Frontend ⇄ this file ⇄ lib/data/schedule.ts (mock backend).
 */
import {
  shifts,
  clockRecords,
  workingDates,
  type Shift,
  type ClockRecord,
} from "@/lib/data/schedule";

/** ISO dates the driver is scheduled to work. */
export async function getWorkingDates(): Promise<string[]> {
  return workingDates;
}

/** All scheduled shifts. */
export async function getShifts(): Promise<Shift[]> {
  return shifts;
}

/** All clock in/out records (the timesheet source). */
export async function getClockRecords(): Promise<ClockRecord[]> {
  return clockRecords;
}
