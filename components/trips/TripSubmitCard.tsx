"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";

/** Capture options for documents & photos. */
const CAPTURE = [
  { icon: "file-text", label: "Scan Document" },
  { icon: "camera", label: "Take Photo" },
  { icon: "folder", label: "Upload File" },
  { icon: "image", label: "From Gallery" },
];

/**
 * TripSubmitCard — the trip-level "Submit" card on the trip detail
 * screen. Opens a sheet to submit documents, notes and photos. The
 * capture actions and submit are mocks (a real build stores them).
 */
export function TripSubmitCard() {
  const [open, setOpen] = useState(false);
  const [attached, setAttached] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setAttached(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-card bg-surface p-4 text-left shadow-card"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
          <Icon name="upload" className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink">Submit</span>
          <span className="block text-xs text-ink-muted">
            Submit documents, notes &amp; photos
          </span>
        </span>
        <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-ink-muted" />
      </button>

      <BottomSheet open={open} onClose={close} title="Submit">
        {submitted ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <Icon name="check" className="h-7 w-7" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">
              Submitted for review
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Notes */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Notes
              </p>
              <textarea
                rows={3}
                placeholder="Add a note for dispatch…"
                className="mt-1.5 w-full resize-none rounded-lg bg-surface-muted px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-brand/30"
              />
            </div>

            {/* Documents & photos */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Documents &amp; Photos
              </p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {CAPTURE.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setAttached((n) => n + 1)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-surface-muted py-3 text-sm font-semibold text-ink"
                  >
                    <Icon
                      name={option.icon}
                      className="h-4 w-4 text-ink-muted"
                    />
                    {option.label}
                  </button>
                ))}
              </div>
              {attached > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Icon name="check" className="h-4 w-4" />
                  {attached} {attached === 1 ? "item" : "items"} attached
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white"
            >
              Submit
            </button>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
