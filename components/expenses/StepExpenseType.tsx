import type { ExpenseType } from "@/lib/api/expenses";

const TYPES: { value: ExpenseType; title: string; description: string }[] = [
  {
    value: "payroll",
    title: "Payroll Addition",
    description:
      "Request reimbursement for out-of-pocket expenses. Requires approval before being added to your payroll.",
  },
  {
    value: "company",
    title: "Company Paid",
    description:
      "Submit receipts for purchases the company will pay directly.",
  },
];

/**
 * Step 1 — Select Expense Type. Both types run through the same flow.
 */
export function StepExpenseType({
  onSelect,
}: {
  onSelect: (type: ExpenseType) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Select Expense Type</h2>

      <div className="mt-4 space-y-3">
        {TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onSelect(type.value)}
            className="w-full rounded-card bg-surface p-5 text-left shadow-card"
          >
            <p className="text-base font-bold text-ink">{type.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
