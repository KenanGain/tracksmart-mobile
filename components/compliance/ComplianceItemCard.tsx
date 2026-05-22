"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { UpdateItemSheet, type SheetFieldConfig } from "./UpdateItemSheet";

export type ItemRow = { label: string; value: string };
export type ItemStatus = { text: string; ok: boolean };

/**
 * ComplianceItemCard — one "Basic" compliance item (Driver's License,
 * Passport, Emergency Contact). The Update button opens an UpdateItemSheet
 * built from `fields`.
 */
export function ComplianceItemCard({
  title,
  rows,
  status,
  fields,
}: {
  title: string;
  rows: ItemRow[];
  status?: ItemStatus;
  fields: SheetFieldConfig[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <h3 className="text-base font-bold text-ink">{title}</h3>

      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-right text-sm font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-lg bg-surface-muted py-2.5 text-sm font-semibold text-ink"
      >
        Update
      </button>

      {status && (
        <div className="mt-3 border-t border-surface-muted pt-3">
          <p
            className={`flex items-center gap-1.5 text-sm font-medium ${
              status.ok ? "text-success" : "text-warning"
            }`}
          >
            {status.ok && <Icon name="check" className="h-4 w-4" />}
            {status.text}
          </p>
        </div>
      )}

      <UpdateItemSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        fields={fields}
      />
    </section>
  );
}
