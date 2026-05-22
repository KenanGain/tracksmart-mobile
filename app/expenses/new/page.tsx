import type { Metadata } from "next";
import { SubmitExpenseWizard } from "@/components/expenses/SubmitExpenseWizard";

export const metadata: Metadata = { title: "Submit Expense" };

export default function SubmitExpensePage() {
  return <SubmitExpenseWizard />;
}
