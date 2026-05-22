"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import type { ExpenseRecord } from "@/lib/data/expenses";

/**
 * ExpenseStatusList — the "Status" view: submitted expenses and their
 * approval status. Reached from Home → Expenses → "Status".
 */
export function ExpenseStatusList({
  expenses,
}: {
  expenses: ExpenseRecord[];
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-ink">
          Expense Status
        </h1>
        <span className="w-9 shrink-0" aria-hidden="true" />
      </header>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {expenses.length === 0 ? (
          <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
            No expenses submitted yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="rounded-card bg-surface p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-ink">
                    {expense.description}
                  </p>
                  <StatusBadge status={expense.status} />
                </div>
                <p className="mt-1 text-xs font-medium text-ink-muted">
                  {expense.amount} {expense.currency} ·{" "}
                  {formatDate(expense.submittedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
