import type { Metadata } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "About" };

const APP_VERSION = "1.0.0 (prototype)";

const INFO_ROWS: { icon: string; label: string; value: string }[] = [
  { icon: "file-text", label: "Version", value: APP_VERSION },
  { icon: "building", label: "Provider", value: "Transplus Systems Corp." },
  { icon: "mail", label: "Support", value: "support@tracksmart.demo" },
];

const LINKS = ["Terms of Service", "Privacy Policy", "Open-source licenses"];

export default function AboutPage() {
  return (
    <section className="space-y-6">
      {/* App identity */}
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white">
          <Icon name="truck" className="h-8 w-8" />
        </span>
        <h2 className="mt-3 text-lg font-bold text-ink">{APP_NAME}</h2>
        <p className="text-sm text-ink-muted">{APP_TAGLINE}</p>
        <p className="mt-1 text-xs text-ink-muted">Version {APP_VERSION}</p>
      </div>

      {/* Description */}
      <p className="rounded-card bg-surface p-4 text-sm text-ink-muted shadow-card">
        {APP_NAME} is the mobile companion for the fleet operations platform —
        giving drivers and carriers their trips, load tenders, compliance and
        schedule in one place.
      </p>

      {/* Info rows */}
      <div className="divide-y divide-ink/5 rounded-card bg-surface shadow-card">
        {INFO_ROWS.map((row) => (
          <div key={row.label} className="flex items-center gap-3 p-4">
            <Icon name={row.icon} className="h-5 w-5 text-ink-muted" />
            <span className="flex-1 text-sm text-ink">{row.label}</span>
            <span className="text-sm font-semibold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Legal links */}
      <div className="divide-y divide-ink/5 rounded-card bg-surface shadow-card">
        {LINKS.map((link) => (
          <button
            key={link}
            type="button"
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <span className="flex-1 text-sm text-ink">{link}</span>
            <Icon name="chevron-right" className="h-4 w-4 text-ink-muted" />
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-ink-muted">
        © 2026 Transplus Systems Corp. All rights reserved.
      </p>
    </section>
  );
}
