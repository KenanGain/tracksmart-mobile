import type { Metadata } from "next";
import { SubmitTripSheetForm } from "@/components/trip-sheets/SubmitTripSheetForm";

export const metadata: Metadata = { title: "Submit Trip Sheet" };

export default function SubmitTripSheetPage() {
  return <SubmitTripSheetForm />;
}
