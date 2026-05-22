import { Icon } from "@/components/ui/Icon";

/** One receipt-capture option row. */
function CaptureRow({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-card bg-surface p-4 text-left shadow-card"
    >
      <Icon name={icon} className="h-5 w-5 shrink-0 text-ink" />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">{title}</span>
        <span className="block text-xs text-ink-muted">{subtitle}</span>
      </span>
    </button>
  );
}

/**
 * Step 2 — Add Receipt.
 *
 * The capture options are placeholders — real capture (scanner, camera,
 * gallery, files) is native and wired in the Flutter app. Tapping any of
 * them, or "Skip" in the footer, advances to step 3.
 */
export function StepAddReceipt({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Add Receipt</h2>

      {/* AI hint banner */}
      <div className="mt-4 rounded-card border border-brand/30 bg-brand-light/60 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
            AI
          </span>
          <p className="text-sm font-bold text-brand">
            Smart Receipt Scanning
          </p>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Add your receipt pages, then tap &quot;Scan Now&quot; to auto-fill
          expense details.
        </p>
      </div>

      {/* Capture options */}
      <div className="mt-4 space-y-2">
        <CaptureRow
          icon="file-text"
          title="Scan Document"
          subtitle="Multi-page scanner"
          onClick={onContinue}
        />
        <CaptureRow
          icon="camera"
          title="Take Photo"
          subtitle="Capture with camera"
          onClick={onContinue}
        />
        <CaptureRow
          icon="upload"
          title="Pick from Gallery"
          subtitle="Select multiple photos"
          onClick={onContinue}
        />
        <CaptureRow
          icon="upload"
          title="Upload Files"
          subtitle="Images or PDF documents"
          onClick={onContinue}
        />
      </div>
    </div>
  );
}
