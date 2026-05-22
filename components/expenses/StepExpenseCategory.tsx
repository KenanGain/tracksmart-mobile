import type { ExpenseCategory, ExpenseDraft } from "@/lib/api/expenses";

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "truck", label: "Truck Expense" },
  { value: "trailer", label: "Trailer Expense" },
  { value: "general", label: "General Expense" },
];

/**
 * Step 4 — Expense Category. Pick a category, optionally tag a truck.
 */
export function StepExpenseCategory({
  draft,
  update,
}: {
  draft: ExpenseDraft;
  update: (patch: Partial<ExpenseDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-ink">Expense Category</h2>
        <div className="mt-4 space-y-3">
          {CATEGORIES.map((category) => {
            const selected = draft.category === category.value;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => update({ category: category.value })}
                className={`w-full rounded-card border-2 p-4 text-left text-base font-bold shadow-card transition-colors ${
                  selected
                    ? "border-brand bg-brand-light/40 text-brand"
                    : "border-transparent bg-surface text-ink"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-ink">
          Select Truck (Optional)
        </h3>
        <input
          value={draft.truckUnit}
          onChange={(e) => update({ truckUnit: e.target.value })}
          placeholder="Search truck unit..."
          className="mt-3 w-full rounded-lg border border-slate-200 bg-surface px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-brand/30"
        />
      </div>
    </div>
  );
}
