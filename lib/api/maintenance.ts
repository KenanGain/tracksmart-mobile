/**
 * Maintenance service — work-order request options + submit.
 *
 * Frontend ⇄ this file ⇄ lib/data/maintenance.ts (mock backend).
 */
import {
  issueCategories,
  workOrderCategories,
  workOrderReasons,
  assetNumbers,
  type AssetType,
  type WorkOrderDraft,
} from "@/lib/data/maintenance";

export type WorkOrderOptions = {
  categories: string[];
  workOrderCategories: string[];
  reasons: string[];
  assetNumbers: Record<AssetType, string>;
};

/** The option lists for the Request Work Order form. */
export async function getWorkOrderOptions(): Promise<WorkOrderOptions> {
  return {
    categories: issueCategories,
    workOrderCategories,
    reasons: workOrderReasons,
    assetNumbers,
  };
}

/** Submit a work-order / maintenance request. Mock — resolves only. */
export async function submitWorkOrder(_draft: WorkOrderDraft): Promise<void> {
  return;
}
