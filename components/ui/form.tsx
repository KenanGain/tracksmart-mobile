"use client";

import { useId } from "react";

/**
 * Form fields shared by the bottom-sheet forms. Text/select/date/textarea
 * are uncontrolled (read via `FormData` on submit); ToggleGroup is
 * controlled by the parent.
 */

const LABEL =
  "block text-[11px] font-semibold uppercase tracking-wide text-ink-muted";
const CONTROL =
  "mt-1.5 w-full rounded-lg bg-surface-muted px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-brand/30";

type Option = { value: string; label: string };

export function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={CONTROL}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  placeholder,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  options: Option[];
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={CONTROL}
      >
        <option value="" disabled>
          {placeholder ?? "Select…"}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="date"
        defaultValue={defaultValue}
        className={CONTROL}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`${CONTROL} resize-none`}
      />
    </div>
  );
}

/** A two-or-more option toggle. Controlled by the parent. */
export function ToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div className="mt-1.5 flex gap-3">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${
                active ? "bg-brand text-white" : "bg-surface-muted text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** A labelled "upload" affordance — the picker itself is wired later. */
export function UploadField({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-1.5 w-full rounded-lg bg-surface-muted py-3 text-sm font-semibold text-brand"
      >
        + Upload Document
      </button>
    </div>
  );
}

/** The blue full-width "Submit for Review" button used by sheet forms. */
export function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white"
    >
      {label}
    </button>
  );
}
