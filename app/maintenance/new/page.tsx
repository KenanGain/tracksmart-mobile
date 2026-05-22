import type { Metadata } from "next";
import { getWorkOrderOptions } from "@/lib/api/maintenance";
import { RequestWorkOrderForm } from "@/components/maintenance/RequestWorkOrderForm";

export const metadata: Metadata = { title: "Request Work Order" };

export default async function RequestWorkOrderPage() {
  const options = await getWorkOrderOptions();
  return <RequestWorkOrderForm options={options} />;
}
