import type { Metadata } from "next";
import { getTrips } from "@/lib/api/trips";
import { TripCard } from "@/components/trips/TripCard";

export const metadata: Metadata = { title: "Trip History" };

export default async function TripHistoryPage() {
  const { previous } = await getTrips();

  return (
    <section className="space-y-4">
      <p className="text-sm text-ink-muted">
        {previous.length} completed {previous.length === 1 ? "trip" : "trips"}.
      </p>

      {previous.length === 0 ? (
        <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
          No completed trips yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {previous.map((trip) => (
            <li key={trip.id}>
              <TripCard trip={trip} variant="previous" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
