"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AddDocumentSheet } from "./AddDocumentSheet";
import type { ComplianceDocument } from "@/lib/data/compliance";

/**
 * DocumentsSection — the "Documents" block on the compliance screen:
 * an Add button (opens AddDocumentSheet) and the document list.
 */
export function DocumentsSection({
  documents,
}: {
  documents: ComplianceDocument[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Documents</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Icon name="plus" className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
          No documents
        </div>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-card bg-surface p-4 text-sm font-medium text-ink shadow-card"
            >
              {doc.name}
            </li>
          ))}
        </ul>
      )}

      <AddDocumentSheet open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
