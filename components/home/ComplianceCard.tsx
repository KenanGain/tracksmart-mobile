import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import type { ComplianceSummary } from "@/lib/api/compliance";

/** A small labelled value used inside the compliance card. */
function Field({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

/**
 * ComplianceCard — Home-screen summary of the user's compliance.
 * The whole card links to the full /compliance screen.
 */
export function ComplianceCard({ summary }: { summary: ComplianceSummary }) {
  const expiry = summary.expiryDate
    ? formatDate(summary.expiryDate).toUpperCase()
    : "N/A";

  return (
    <Link
      href="/compliance"
      className="block rounded-card bg-surface p-5 shadow-card"
    >
      {/* Header — chevron signals the card opens the full screen. */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">My Compliance</h2>
        <Icon name="chevron-right" className="h-5 w-5 text-ink-muted" />
      </div>

      {/* Body: avatar + fields */}
      <div className="mt-4 flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
          <span className="text-xl font-bold text-ink-muted">
            {summary.initials}
          </span>
        </div>

        <div className="flex-1 space-y-2.5">
          <Field label="Name" value={summary.holderName.toUpperCase()} />
          <div className="flex items-start justify-between gap-3">
            <Field label="License No" value={summary.licenseNo} />
            <Field
              label="Items"
              value={String(summary.itemCount)}
              align="right"
            />
          </div>
          <Field label="Expiry" value={expiry} />
        </div>
      </div>

      {/* Footer: overall document status */}
      <div className="mt-4 border-t border-surface-muted pt-3">
        {summary.allValid ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            <Icon name="check" className="h-4 w-4" />
            All documents valid
          </p>
        ) : (
          <p className="text-sm font-medium text-warning">
            Some documents need attention
          </p>
        )}
      </div>
    </Link>
  );
}
