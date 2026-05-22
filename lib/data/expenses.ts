/**
 * Mock backend — submitted expense records (for the Status list).
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/expenses.ts`.
 */
export type ExpenseStatus = "pending" | "approved" | "rejected";

export type ExpenseRecord = {
  id: string;
  description: string;
  amount: string;
  currency: "USD" | "CAD";
  status: ExpenseStatus;
  /** ISO date (YYYY-MM-DD). */
  submittedAt: string;
};

/** Newest first. */
export const expenseRecords: ExpenseRecord[] = [
  {
    id: "exp-2026-018",
    description: "Lumper fee",
    amount: "80.00",
    currency: "USD",
    status: "pending",
    submittedAt: "2026-05-18",
  },
  {
    id: "exp-2026-012",
    description: "Hotel — overnight stop",
    amount: "142.50",
    currency: "CAD",
    status: "approved",
    submittedAt: "2026-05-12",
  },
  {
    id: "exp-2026-005",
    description: "Truck wash",
    amount: "35.00",
    currency: "CAD",
    status: "rejected",
    submittedAt: "2026-05-05",
  },
];
