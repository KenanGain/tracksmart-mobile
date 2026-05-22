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

/** Which section a trip belongs to. */
export type TripVariant = "current" | "upcoming" | "previous";

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

/** One trip by id, with the section it belongs to — or `null`. */
export async function getTrip(
  id: string,
): Promise<{ trip: Trip; variant: TripVariant } | null> {
  if (currentTrip.id === id) {
    return { trip: currentTrip, variant: "current" };
  }
  const upcoming = upcomingTrips.find((trip) => trip.id === id);
  if (upcoming) return { trip: upcoming, variant: "upcoming" };

  const previous = previousTrips.find((trip) => trip.id === id);
  if (previous) return { trip: previous, variant: "previous" };

  return null;
}
