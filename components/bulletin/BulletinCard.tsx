"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import type { LoadTender } from "@/lib/data/bulletin";

type TenderStatus = "pending" | "accepted" | "declined";

/**
 * BulletinCard — a single Load Tender.
 *
 * Pending → shows Accept / Decline. Once actioned the card collapses to a
 * status badge; expanding it reveals the full load detail. State is
 * local for the mock.
 */
export function BulletinCard({ tender }: { tender: LoadTender }) {
  const [status, setStatus] = useState<TenderStatus>("pending");
  const [expanded, setExpanded] = useState(false);

  const actioned = status !== "pending";
  const summary = `${tender.origin} to ${tender.destination}, ${formatDate(
    tender.date,
  )}`;

  const detail: { label: string; value: string }[] = [
    { label: "From", value: tender.origin },
    { label: "To", value: tender.destination },
    { label: "Date", value: formatDate(tender.date) },
    { label: "Pickup", value: tender.pickupTime },
    { label: "Delivery", value: tender.deliveryTime },
  ];

  return (
    <article className="overflow-hidden rounded-card bg-brand-light shadow-card">
      {/* Sender row */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600">
          <Icon name="user" className="h-6 w-6" />
        </span>
        <span className="flex-1 text-sm font-bold text-ink">
          {tender.sender}
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-medium text-ink-muted">
            {tender.time}
          </span>
          {tender.unread && (
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="border-t border-ink/10 px-4 py-3">
        <p className="text-sm font-bold text-ink">Load Tender</p>

        {actioned && expanded ? (
          <dl className="mt-2 space-y-1.5">
            {detail.map((row) => (
              <div key={row.label} className="flex justify-between gap-3">
                <dt className="text-xs text-ink-muted">{row.label}</dt>
                <dd className="text-xs font-semibold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p
            className={`text-sm font-medium text-ink ${
              actioned ? "truncate" : ""
            }`}
          >
            {summary}
          </p>
        )}

        {!actioned ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus("accepted")}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white"
            >
              <Icon name="check" className="h-4 w-4" />
              Accept
            </button>
            <button
              type="button"
              onClick={() => setStatus("declined")}
              className="flex items-center justify-center gap-2 rounded-lg border border-brand bg-surface py-3 text-sm font-semibold text-brand"
            >
              <Icon name="x" className="h-4 w-4" />
              Decline
            </button>
          </div>
        ) : (
          <>
            <div className="mt-3 flex justify-center">
              <span
                className={`flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-sm font-semibold ${
                  status === "accepted" ? "text-brand" : "text-danger"
                }`}
              >
                <Icon
                  name={status === "accepted" ? "check" : "x"}
                  className="h-4 w-4"
                />
                {status === "accepted" ? "Accepted" : "Declined"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-label={expanded ? "Collapse" : "Expand"}
              className="mt-1 flex w-full justify-center text-ink-muted"
            >
              <Icon
                name={expanded ? "chevron-up" : "chevron-down"}
                className="h-5 w-5"
              />
            </button>
          </>
        )}
      </div>
    </article>
  );
}
