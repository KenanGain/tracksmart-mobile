/**
 * Trips service — driver trips for the Trips screen.
 *
 * Frontend ⇄ this file ⇄ lib/data/trips.ts (mock backend).
 */
import {
  currentTrip,
  upcomingTrips,
  previousTrips,
  type Trip,
} from "@/lib/data/trips";

export type TripsData = {
  current: Trip | null;
  upcoming: Trip[];
  previous: Trip[];
};

/** Current, upcoming and previous trips for the signed-in driver. */
export async function getTrips(): Promise<TripsData> {
  return {
    current: currentTrip,
    upcoming: upcomingTrips,
    previous: previousTrips,
  };
}
