"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { TripStop, TripStopKind } from "@/lib/data/trips";

const KIND: Record<TripStopKind, { label: string; icon: string }> = {
  acquire: { label: "Acquire", icon: "truck" },
  hook: { label: "Hook", icon: "truck" },
  pickup: { label: "Pickup", icon: "package" },
  deliver: { label: "Deliver", icon: "building" },
  "check-call": { label: "Check Call", icon: "phone" },
};

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

/**
 * ArrivalCard — "I'm here" announces arrival, "Complete Event" announces
 * completion. Both are mocks (a real build messages dispatch).
 */
function ArrivalCard() {
  const [arrived, setArrived] = useState(false);
  const [completed, setCompleted] = useState(false);
  return (
    <div className="rounded-card bg-brand p-4 text-white">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon name="bell" className="h-4 w-4" />
        Arrival
      </p>
      <button
        type="button"
        onClick={() => setArrived(true)}
        disabled={arrived}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/60 py-2.5 text-sm font-semibold disabled:opacity-70"
      >
        {arrived && <Icon name="check" className="h-4 w-4" />}
        {arrived ? "Arrival sent" : "I'm here"}
      </button>
      <div className="my-3 h-px bg-white/20" />
      <button
        type="button"
        onClick={() => setCompleted(true)}
        disabled={completed}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/60 py-2.5 text-sm font-semibold disabled:opacity-70"
      >
        {completed && <Icon name="check" className="h-4 w-4" />}
        {completed ? "Event completed" : "Complete Event"}
      </button>
    </div>
  );
}

/** PodCard — proof-of-delivery photo upload (mock). */
function PodCard() {
  const [photo, setPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="rounded-card bg-brand p-4 text-white">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon name="image" className="h-4 w-4" />
        POD Document
      </p>
      <button
        type="button"
        onClick={() => setPhoto(true)}
        className="mt-3 flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-white/60 py-6"
      >
        <Icon name="camera" className="h-6 w-6" />
        <span className="text-sm font-semibold">
          {photo ? "Photo added" : "Take a photo"}
        </span>
      </button>
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        disabled={!photo || submitted}
        className="mt-3 w-full rounded-lg border border-white/60 py-2.5 text-sm font-semibold disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit"}
      </button>
    </div>
  );
}

/**
 * TripStopRow — one stop in the trip timeline. Three visual states:
 * completed (green), the next pending stop (highlighted brand) and
 * upcoming stops (muted). Tapping expands the stop detail.
 */
export function TripStopRow({
  stop,
  isLast,
  isNext,
}: {
  stop: TripStop;
  isLast: boolean;
  /** True for the first not-yet-completed stop. */
  isNext: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const kind = KIND[stop.kind];
  const highlight = stop.powerUnit
    ? { label: "Power Unit", value: stop.powerUnit }
    : stop.probill
      ? { label: "Probill", value: stop.probill }
      : null;

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
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            state === "done"
              ? "bg-success text-white"
              : state === "next"
                ? "border-2 border-brand bg-surface"
                : "border-2 border-backdrop bg-surface"
          }`}
        >
          {state === "done" ? (
            <Icon name="check" className="h-4 w-4" />
          ) : state === "next" ? (
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          ) : null}
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
              <span className="block truncate text-sm font-bold text-ink">
                {kind.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Icon name="map-pin" className="h-3 w-3 shrink-0" />
                <span className="truncate">{stop.location}</span>
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
              {highlight && (
                <div className="rounded-lg bg-surface-muted py-3 text-center">
                  <p className="text-xs font-medium text-ink-muted">
                    {highlight.label}
                  </p>
                  <p className="text-base font-bold text-ink">
                    {highlight.value}
                  </p>
                </div>
              )}
              <DetailRow icon="map-pin" label="Address" value={stop.address} />
              <DetailRow icon="mail" label="Email address" value={stop.email} />
              <DetailRow
                icon="compass"
                label="Directions"
                value={stop.directions}
              />
            </div>
          )}
        </div>

        {expanded && (
          <>
            <ArrivalCard />
            <PodCard />
          </>
        )}
      </div>
    </li>
  );
}
