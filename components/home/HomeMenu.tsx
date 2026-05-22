"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

/**
 * HomeMenu — Refresh + Help side by side, then a Logout button.
 */
export function HomeMenu() {
  const router = useRouter();

  function handleLogout() {
    if (window.confirm("Do you want to log out?")) {
      router.push("/auth/sign-in");
    }
  }

  return (
    <div className="space-y-4">
      {/* Refresh + Help — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 rounded-card bg-surface p-4 text-sm font-semibold text-ink shadow-card"
        >
          <Icon name="refresh" className="h-4 w-4 text-ink-muted" />
          Refresh
        </button>

        {/* Help screen is a later task. */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-card bg-surface p-4 text-sm font-semibold text-ink shadow-card"
        >
          <Icon name="help" className="h-4 w-4 text-ink-muted" />
          Help
        </button>
      </div>

      {/* Logout — red outline, confirms before signing out */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-card border border-danger bg-surface p-4 text-sm font-semibold text-danger shadow-card"
      >
        <Icon name="log-out" className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}
