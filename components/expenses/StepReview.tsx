import type { ExpenseDraft } from "@/lib/api/expenses";

const TYPE_LABELS: Record<string, string> = {
  payroll: "Payroll Addition",
  company: "Company Paid",
};

const CATEGORY_LABELS: Record<string, string> = {
  truck: "Truck Expense",
  trailer: "Trailer Expense",
  general: "General Expense",
};

type SummaryRow = { label: string; value: string };

/** A titled card of label/value rows — mirrors the form's card layout. */
function SummaryCard({
  title,
  rows,
}: {
  title: string;
  rows: SummaryRow[];
}) {
  return (
    <div className="rounded-card bg-surface p-5 shadow-card">
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-right text-sm font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Step 5 — Review & Submit. A read-only recap of everything entered,
 * grouped into cards like the form. The "Submit for Review" action lives
 * in the wizard footer.
 */
export function StepReview({ draft }: { draft: ExpenseDraft }) {
  const dash = (value: string) => (value.trim() === "" ? "—" : value);

  const expenseRows: SummaryRow[] = [
    { label: "Type", value: draft.type ? TYPE_LABELS[draft.type] : "—" },
    {
      label: "Category",
      value: draft.category ? CATEGORY_LABELS[draft.category] : "—",
    },
    {
      label: "Amount",
      value:
        draft.amount.trim() === ""
          ? "—"
          : `${draft.amount} ${draft.currency}`,
    },
    { label: "Description", value: dash(draft.description) },
    { label: "Notes", value: dash(draft.notes) },
    { label: "Truck", value: dash(draft.truckUnit) },
  ];

  const vendorRows: SummaryRow[] = [
    { label: "Vendor name", value: dash(draft.vendorName) },
    { label: "Invoice #", value: dash(draft.invoiceNo) },
    { label: "Invoice date", value: dash(draft.invoiceDate) },
    { label: "Address", value: dash(draft.vendorAddress) },
    { label: "City", value: dash(draft.vendorCity) },
    { label: "State", value: dash(draft.vendorState) },
    { label: "Country", value: draft.vendorCountry },
  ];

  const hasVendor = [
    draft.vendorName,
    draft.invoiceNo,
    draft.invoiceDate,
    draft.vendorAddress,
    draft.vendorCity,
    draft.vendorState,
  ].some((value) => value.trim() !== "");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-ink">Review &amp; Submit</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Check the details you entered before submitting for approval.
        </p>
      </div>

      <SummaryCard title="Expense" rows={expenseRows} />

      {hasVendor ? (
        <SummaryCard title="Vendor Info" rows={vendorRows} />
      ) : (
        <div className="rounded-card bg-surface p-5 shadow-card">
          <h3 className="text-base font-bold text-ink">Vendor Info</h3>
          <p className="mt-2 text-sm text-ink-muted">No vendor info added.</p>
        </div>
      )}
    </div>
  );
}
