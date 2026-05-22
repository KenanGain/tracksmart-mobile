"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import type { TripSheetRecord } from "@/lib/data/trip-sheets";

/**
 * TripSheetStatusList — submitted trip sheets and their approval status.
 * Reached from Home → Trip Sheets → "Status".
 */
export function TripSheetStatusList({
  tripSheets,
}: {
  tripSheets: TripSheetRecord[];
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink">Trip Sheets</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {tripSheets.length === 0 ? (
          <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
            No trip sheets submitted yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {tripSheets.map((sheet) => (
              <li
                key={sheet.id}
                className="rounded-card bg-surface p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-ink">
                    {formatDate(sheet.periodStart)} –{" "}
                    {formatDate(sheet.periodEnd)}
                  </p>
                  <StatusBadge status={sheet.status} />
                </div>
                <p className="mt-1 text-xs font-medium text-ink-muted">
                  Submitted {formatDate(sheet.submittedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
