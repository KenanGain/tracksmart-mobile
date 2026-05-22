/**
 * Expense service — the Submit Expense wizard's data + submission.
 *
 * Frontend ⇄ this file. `submitExpense` is a mock today; a real build
 * would POST the draft to the TrackSmart API.
 */
import {
  expenseRecords,
  type ExpenseRecord,
  type ExpenseType,
} from "@/lib/data/expenses";

export type { ExpenseType };
export type ExpenseCategory = "truck" | "trailer" | "general";
export type Currency = "USD" | "CAD";
export type ExpenseCountry = "USA" | "Canada" | "Mexico";

/** The data collected across the Submit Expense wizard steps. */
export type ExpenseDraft = {
  type: ExpenseType | null;
  amount: string;
  currency: Currency;
  description: string;
  notes: string;
  category: ExpenseCategory | null;
  truckUnit: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: string;
  vendorAddress: string;
  vendorCity: string;
  vendorState: string;
  vendorCountry: ExpenseCountry;
};

export const EMPTY_EXPENSE_DRAFT: ExpenseDraft = {
  type: null,
  amount: "",
  currency: "CAD",
  description: "",
  notes: "",
  category: null,
  truckUnit: "",
  vendorName: "",
  invoiceNo: "",
  invoiceDate: "",
  vendorAddress: "",
  vendorCity: "",
  vendorState: "",
  vendorCountry: "USA",
};

/** Mock — submits the expense for review. No real backend yet. */
export async function submitExpense(
  draft: ExpenseDraft,
): Promise<{ ok: true }> {
  void draft; // a real build POSTs this to the API
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true };
}

/** Submitted expenses (newest first) — for the Status list. */
export async function getExpenses(): Promise<ExpenseRecord[]> {
  return expenseRecords;
}
