"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  EMPTY_EXPENSE_DRAFT,
  submitExpense,
  type ExpenseDraft,
} from "@/lib/api/expenses";
import { StepExpenseType } from "./StepExpenseType";
import { StepAddReceipt } from "./StepAddReceipt";
import { StepExpenseDetails } from "./StepExpenseDetails";
import { StepExpenseCategory } from "./StepExpenseCategory";
import { StepReview } from "./StepReview";

const TOTAL_STEPS = 5;

/**
 * SubmitExpenseWizard — the 5-step "Submit Expense" flow. Both expense
 * types (Payroll Addition / Company Paid) run through the same steps:
 *   1 Type · 2 Receipt · 3 Details · 4 Category · 5 Review.
 *
 * Header (back + step counter), a scrollable step body and a translucent
 * floating footer (same treatment as the bottom nav).
 */
export function SubmitExpenseWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ExpenseDraft>(EMPTY_EXPENSE_DRAFT);
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<ExpenseDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  function back() {
    if (step === 1) {
      // Return to wherever the form was opened from (Home or a trip).
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  }

  function goNext() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    await submitExpense(draft);
    router.push("/home");
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={back}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-ink">
          Submit Expense
        </h1>
        <span className="w-9 shrink-0 text-right text-sm font-medium text-ink-muted">
          {step}/{TOTAL_STEPS}
        </span>
      </header>

      {/* Step body — extra bottom padding clears the floating footer */}
      <div
        className={`min-h-0 flex-1 overflow-y-auto px-4 pt-4 ${
          step > 1 ? "pb-32" : "pb-4"
        }`}
      >
        {step === 1 && (
          <StepExpenseType
            onSelect={(type) => {
              update({ type });
              goNext();
            }}
          />
        )}
        {step === 2 && <StepAddReceipt onContinue={goNext} />}
        {step === 3 && <StepExpenseDetails draft={draft} update={update} />}
        {step === 4 && <StepExpenseCategory draft={draft} update={update} />}
        {step === 5 && <StepReview draft={draft} />}
      </div>

      {/* Footer — translucent floating bar, same treatment as the nav.
          Step 1 has none (the type cards advance directly). */}
      {step > 1 && (
        <footer className="absolute inset-x-0 bottom-0 border-t border-ink/5 bg-surface/80 px-4 pt-3 pb-nav-bottom backdrop-blur-md">
          {step === 2 && (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white"
            >
              Skip
            </button>
          )}
          {(step === 3 || step === 4) && (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white"
            >
              Continue
            </button>
          )}
          {step === 5 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
