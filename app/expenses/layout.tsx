/**
 * Expenses layout — a full-screen phone-width frame with NO app shell
 * (no TopBar / BottomNav). The Submit Expense wizard renders its own
 * header and footer.
 */
export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-shell flex-col bg-surface-muted shadow-lg">
      {children}
    </div>
  );
}
