"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { getProfile } from "@/lib/api/profile";
import type { DriverProfile } from "@/lib/data/profile";

/** Menu rows shown under the profile block. */
const MENU: { icon: string; label: string; href: string }[] = [
  { icon: "route", label: "Trip History", href: "/account/trip-history" },
  { icon: "settings", label: "Settings", href: "/account/settings" },
  { icon: "info", label: "About", href: "/account/about" },
];

/**
 * AccountDrawer — the "My Account" side panel. Slides in from the right of
 * the phone frame. Opened by the account icon in the TopBar.
 */
export function AccountDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const initials = profile?.initials ?? "··";

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 w-full max-w-shell -translate-x-1/2">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="My Account"
        className="absolute right-0 top-0 flex h-full w-[86%] max-w-[20rem] flex-col bg-surface shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/5 px-4 pt-safe-top">
          <div className="flex h-topbar items-center">
            <h2 className="text-base font-semibold text-ink">My Account</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Profile block */}
        <div className="flex items-center gap-3 px-4 py-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-ink">
              {profile?.name ?? "—"}
            </p>
            <p className="text-sm text-ink-muted">{profile?.role ?? ""}</p>
            <p className="truncate text-xs text-ink-muted">
              {profile?.organization ?? ""}
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {MENU.map((row) => (
              <li key={row.href}>
                <button
                  type="button"
                  onClick={() => go(row.href)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-ink hover:bg-surface-muted"
                >
                  <Icon name={row.icon} className="h-5 w-5 text-ink-muted" />
                  <span className="flex-1">{row.label}</span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 text-ink-muted"
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Log out */}
        <div className="border-t border-ink/5 px-3 py-3 pb-safe-bottom">
          <button
            type="button"
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-danger hover:bg-danger/5"
          >
            <Icon name="log-out" className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Log-out confirmation */}
      {confirmLogout && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 px-8">
          <div className="w-full rounded-2xl bg-surface p-5">
            <h3 className="text-base font-bold text-ink">Log out?</h3>
            <p className="mt-1 text-sm text-ink-muted">
              You will need to sign in again to use the app.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-lg bg-surface-muted py-2.5 text-sm font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmLogout(false);
                  onClose();
                  router.push("/auth/sign-in");
                }}
                className="flex-1 rounded-lg bg-danger py-2.5 text-sm font-semibold text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
