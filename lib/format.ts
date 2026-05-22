/** Date formatting helpers. Shared so every screen renders dates alike. */

/** Parses a date-only ISO string (YYYY-MM-DD) at local midday (no TZ shift). */
function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00`);
}

/** Formats an ISO date as e.g. "Nov 17, 2026". */
export function formatDate(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Whole days from today until the given ISO date (negative = in the past). */
export function daysUntil(isoDate: string): number {
  const ms = parseIsoDate(isoDate).getTime() - Date.now();
  return Math.round(ms / 86_400_000);
}

/** Uppercase short month, e.g. "OCT". */
export function monthShort(isoDate: string): string {
  return parseIsoDate(isoDate)
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
}

/** Day of the month (1–31). */
export function dayOfMonth(isoDate: string): number {
  return parseIsoDate(isoDate).getDate();
}
