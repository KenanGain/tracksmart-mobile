"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { BulletinCard } from "./BulletinCard";
import type { LoadTender } from "@/lib/data/bulletin";

/**
 * BulletinList — search field + the list of Load Tender cards.
 */
export function BulletinList({ tenders }: { tenders: LoadTender[] }) {
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? tenders.filter((tender) =>
        `${tender.sender} ${tender.origin} ${tender.destination}`
          .toLowerCase()
          .includes(term),
      )
    : tenders;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full rounded-lg bg-surface py-2.5 pl-9 pr-3 text-sm text-ink shadow-card outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-card bg-surface p-6 text-center text-sm text-ink-muted shadow-card">
          No bulletins found.
        </div>
      ) : (
        filtered.map((tender) => (
          <BulletinCard key={tender.id} tender={tender} />
        ))
      )}
    </div>
  );
}
