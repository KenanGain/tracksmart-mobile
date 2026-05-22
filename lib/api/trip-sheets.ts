/**
 * Trip-sheet service — submission + the Status list.
 *
 * Frontend ⇄ this file ⇄ lib/data/trip-sheets.ts (mock backend).
 * `submitTripSheet` is a mock; a real build would POST to the API.
 */
import {
  tripSheetRecords,
  type TripSheetRecord,
} from "@/lib/data/trip-sheets";

/** What the Submit Trip Sheet form sends. */
export type TripSheetSubmission = {
  periodStart: string;
  periodEnd: string;
  note: string;
};

/** Mock — submits a trip sheet for review. No real backend yet. */
export async function submitTripSheet(
  submission: TripSheetSubmission,
): Promise<{ ok: true }> {
  void submission; // a real build POSTs this to the API
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true };
}

/** Submitted trip sheets (newest first) — for the Status list. */
export async function getTripSheets(): Promise<TripSheetRecord[]> {
  return tripSheetRecords;
}
