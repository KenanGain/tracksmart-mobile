import type { Metadata } from "next";
import { getExpenses } from "@/lib/api/expenses";
import { ExpenseStatusList } from "@/components/expenses/ExpenseStatusList";

export const metadata: Metadata = { title: "Expense Status" };

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return <ExpenseStatusList expenses={expenses} />;
}
