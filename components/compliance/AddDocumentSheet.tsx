"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";

/** Large square capture option (Scan Document / Take Photo). */
function CaptureTile({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl bg-surface-muted p-5"
    >
      <Icon name={icon} className="h-8 w-8 text-ink-muted" />
      <span className="text-center text-sm font-semibold text-ink">
        {label}
      </span>
    </button>
  );
}

/** Wide list-style capture option (Upload from Files / Gallery). */
function CaptureRow({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-muted py-3 text-sm font-semibold text-ink"
    >
      <Icon name={icon} className="h-4 w-4 text-ink-muted" />
      {label}
    </button>
  );
}

/**
 * AddDocumentSheet — picks how to capture a document.
 *
 * The four capture actions are placeholders: real capture (camera,
 * scanner, file system, gallery) is a native concern, wired in the
 * Flutter app. On web they would use an `<input type="file">`.
 */
export function AddDocumentSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-lg font-bold text-ink">Add Document</h2>
        <p className="mx-auto mt-1 max-w-[16rem] text-sm text-ink-muted">
          How would you like to capture the document?
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <CaptureTile icon="file-text" label="Scan Document" onClick={onClose} />
        <CaptureTile icon="camera" label="Take Photo" onClick={onClose} />
      </div>

      <div className="mt-3 space-y-2">
        <CaptureRow icon="folder" label="Upload from Files" onClick={onClose} />
        <CaptureRow icon="image" label="Select from Gallery" onClick={onClose} />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full py-2 text-center text-sm font-medium text-ink-muted underline"
      >
        Cancel
      </button>
    </BottomSheet>
  );
}
