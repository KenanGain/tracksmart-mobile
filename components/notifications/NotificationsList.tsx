"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type {
  AppNotification,
  NotificationKind,
} from "@/lib/data/notifications";

const KIND_ICON: Record<NotificationKind, string> = {
  "trip-changed": "refresh",
  "itinerary-changed": "route",
};

/**
 * NotificationsList — the Notifications screen (opened from the top-bar
 * bell): a search field and the notification feed.
 */
export function NotificationsList({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? notifications.filter((n) =>
        `${n.title} ${n.message}`.toLowerCase().includes(term),
      )
    : notifications;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-ink">
          Notifications
        </h1>
        <span className="w-9 shrink-0" aria-hidden="true" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
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

        <p className="mt-4 text-sm font-semibold text-ink-muted">Today</p>

        {filtered.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-muted">
            No notifications found.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {filtered.map((notification) => (
              <li
                key={notification.id}
                className="flex gap-3 rounded-card bg-surface p-4 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light">
                  <Icon
                    name={KIND_ICON[notification.kind]}
                    className="h-5 w-5 text-brand"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-ink">
                      {notification.title}
                    </p>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {notification.time}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-start justify-between gap-2">
                    <p className="text-sm text-ink-muted">
                      {notification.message}
                    </p>
                    {notification.unread && (
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
