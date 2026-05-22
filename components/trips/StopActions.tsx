"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { BottomSheet } from "@/components/ui/BottomSheet";
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

/** Confirm the trailer number — a bottom sheet. */
function ConfirmTrailerDialog({
  trailer,
  onClose,
  onProceed,
}: {
  trailer: string;
  onClose: () => void;
  onProceed: () => void;
}) {
  return (
    <BottomSheet open onClose={onClose} title="Confirm Trailer">
      <div className="rounded-xl bg-surface-muted py-4 text-center">
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
          className="flex-1 rounded-lg bg-danger py-3 text-sm font-bold text-white"
        >
          Wrong
        </button>
        <button
          type="button"
          onClick={onProceed}
          className="flex-1 rounded-lg bg-success py-3 text-sm font-bold text-white"
        >
          Correct
        </button>
      </div>
      <button
        type="button"
        onClick={onProceed}
        className="mt-3 w-full text-center text-xs font-medium text-ink-muted underline"
      >
        Skip
      </button>
    </BottomSheet>
  );
}

/** A bottom sheet with a single value input + Confirm. */
function ValueDialog({
  title,
  subtitle,
  placeholder,
  numeric,
  onClose,
  onConfirm,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  numeric?: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <BottomSheet open onClose={onClose} title={title}>
      <p className="-mt-1 text-sm text-ink-muted">{subtitle}</p>
      <input
        type={numeric ? "number" : "text"}
        inputMode={numeric ? "numeric" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-lg bg-surface-muted px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
      />
      <button
        type="button"
        disabled={value.trim() === ""}
        onClick={() => onConfirm(value.trim())}
        className="mt-4 w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        Confirm
      </button>
    </BottomSheet>
  );
}

/**
 * A draw-to-sign canvas pad. The clear action is exposed through
 * `clearRef` so the dialog can render Clear as a proper button.
 */
function SignaturePad({
  onChange,
  clearRef,
}: {
  onChange: (hasInk: boolean) => void;
  clearRef: React.MutableRefObject<(() => void) | null>;
}) {
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

  clearRef.current = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    inked.current = false;
    onChange(false);
  };

  return (
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
  );
}

/** Capture the receiver's e-signature — a bottom sheet. Skippable. */
function SignatureDialog({
  onClose,
  onConfirm,
  onSkip,
}: {
  onClose: () => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const [signed, setSigned] = useState(false);
  const clearRef = useRef<(() => void) | null>(null);
  return (
    <BottomSheet open onClose={onClose} title="Receiver Signature">
      <p className="-mt-1 text-sm text-ink-muted">
        The receiver signs below to confirm delivery.
      </p>
      <div className="mt-3">
        <SignaturePad onChange={setSigned} clearRef={clearRef} />
      </div>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => clearRef.current?.()}
          className="flex-1 rounded-lg border border-ink/15 bg-surface py-3 text-sm font-semibold text-ink"
        >
          Clear
        </button>
        <button
          type="button"
          disabled={!signed}
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="mt-2 w-full py-2 text-center text-sm font-medium text-ink-muted underline"
      >
        Skip signature
      </button>
    </BottomSheet>
  );
}

type DialogKind =
  | null
  | "trailer"
  | "temp"
  | "odometer"
  | "signature"
  | "document";

type HistoryEntry = { label: string; time: string; detail?: string };

/**
 * StopActions — the status buttons for an expanded stop.
 *  - Pick Up → Arrived / Picked Up / Departed.
 *    · Arrived  → odometer reading (the value is kept in the history).
 *    · Picked Up → confirm trailer → confirm temperature → document
 *      upload (the document can be skipped).
 *    · Departed → completes directly.
 *  - Drop Off → Arrived / Delivered.
 *    · Arrived  → odometer reading (kept).
 *    · Delivered → receiver e-signature → POD document upload (skippable).
 *  - Acquire → Mark as Completed → odometer reading.
 *  - Hook → Mark as Completed → confirm trailer.
 * Dialogs are bottom sheets. Completed actions are listed under **Action
 * History** with a time; **Navigate** (Pick Up / Drop Off only) opens
 * directions. All mocks.
 */
export function StopActions({ stop }: { stop: TripStop }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [pending, setPending] = useState<string | null>(null);

  const isPickup = stop.kind === "pickup";
  const isDelivery = stop.kind === "drop-off";

  const isDone = (label: string) => history.some((h) => h.label === label);

  const finish = (label: string, detail?: string) => {
    setHistory((h) =>
      h.some((e) => e.label === label)
        ? h
        : [...h, { label, time: formatNow(), detail }],
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
          // Acquire → odometer · Hook → confirm trailer
          <StatusButton
            label="Completed"
            onClick={() => {
              setPending("Completed");
              setDialog(stop.kind === "acquire" ? "odometer" : "trailer");
            }}
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
                  {entry.detail && (
                    <span className="font-normal text-ink-muted">
                      · {entry.detail}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink">
                  {entry.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigate — only for Pick Up / Drop Off stops */}
      {(isPickup || isDelivery) && (
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-ink-muted py-3 text-sm font-bold text-white"
        >
          <Icon name="map-pin" className="h-4 w-4" />
          Navigate
        </a>
      )}

      {/* Dialog flow — bottom sheets */}
      {dialog === "trailer" && (
        <ConfirmTrailerDialog
          trailer={stop.trailer ?? ""}
          onClose={cancel}
          onProceed={() => {
            if (pending === "Picked Up") setDialog("temp");
            else finish(pending ?? "Completed");
          }}
        />
      )}
      {dialog === "temp" && (
        <ValueDialog
          title="Confirm Temperature"
          subtitle={`Required: ${stop.temperature ?? "—"}`}
          placeholder="Enter current temp"
          onClose={cancel}
          onConfirm={() => setDialog("document")}
        />
      )}
      {dialog === "odometer" && (
        <ValueDialog
          title="Odometer Reading"
          subtitle="Enter the truck odometer (km)."
          placeholder="Enter km"
          numeric
          onClose={cancel}
          onConfirm={(km) => finish(pending ?? "Arrived", `${km} km`)}
        />
      )}
      {dialog === "signature" && (
        <SignatureDialog
          onClose={cancel}
          onConfirm={() => setDialog("document")}
          onSkip={() => setDialog("document")}
        />
      )}
      <AddDocumentSheet
        open={dialog === "document"}
        onClose={cancel}
        onCapture={() => finish(pending ?? "Picked Up")}
        onSkip={() => finish(pending ?? "Picked Up")}
      />
    </div>
  );
}
