"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { submitTripSheet } from "@/lib/api/trip-sheets";

const LABEL =
  "text-[11px] font-semibold uppercase tracking-wide text-ink-muted";

const UPLOAD_OPTIONS = [
  { icon: "file-text", label: "Scan" },
  { icon: "camera", label: "Camera" },
  { icon: "upload", label: "Gallery" },
  { icon: "file-text", label: "Files" },
];

/** Decorative preview of a driver's trip sheet — themed in brand blue. */
function TripSheetPreview() {
  return (
    <div className="rounded-card bg-surface p-4 shadow-card">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-brand">
          Driver&apos;s Trip Sheet
        </p>
        <div className="mt-3 space-y-2">
          {["Driver", "Period"].map((field) => (
            <div key={field} className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-ink">
                {field}:
              </span>
              <span className="h-px flex-1 bg-blue-300" />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1 text-[8px] font-semibold uppercase tracking-wide text-brand">
          <span>Date</span>
          <span>Load #</span>
          <span>From</span>
          <span>To</span>
          <span className="text-right">Miles</span>
        </div>
        <div className="mt-2 space-y-2">
          {[0, 1, 2].map((row) => (
            <span key={row} className="block h-px bg-blue-200" />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-brand">
        Upload your trip sheet showing loads hauled for the period
      </p>
    </div>
  );
}

/**
 * SubmitTripSheetForm — a single-screen form to submit a trip sheet.
 * Submit is enabled once a trip sheet is "attached" (capture is mocked).
 */
export function SubmitTripSheetForm() {
  const router = useRouter();
  const [uploaded, setUploaded] = useState(false);
  const [periodStart, setPeriodStart] = useState("2026-05-01");
  const [periodEnd, setPeriodEnd] = useState("2026-05-21");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await submitTripSheet({ periodStart, periodEnd, note });
    router.push("/trip-sheets");
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink">Submit Trip Sheet</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-32 pt-4">
        <TripSheetPreview />

        {/* Upload */}
        <div>
          <p className={LABEL}>Upload Trip Sheet</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {UPLOAD_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setUploaded(true)}
                className="flex flex-col items-center gap-1.5 rounded-card bg-surface p-3 shadow-card"
              >
                <Icon name={option.icon} className="h-5 w-5 text-brand" />
                <span className="text-xs font-medium text-ink">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          {uploaded && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
              <Icon name="check" className="h-4 w-4" />
              Trip sheet attached
            </p>
          )}
        </div>

        {/* Period */}
        <div>
          <p className={LABEL}>Period</p>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex-1 rounded-card bg-surface p-3 shadow-card">
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                Start
              </span>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-sm font-bold text-ink outline-none"
              />
            </label>
            <Icon
              name="chevron-right"
              className="h-4 w-4 shrink-0 text-ink-muted"
            />
            <label className="flex-1 rounded-card bg-surface p-3 shadow-card">
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                End
              </span>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-sm font-bold text-ink outline-none"
              />
            </label>
          </div>
        </div>

        {/* Note */}
        <div>
          <p className={LABEL}>Note (Optional)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add a note..."
            className="mt-2 w-full resize-none rounded-card bg-surface p-4 text-sm text-ink shadow-card outline-none placeholder:text-ink-muted/70"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 border-t border-ink/5 bg-surface/80 px-4 pt-3 pb-nav-bottom backdrop-blur-md">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!uploaded || submitting}
          className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-ink-muted"
        >
          {submitting ? "Submitting…" : "Submit Trip Sheet"}
        </button>
      </footer>
    </div>
  );
}
