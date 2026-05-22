/**
 * ScreenPlaceholder — a scaffold-only screen body.
 *
 * Every route currently renders one of these. Replace the body with the
 * real screen when its feature ticket is implemented (see docs/screens.md).
 */
export function ScreenPlaceholder({
  title,
  summary,
  bullets,
}: {
  title: string;
  summary: string;
  bullets: string[];
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{summary}</p>
      </div>

      <div className="rounded-card bg-surface p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Planned for this screen
        </p>
        <ul className="mt-2 space-y-1.5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-ink">
              <span className="text-brand">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-card border border-dashed border-brand/40 bg-brand-light/40 p-3 text-xs text-ink-muted">
        Scaffold screen. Implementation pending — see{" "}
        <span className="font-medium text-ink">docs/screens.md</span>.
      </p>
    </section>
  );
}
