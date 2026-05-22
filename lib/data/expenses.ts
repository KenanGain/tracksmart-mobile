/**
 * Mock backend — submitted expense records (for the Status list).
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/expenses.ts`.
 */
export type ExpenseStatus = "pending" | "approved" | "rejected";

/** How the expense is paid — the two flows in the Submit Expense wizard. */
export type ExpenseType = "payroll" | "company";

export type ExpenseRecord = {
  id: string;
  description: string;
  amount: string;
  currency: "USD" | "CAD";
  status: ExpenseStatus;
  /** Payroll Addition or Company Paid. */
  expenseType: ExpenseType;
  /** Trip the expense belongs to (trip id / number). */
  tripId: string;
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
    expenseType: "company",
    tripId: "12851",
    submittedAt: "2026-05-18",
  },
  {
    id: "exp-2026-012",
    description: "Hotel — overnight stop",
    amount: "142.50",
    currency: "CAD",
    status: "approved",
    expenseType: "payroll",
    tripId: "12839",
    submittedAt: "2026-05-12",
  },
  {
    id: "exp-2026-005",
    description: "Truck wash",
    amount: "35.00",
    currency: "CAD",
    status: "rejected",
    expenseType: "company",
    tripId: "12831",
    submittedAt: "2026-05-05",
  },
];
