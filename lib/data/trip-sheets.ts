/**
 * Mock backend — submitted trip-sheet records (for the Status list).
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/trip-sheets.ts`.
 */
export type TripSheetStatus = "pending" | "approved" | "rejected";

export type TripSheetRecord = {
  id: string;
  /** Period covered — ISO dates (YYYY-MM-DD). */
  periodStart: string;
  periodEnd: string;
  status: TripSheetStatus;
  /** ISO date the sheet was submitted. */
  submittedAt: string;
};

/** Newest first. */
export const tripSheetRecords: TripSheetRecord[] = [
  {
    id: "ts-2026-0516",
    periodStart: "2026-05-16",
    periodEnd: "2026-05-21",
    status: "pending",
    submittedAt: "2026-05-21",
  },
  {
    id: "ts-2026-0501",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-15",
    status: "approved",
    submittedAt: "2026-05-16",
  },
  {
    id: "ts-2026-0416",
    periodStart: "2026-04-16",
    periodEnd: "2026-04-30",
    status: "approved",
    submittedAt: "2026-05-01",
  },
];
