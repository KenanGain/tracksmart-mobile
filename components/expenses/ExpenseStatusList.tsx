"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { PillTabs } from "@/components/ui/PillTabs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import type { ExpenseRecord, ExpenseType } from "@/lib/data/expenses";

const TABS = [
  { key: "payroll", label: "Payroll Addition", icon: "dollar" },
  { key: "company", label: "Company Paid", icon: "building" },
];

/**
 * ExpenseStatusList — the "Status" view: submitted expenses and their
 * approval status, split by expense type (Payroll Addition / Company
 * Paid) with a search field. Reached from Home → Expenses → "Status".
 */
export function ExpenseStatusList({
  expenses,
}: {
  expenses: ExpenseRecord[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<ExpenseType>("payroll");
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = expenses.filter(
    (expense) =>
      expense.expenseType === tab &&
      (term === "" ||
        `${expense.description} ${expense.tripId}`
          .toLowerCase()
          .includes(term)),
  );

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

      {/* Tabs + search + list */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <PillTabs
          tabs={TABS}
          active={tab}
          onChange={(key) => setTab(key as ExpenseType)}
        />

        {/* Search */}
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses"
            className="w-full rounded-lg bg-surface py-2.5 pl-9 pr-3 text-sm text-ink shadow-card outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
            No expenses found.
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((expense) => (
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
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
                  <Icon name="route" className="h-3 w-3" />
                  Trip {expense.tripId}
                </span>
                <p className="mt-1.5 text-xs font-medium text-ink-muted">
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
