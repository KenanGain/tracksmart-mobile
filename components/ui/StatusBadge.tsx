/** Review status shared by expenses, trip sheets, etc. */
export type ReviewStatus = "pending" | "approved" | "rejected";

const STYLES: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-danger/10 text-danger" },
};

/** A small coloured pill showing an approval status. */
export function StatusBadge({ status }: { status: ReviewStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
}
