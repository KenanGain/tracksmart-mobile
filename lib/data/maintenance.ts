/**
 * Mock backend — maintenance / work-order request options.
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/maintenance.ts`. The "Request Work Order" form is also the
 * maintenance-request form (one form, two entry points: the Home
 * Maintenance card and a trip's "Report an Issue").
 */

export type AssetType = "Truck" | "Trailer";

export type WorkOrderPriority = "Low" | "Medium" | "High" | "Critical";

/** A submitted work-order request. */
export type WorkOrderDraft = {
  asset: AssetType;
  priority: WorkOrderPriority;
  category: string;
  workOrderCategory: string;
  reason: string;
  description: string;
  notes: string;
  odometer: string;
};

/** Issue categories — the affected system / part. */
export const issueCategories: string[] = [
  "Engine",
  "Transmission",
  "Brakes",
  "Tires & Wheels",
  "Electrical",
  "Lights",
  "Body & Cab",
  "Refrigeration Unit",
  "HVAC",
  "Other",
];

/** Work-order categories — the type of work requested. */
export const workOrderCategories: string[] = [
  "Repair",
  "Preventive Maintenance",
  "Inspection",
  "Diagnostic",
  "Other",
];

/** Reasons the work order was raised. */
export const workOrderReasons: string[] = [
  "Breakdown",
  "Scheduled Service",
  "Damage",
  "Recall",
  "Wear & Tear",
  "Other",
];

/** Asset numbers available to the signed-in driver. */
export const assetNumbers: Record<AssetType, string> = {
  Truck: "001",
  Trailer: "RL8095",
};
