"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AddCertificationSheet } from "./AddCertificationSheet";
import type { Certification } from "@/lib/data/compliance";

/**
 * CertificationsSection — the "Certifications" block on the compliance
 * screen: an Add button (opens AddCertificationSheet) and the list.
 */
export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Certifications</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Icon name="plus" className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
          No certifications
        </div>
      ) : (
        <ul className="space-y-2">
          {certifications.map((cert) => (
            <li
              key={cert.id}
              className="rounded-card bg-surface p-4 shadow-card"
            >
              <p className="text-sm font-semibold text-ink">{cert.name}</p>
              <p className="text-xs font-medium text-ink-muted">
                {cert.result === "pass" ? "Pass" : "Fail"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <AddCertificationSheet open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
