import type { ExpenseDraft } from "@/lib/api/expenses";

const LABEL =
  "block text-[11px] font-semibold uppercase tracking-wide text-ink-muted";
const INPUT =
  "w-full rounded-lg bg-surface-muted px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-brand/30";
const CARD = "space-y-4 rounded-card bg-surface p-5 shadow-card";

const DESCRIPTION_CHIPS = ["Lumper", "Hotel", "Scale Ticket", "Wash"];
const STATES = ["AB", "BC", "CA", "FL", "IL", "NY", "ON", "QC", "TX", "WA"];

/** Label + control wrapper. The <label> focuses its control on click. */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL}>
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/**
 * Step 3 — Expense Details. A controlled form, grouped into cards so it
 * matches the rest of the app.
 */
export function StepExpenseDetails({
  draft,
  update,
}: {
  draft: ExpenseDraft;
  update: (patch: Partial<ExpenseDraft>) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">Expense Details</h2>

      {/* Amount / description / notes */}
      <div className={CARD}>
        {/* Amount + currency */}
        <div>
          <span className={LABEL}>
            Amount<span className="text-danger"> *</span>
          </span>
          <div className="mt-1.5 flex gap-2">
            <input
              inputMode="decimal"
              value={draft.amount}
              onChange={(e) => update({ amount: e.target.value })}
              placeholder="0.00"
              className={`${INPUT} flex-1`}
            />
            <div className="flex shrink-0 gap-1 rounded-lg bg-surface-muted p-1">
              {(["USD", "CAD"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => update({ currency: code })}
                  className={`flex items-center rounded-md px-3 text-sm font-semibold ${
                    draft.currency === code
                      ? "bg-brand text-white"
                      : "text-ink-muted"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description + quick chips */}
        <div>
          <span className={LABEL}>
            Description<span className="text-danger"> *</span>
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {DESCRIPTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => update({ description: chip })}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  draft.description === chip
                    ? "bg-brand text-white"
                    : "bg-surface-muted text-ink"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <input
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief description of expense"
            className={`${INPUT} mt-2`}
          />
        </div>

        {/* Notes */}
        <Field label="Your Notes">
          <textarea
            rows={3}
            value={draft.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Additional notes or explanation"
            className={`${INPUT} resize-none`}
          />
        </Field>
      </div>

      {/* Vendor info */}
      <div className={CARD}>
        <h3 className="text-base font-bold text-ink">Vendor Info (Optional)</h3>

        <Field label="Vendor Name">
          <input
            value={draft.vendorName}
            onChange={(e) => update({ vendorName: e.target.value })}
            placeholder="Store or vendor name"
            className={INPUT}
          />
        </Field>

        <Field label="Invoice/Receipt #">
          <input
            value={draft.invoiceNo}
            onChange={(e) => update({ invoiceNo: e.target.value })}
            placeholder="INV-12345"
            className={INPUT}
          />
        </Field>

        <Field label="Invoice Date">
          <input
            type="date"
            value={draft.invoiceDate}
            onChange={(e) => update({ invoiceDate: e.target.value })}
            className={INPUT}
          />
        </Field>

        <Field label="Vendor Address">
          <input
            value={draft.vendorAddress}
            onChange={(e) => update({ vendorAddress: e.target.value })}
            placeholder="Street address"
            className={INPUT}
          />
        </Field>

        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="City">
              <input
                value={draft.vendorCity}
                onChange={(e) => update({ vendorCity: e.target.value })}
                placeholder="City"
                className={INPUT}
              />
            </Field>
          </div>
          <div className="flex-1">
            <Field label="State">
              <select
                value={draft.vendorState}
                onChange={(e) => update({ vendorState: e.target.value })}
                className={INPUT}
              >
                <option value="">Select</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div>
          <span className={LABEL}>Country</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-surface-muted p-1">
            {(["USA", "Canada", "Mexico"] as const).map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => update({ vendorCountry: country })}
                className={`rounded-md py-2 text-sm font-semibold ${
                  draft.vendorCountry === country
                    ? "bg-brand text-white"
                    : "text-ink-muted"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
