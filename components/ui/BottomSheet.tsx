"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * BottomSheet — a modal sheet that slides up from the bottom.
 *
 * It is `fixed` but width-constrained to `max-w-shell` and centred, so on
 * desktop it stays aligned with the phone frame; on a real phone it fills
 * the screen.
 *
 * Pass `title` to get a header bar (title + close button). Omit it to
 * render a bare panel — the children then provide their own header.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 w-full max-w-shell -translate-x-1/2">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col rounded-t-2xl bg-surface"
      >
        {title !== undefined && (
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 pb-8 pt-4">{children}</div>
      </div>
    </div>
  );
}
