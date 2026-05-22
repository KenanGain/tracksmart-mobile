"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AddDocumentSheet } from "@/components/compliance/AddDocumentSheet";
import type { TripStop } from "@/lib/data/trips";

/** "May 22 6:54 AM" — the moment an action was completed. */
function formatNow(): string {
  const d = new Date();
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

/** A centered modal dialog (scrim + card), width-matched to the frame. */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-shell -translate-x-1/2 items-center justify-center px-8">
      <div className="absolute inset-0 bg-ink/50" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full rounded-2xl bg-surface p-5"
      >
        {children}
      </div>
    </div>
  );
}

/** Confirm the trailer number before picking up. */
function ConfirmTrailerDialog({
  trailer,
  onProceed,
}: {
  trailer: string;
  onProceed: () => void;
}) {
  return (
    <Modal>
      <h3 className="text-center text-base font-bold text-ink">
        Confirm Trailer
      </h3>
      <div className="mt-4 rounded-xl bg-surface-muted py-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Current Trailer
        </p>
        <p className="text-2xl font-bold text-ink">{trailer || "—"}</p>
      </div>
      <p className="mt-3 text-center text-sm text-ink-muted">
        Is this the correct trailer?
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onProceed}
          className="flex-1 rounded-lg bg-danger py-2.5 text-sm font-bold text-white"
        >
          WRONG
        </button>
        <button
          type="button"
          onClick={onProceed}
          className="flex-1 rounded-lg bg-success py-2.5 text-sm font-bold text-white"
        >
          CORRECT
        </button>
      </div>
      <button
        type="button"
        onClick={onProceed}
        className="mt-3 w-full text-center text-xs font-medium text-ink-muted underline"
      >
        Skip
      </button>
    </Modal>
  );
}

/** A modal with a single value input + Cancel / Confirm. */
function ValueDialog({
  title,
  subtitle,
  placeholder,
  numeric,
  onCancel,
  onConfirm,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  numeric?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <Modal>
      <h3 className="text-center text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 text-center text-sm text-ink-muted">{subtitle}</p>
      <input
        type={numeric ? "number" : "text"}
        inputMode={numeric ? "numeric" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="mt-4 w-full rounded-lg bg-surface-muted px-3 py-3 text-center text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
      />
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg bg-surface-muted py-2.5 text-sm font-bold text-ink"
        >
          CANCEL
        </button>
        <button
          type="button"
          disabled={value.trim() === ""}
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          CONFIRM
        </button>
      </div>
    </Modal>
  );
}

/** A draw-to-sign canvas pad. */
function SignaturePad({ onChange }: { onChange: (hasInk: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const inked = useRef(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    drawing.current = true;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!inked.current) {
      inked.current = true;
      onChange(true);
    }
  };
  const end = () => {
    drawing.current = false;
  };
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    inked.current = false;
    onChange(false);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={320}
        height={150}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="w-full touch-none rounded-lg border border-ink/15 bg-surface-muted"
        style={{ height: 150 }}
      />
      <button
        type="button"
        onClick={clear}
        className="mt-1 text-xs font-semibold text-ink-muted"
      >
        Clear
      </button>
    </div>
  );
}

/** Capture the driver's e-signature. */
function SignatureDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [signed, setSigned] = useState(false);
  return (
    <Modal>
      <h3 className="text-center text-base font-bold text-ink">
        Driver Signature
      </h3>
      <p className="mt-1 text-center text-sm text-ink-muted">
        Sign in the box to confirm delivery.
      </p>
      <div className="mt-4">
        <SignaturePad onChange={setSigned} />
      </div>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg bg-surface-muted py-2.5 text-sm font-bold text-ink"
        >
          CANCEL
        </button>
        <button
          type="button"
          disabled={!signed}
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          CONFIRM
        </button>
      </div>
    </Modal>
  );
}

type DialogKind =
  | null
  | "trailer"
  | "temp"
  | "odometer"
  | "signature"
  | "document";

type HistoryEntry = { label: string; time: string };

/**
 * StopActions — the status buttons for an expanded stop.
 *  - Pick Up → Arrived / Picked Up / Departed.
 *    · Arrived  → odometer reading.
 *    · Picked Up → confirm trailer → confirm temperature → odometer.
 *  - Drop Off → Arrived / Delivered.
 *    · Arrived  → odometer reading.
 *    · Delivered → e-signature → POD document upload.
 *  - Acquire / Hook → a single Mark as Completed button.
 * Completed actions are listed under **Action History** with a time, and
 * a **Navigate** button opens directions to the stop. All mocks.
 */
export function StopActions({ stop }: { stop: TripStop }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [pending, setPending] = useState<string | null>(null);

  const isPickup = stop.kind === "pickup";
  const isDelivery = stop.kind === "drop-off";

  const isDone = (label: string) => history.some((h) => h.label === label);

  const finish = (label: string) => {
    setHistory((h) =>
      h.some((e) => e.label === label)
        ? h
        : [...h, { label, time: formatNow() }],
    );
    setDialog(null);
    setPending(null);
  };
  const cancel = () => {
    setDialog(null);
    setPending(null);
  };

  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;

  /** A status button. */
  function StatusButton({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) {
    const done = isDone(label);
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={done}
        className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-1 py-2.5 text-xs font-bold uppercase tracking-wide ${
          done ? "bg-success/10 text-success" : "bg-brand text-white"
        }`}
      >
        {done && <Icon name="check" className="h-3.5 w-3.5" />}
        {label}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status buttons */}
      <div className="flex gap-2">
        {isPickup ? (
          <>
            <StatusButton
              label="Arrived"
              onClick={() => {
                setPending("Arrived");
                setDialog("odometer");
              }}
            />
            <StatusButton
              label="Picked Up"
              onClick={() => {
                setPending("Picked Up");
                setDialog("trailer");
              }}
            />
            <StatusButton
              label="Departed"
              onClick={() => finish("Departed")}
            />
          </>
        ) : isDelivery ? (
          <>
            <StatusButton
              label="Arrived"
              onClick={() => {
                setPending("Arrived");
                setDialog("odometer");
              }}
            />
            <StatusButton
              label="Delivered"
              onClick={() => {
                setPending("Delivered");
                setDialog("signature");
              }}
            />
          </>
        ) : (
          <StatusButton
            label="Completed"
            onClick={() => finish("Completed")}
          />
        )}
      </div>

      {/* Action history */}
      {history.length > 0 && (
        <div className="rounded-lg border border-ink/10 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Action History
          </p>
          <ul className="mt-2 space-y-1.5">
            {history.map((entry) => (
              <li
                key={entry.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold text-success">
                  <Icon name="check" className="h-4 w-4" />
                  {entry.label}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {entry.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigate */}
      <a
        href={navUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-ink-muted py-3 text-sm font-bold text-white"
      >
        <Icon name="map-pin" className="h-4 w-4" />
        Navigate
      </a>

      {/* Dialog flow */}
      {dialog === "trailer" && (
        <ConfirmTrailerDialog
          trailer={stop.trailer ?? ""}
          onProceed={() => setDialog("temp")}
        />
      )}
      {dialog === "temp" && (
        <ValueDialog
          title="Confirm Temperature"
          subtitle={`Required: ${stop.temperature ?? "—"}`}
          placeholder="Enter current temp"
          onCancel={cancel}
          onConfirm={() => setDialog("odometer")}
        />
      )}
      {dialog === "odometer" && (
        <ValueDialog
          title="Odometer Reading"
          subtitle="Enter the truck odometer (km)."
          placeholder="Enter km"
          numeric
          onCancel={cancel}
          onConfirm={() => finish(pending ?? "Arrived")}
        />
      )}
      {dialog === "signature" && (
        <SignatureDialog
          onCancel={cancel}
          onConfirm={() => setDialog("document")}
        />
      )}
      <AddDocumentSheet
        open={dialog === "document"}
        onClose={cancel}
        onCapture={() => finish("Delivered")}
      />
    </div>
  );
}
