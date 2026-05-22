import type { Metadata } from "next";
import { getTrips } from "@/lib/api/trips";
import { TripsView } from "@/components/trips/TripsView";

export const metadata: Metadata = { title: "Trips" };

export default async function TripsPage() {
  const trips = await getTrips();
  return <TripsView trips={trips} />;
}
