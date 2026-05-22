"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AddDocumentSheet } from "@/components/compliance/AddDocumentSheet";
import type { TripStop, TripStopKind } from "@/lib/data/trips";

const KIND: Record<TripStopKind, { label: string; icon: string }> = {
  acquire: { label: "Acquire", icon: "truck" },
  hook: { label: "Hook", icon: "truck" },
  docking: { label: "Docking", icon: "building" },
  loading: { label: "Loading", icon: "package" },
  unloading: { label: "Unloading", icon: "package" },
  pickup: { label: "Pick Up", icon: "package" },
  deliver: { label: "Deliver", icon: "building" },
  "drop-off": { label: "Drop Off", icon: "building" },
  "check-call": { label: "Check Call", icon: "phone" },
};

/** Kinds that pick up freight — used for the reference-number label. */
const PICKUP_KINDS: TripStopKind[] = ["acquire", "hook", "pickup", "loading"];
/**
 * Freight-handling stops — Pick Up, Deliver and Drop Off. At these the
 * driver records an odometer reading and uploads a document.
 */
const FREIGHT_KINDS: TripStopKind[] = ["pickup", "deliver", "drop-off"];

/** A labelled detail row inside the expanded stop. */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-ink">{label}</p>
        <p className="text-sm text-ink-muted">{value}</p>
      </div>
    </div>
  );
}

/** OdometerCard — records the truck odometer at a freight stop (mock). */
function OdometerCard() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <div className="rounded-card bg-surface p-4 shadow-card">
      <p className="flex items-center gap-2 text-sm font-bold text-ink">
        <Icon name="truck" className="h-4 w-4 text-brand" />
        Odometer Reading
      </p>
      {saved ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-success">
          <Icon name="check" className="h-4 w-4" />
          {saved} km recorded
        </p>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter km"
            className="min-w-0 flex-1 rounded-lg bg-surface-muted px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="button"
            disabled={value.trim() === ""}
            onClick={() => setSaved(value.trim())}
            className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * StopActions — the actions for an expanded stop.
 *  - Pick Up, Deliver & Drop Off stops get an **Odometer Reading** and an
 *    **Upload Document** action.
 *  - Every stop gets a single **Mark as Completed** button.
 * All actions are mocks (a real build messages dispatch / stores files).
 */
function StopActions({
  kind,
  completed,
}: {
  kind: TripStopKind;
  completed: boolean;
}) {
  const isFreight = FREIGHT_KINDS.includes(kind);
  const [docOpen, setDocOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [done, setDone] = useState(completed);

  return (
    <div className="space-y-2">
      {isFreight && <OdometerCard />}

      {isFreight && (
        <div className="rounded-card bg-surface p-4 shadow-card">
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <Icon name="upload" className="h-4 w-4 text-brand" />
            Upload Document
          </p>
          <button
            type="button"
            onClick={() => setDocOpen(true)}
            className="mt-3 flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-brand/40 bg-brand-light/40 py-6 text-brand"
          >
            <Icon name={uploaded ? "check" : "camera"} className="h-6 w-6" />
            <span className="text-sm font-semibold">
              {uploaded ? "Document uploaded" : "Upload Document"}
            </span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setDone(true)}
        disabled={done}
        className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-semibold ${
          done ? "bg-success/10 text-success" : "bg-brand text-white"
        }`}
      >
        {done && <Icon name="check" className="h-4 w-4" />}
        {done ? "Completed" : "Mark as Completed"}
      </button>

      <AddDocumentSheet
        open={docOpen}
        onClose={() => setDocOpen(false)}
        onCapture={() => setUploaded(true)}
      />
    </div>
  );
}

/**
 * TripStopRow — one stop in the trip timeline. Three visual states:
 * completed (green), the next pending stop (highlighted brand) and
 * upcoming stops (muted). Tapping expands the full stop detail.
 */
export function TripStopRow({
  stop,
  index,
  isLast,
  isNext,
}: {
  stop: TripStop;
  /** 1-based stop number, shown on the rail and matching the map pin. */
  index: number;
  isLast: boolean;
  /** True for the first not-yet-completed stop. */
  isNext: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const kind = KIND[stop.kind];
  const refLabel = PICKUP_KINDS.includes(stop.kind)
    ? "Pick Up Number"
    : "Drop Off Number";

  const state = stop.completed ? "done" : isNext ? "next" : "upcoming";

  // Per-state styling.
  const card =
    state === "done"
      ? "bg-surface border border-ink/5"
      : state === "next"
        ? "bg-brand-light ring-2 ring-brand"
        : "bg-surface-muted";
  const chip =
    state === "done"
      ? "bg-success/10 text-success"
      : state === "next"
        ? "bg-brand text-white"
        : "bg-surface text-ink-muted";

  return (
    <li className="flex gap-3">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            state === "done"
              ? "bg-success text-white"
              : state === "next"
                ? "border-2 border-brand bg-surface text-brand"
                : "border-2 border-backdrop bg-surface text-ink-muted"
          }`}
        >
          {state === "done" ? (
            <Icon name="check" className="h-4 w-4" />
          ) : (
            index
          )}
        </span>
        {!isLast && (
          <span
            className={`my-1 w-0.5 flex-1 rounded-full ${
              stop.completed ? "bg-success" : "bg-backdrop"
            }`}
          />
        )}
      </div>

      {/* Stop card + detail */}
      <div className="min-w-0 flex-1 space-y-2 pb-4">
        <div className={`overflow-hidden rounded-card ${card}`}>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex w-full items-center gap-3 px-3 py-3 text-left"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chip}`}
            >
              <Icon name={kind.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-ink">
                {kind.label}
              </span>
              <span className="block truncate text-sm text-ink">
                {stop.name}
              </span>
              <span className="block truncate text-xs text-ink-muted">
                {stop.location} · {stop.appointment}
              </span>
            </span>
            {state !== "upcoming" && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  state === "done"
                    ? "bg-success/10 text-success"
                    : "bg-brand text-white"
                }`}
              >
                {state === "done" ? "Done" : "Next"}
              </span>
            )}
            <Icon
              name={expanded ? "chevron-up" : "chevron-right"}
              className="h-4 w-4 shrink-0 text-ink-muted"
            />
          </button>

          {expanded && (
            <div className="space-y-3 border-t border-ink/10 px-3 py-3">
              {/* Equipment */}
              {(stop.powerUnit || stop.trailer) && (
                <div className="flex gap-2">
                  {stop.powerUnit && (
                    <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-muted py-2 text-xs font-semibold text-ink">
                      <Icon name="truck" className="h-4 w-4 text-brand" />
                      Unit {stop.powerUnit}
                    </span>
                  )}
                  {stop.trailer && (
                    <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-muted py-2 text-xs font-semibold text-ink">
                      <Icon name="package" className="h-4 w-4 text-brand" />
                      Trailer {stop.trailer}
                    </span>
                  )}
                </div>
              )}

              <DetailRow icon="map-pin" label="Address" value={stop.address} />
              <DetailRow
                icon="calendar"
                label="Appointment"
                value={stop.appointment}
              />
              {stop.pickupNumber && (
                <DetailRow
                  icon="file-text"
                  label={refLabel}
                  value={stop.pickupNumber}
                />
              )}
              {stop.temperature && (
                <DetailRow
                  icon="thermometer"
                  label="Temperature"
                  value={stop.temperature}
                />
              )}
              {stop.phone && (
                <DetailRow icon="phone" label="Phone" value={stop.phone} />
              )}
              <DetailRow icon="mail" label="Email address" value={stop.email} />
              <DetailRow
                icon="compass"
                label="Directions"
                value={stop.directions}
              />

              {stop.note && (
                <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-warning">
                    <Icon name="info" className="h-3.5 w-3.5" />
                    Note
                  </p>
                  <p className="mt-1 text-sm text-ink">{stop.note}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {expanded && (
          <StopActions kind={stop.kind} completed={stop.completed} />
        )}
      </div>
    </li>
  );
}
