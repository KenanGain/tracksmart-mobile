import type { Metadata } from "next";
import { getTripSheets } from "@/lib/api/trip-sheets";
import { TripSheetStatusList } from "@/components/trip-sheets/TripSheetStatusList";

export const metadata: Metadata = { title: "Trip Sheets" };

export default async function TripSheetsPage() {
  const tripSheets = await getTripSheets();
  return <TripSheetStatusList tripSheets={tripSheets} />;
}
