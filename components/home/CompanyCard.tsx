import type { Company } from "@/lib/data/company";

/**
 * CompanyCard — the carrier / business the signed-in user belongs to.
 *
 * The monogram tile is a placeholder for the real logo asset; swap it for
 * a `next/image` logo when one is available.
 */
export function CompanyCard({ company }: { company: Company }) {
  return (
    <section className="rounded-card bg-surface p-5 text-center shadow-card">
      <h2 className="text-base font-bold text-ink">{company.name}</h2>
      <div className="mt-3 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-light">
          <span className="text-xl font-extrabold tracking-tight text-brand">
            {company.monogram}
          </span>
        </div>
      </div>
    </section>
  );
}
