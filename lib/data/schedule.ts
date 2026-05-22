/**
 * Mock backend — the driver's schedule: scheduled shifts and the clock
 * records that back the calendar's timesheet.
 *
 * Backend side of the mockup; the frontend reaches this through
 * `lib/api/schedule.ts`.
 */

/** A scheduled working shift. */
export type Shift = {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Shift name, e.g. "Day Shift". */
  label: string;
  /** Display start time, e.g. "08:00 AM". */
  startTime: string;
  /** Display end time, e.g. "04:30 PM". */
  endTime: string;
  /** Where the shift reports from. */
  location: string;
};

/** A clock in/out record for one day — drives the timesheet. */
export type ClockRecord = {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Display clock-in time, e.g. "07:52 AM". */
  clockIn: string;
  /** Display clock-out time; `null` while still on the clock. */
  clockOut: string | null;
  /** Hours worked; `null` while the shift is still open. */
  hours: number | null;
};

/** Scheduled shifts for the driver. */
export const shifts: Shift[] = [
  {
    id: "sh-0514",
    date: "2026-05-14",
    label: "Day Shift",
    startTime: "08:00 AM",
    endTime: "04:30 PM",
    location: "Guelph Terminal",
  },
  {
    id: "sh-0515",
    date: "2026-05-15",
    label: "Day Shift",
    startTime: "06:00 AM",
    endTime: "02:30 PM",
    location: "Guelph Terminal",
  },
  {
    id: "sh-0519",
    date: "2026-05-19",
    label: "Long Haul",
    startTime: "07:30 AM",
    endTime: "05:30 PM",
    location: "Toronto Yard",
  },
  {
    id: "sh-0521",
    date: "2026-05-21",
    label: "Day Shift",
    startTime: "07:45 AM",
    endTime: "04:00 PM",
    location: "Guelph Terminal",
  },
  {
    id: "sh-0522",
    date: "2026-05-22",
    label: "Day Shift",
    startTime: "08:00 AM",
    endTime: "04:30 PM",
    location: "Guelph Terminal",
  },
  {
    id: "sh-0526",
    date: "2026-05-26",
    label: "Long Haul",
    startTime: "06:30 AM",
    endTime: "06:00 PM",
    location: "Toronto Yard",
  },
  {
    id: "sh-0527",
    date: "2026-05-27",
    label: "Day Shift",
    startTime: "08:00 AM",
    endTime: "04:30 PM",
    location: "Guelph Terminal",
  },
  {
    id: "sh-0528",
    date: "2026-05-28",
    label: "Day Shift",
    startTime: "08:00 AM",
    endTime: "04:30 PM",
    location: "Guelph Terminal",
  },
];

/**
 * Clock records. Past shifts are closed; the current day's record has a
 * `null` clockOut — the driver is still on the clock.
 */
export const clockRecords: ClockRecord[] = [
  { date: "2026-05-14", clockIn: "07:52 AM", clockOut: "04:38 PM", hours: 8.8 },
  { date: "2026-05-15", clockIn: "05:58 AM", clockOut: "02:41 PM", hours: 8.7 },
  { date: "2026-05-19", clockIn: "07:40 AM", clockOut: "05:46 PM", hours: 10.1 },
  { date: "2026-05-21", clockIn: "07:48 AM", clockOut: null, hours: null },
];

/** ISO dates the driver is scheduled to work (derived from `shifts`). */
export const workingDates: string[] = shifts.map((shift) => shift.date);
