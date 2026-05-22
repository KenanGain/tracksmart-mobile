import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrip } from "@/lib/api/trips";
import { TripDetailView } from "@/components/trips/TripDetailView";

export const metadata: Metadata = { title: "Trip" };

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getTrip(id);
  if (!result) notFound();
  return <TripDetailView trip={result.trip} variant={result.variant} />;
}
