import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export type CardAction = {
  icon: string;
  label: string;
  /** When set, the action navigates here; otherwise it's a placeholder. */
  href?: string;
};

/** A primary (blue) or secondary (outlined) action — link or placeholder. */
function ActionButton({
  action,
  variant,
}: {
  action: CardAction;
  variant: "primary" | "secondary";
}) {
  const className =
    "flex items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-semibold " +
    (variant === "primary"
      ? "bg-brand text-white"
      : "border border-slate-200 bg-surface text-ink");
  const iconClass =
    variant === "primary" ? "h-4 w-4" : "h-4 w-4 text-ink-muted";

  const content = (
    <>
      <Icon name={action.icon} className={iconClass} />
      {action.label}
    </>
  );

  return action.href ? (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

/**
 * ActionCard — a titled card with two actions: a primary (blue) button
 * and a secondary (outlined) button. Used for Expenses, Maintenance
 * Requests and Trip Sheets. Actions without an `href` are placeholders.
 */
export function ActionCard({
  title,
  actions,
}: {
  title: string;
  actions: [CardAction, CardAction];
}) {
  const [primary, secondary] = actions;

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <h2 className="text-base font-bold text-ink">{title}</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <ActionButton action={primary} variant="primary" />
        <ActionButton action={secondary} variant="secondary" />
      </div>
    </section>
  );
}
