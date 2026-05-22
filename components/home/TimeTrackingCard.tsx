"use client";

import { useEffect, useState } from "react";

/** Formats elapsed milliseconds as HH:MM:SS. */
function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    pad(Math.floor(total / 3600)),
    pad(Math.floor((total % 3600) / 60)),
    pad(total % 60),
  ].join(":");
}

/**
 * TimeTrackingCard — a compact clock in/out widget.
 *
 * Fixed height (title + status on the left, timer + switch on the right)
 * so the card never grows when toggled. State is local for now.
 */
export function TimeTrackingCard() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const clockedIn = startedAt !== null;

  // Tick the timer once a second while clocked in.
  useEffect(() => {
    if (startedAt === null) return;
    const tick = () => setElapsed(Date.now() - startedAt);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  function toggle() {
    setStartedAt(clockedIn ? null : Date.now());
    setElapsed(0);
  }

  const startedLabel =
    startedAt === null
      ? null
      : new Date(startedAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-ink">Time Tracking</h2>
          <p
            className={`mt-0.5 text-xs font-medium ${
              clockedIn ? "text-success" : "text-ink-muted"
            }`}
          >
            {clockedIn
              ? `Clocked in at ${startedLabel}`
              : "Currently Clocked Out"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {clockedIn && (
            <span className="font-mono text-sm font-bold tabular-nums text-success">
              {formatElapsed(elapsed)}
            </span>
          )}

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={clockedIn}
            aria-label="Clock in or out"
            onClick={toggle}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              clockedIn ? "bg-brand" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                clockedIn ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
