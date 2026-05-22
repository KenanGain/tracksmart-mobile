"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { submitWorkOrder, type WorkOrderOptions } from "@/lib/api/maintenance";
import type { AssetType, WorkOrderPriority } from "@/lib/data/maintenance";

const LABEL = "mb-1.5 block text-[13px] font-semibold text-ink";
const INPUT =
  "w-full rounded-lg border border-ink/10 bg-surface px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/20";

const PRIORITIES: WorkOrderPriority[] = ["Low", "Medium", "High", "Critical"];

/** A segmented row of options — the selected one is filled brand. */
function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 rounded-lg px-1 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-brand text-white"
                : "border border-ink/10 bg-surface text-ink"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** A labelled native select with a placeholder option. */
function Select({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT} ${value === "" ? "text-ink-muted" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-ink">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * RequestWorkOrderForm — the "Request Work Order" / maintenance-request
 * form. Opened from the Home Maintenance card and from a trip's "Report
 * an Issue". Submit is a mock (it just returns to the previous screen).
 */
export function RequestWorkOrderForm({
  options,
}: {
  options: WorkOrderOptions;
}) {
  const router = useRouter();
  const [asset, setAsset] = useState<AssetType>("Truck");
  const [priority, setPriority] = useState<WorkOrderPriority>("Medium");
  const [category, setCategory] = useState("");
  const [workOrderCategory, setWorkOrderCategory] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [odometer, setOdometer] = useState("");
  const [photos, setPhotos] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await submitWorkOrder({
      asset,
      priority,
      category,
      workOrderCategory,
      reason,
      description,
      notes,
      odometer,
    });
    router.back();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink">Request Work Order</h1>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-8 pt-4">
        {/* Asset */}
        <div>
          <p className={LABEL}>Asset</p>
          <Segmented
            options={["Truck", "Trailer"] as AssetType[]}
            value={asset}
            onChange={setAsset}
          />
          <span className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
            {options.assetNumbers[asset]}
          </span>
        </div>

        {/* Priority */}
        <div>
          <p className={LABEL}>Priority</p>
          <Segmented
            options={PRIORITIES}
            value={priority}
            onChange={setPriority}
          />
        </div>

        <Select
          label="Category"
          value={category}
          placeholder="Select category"
          options={options.categories}
          onChange={setCategory}
        />
        <Select
          label="Work Order Category"
          value={workOrderCategory}
          placeholder="Select work order category"
          options={options.workOrderCategories}
          onChange={setWorkOrderCategory}
        />
        <Select
          label="Reason (optional)"
          value={reason}
          placeholder="Select reason"
          options={options.reasons}
          onChange={setReason}
        />

        {/* Description */}
        <div>
          <label className={LABEL}>
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What's going on with the vehicle?"
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Notes */}
        <div>
          <label className={LABEL}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any additional context"
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Odometer */}
        <div>
          <label className={LABEL}>Odometer (optional)</label>
          <input
            type="text"
            inputMode="numeric"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            placeholder="e.g. 412503"
            className={INPUT}
          />
        </div>

        {/* Photos */}
        <div>
          <p className={LABEL}>Photos (optional)</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: photos }).map((_, i) => (
              <span
                key={i}
                className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface text-ink-muted ring-1 ring-ink/10"
              >
                <Icon name="image" className="h-6 w-6" />
              </span>
            ))}
            <button
              type="button"
              onClick={() => setPhotos((n) => n + 1)}
              aria-label="Add photo"
              className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-ink/20 text-ink-muted"
            >
              <Icon name="plus" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={description.trim() === "" || submitting}
          className="w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-ink-muted"
        >
          {submitting ? "Submitting…" : "Submit Request"}
        </button>
      </div>
    </div>
  );
}
