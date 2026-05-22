import { Icon } from "@/components/ui/Icon";

/**
 * LinkCard — a titled card with a chevron and a one-line summary
 * (e.g. Payroll, Schedule). The chevron marks a future detail screen.
 */
export function LinkCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <Icon name="chevron-right" className="h-5 w-5 text-ink-muted" />
      </div>
      <p className="mt-3 text-center text-sm text-ink-muted">{summary}</p>
    </section>
  );
}
