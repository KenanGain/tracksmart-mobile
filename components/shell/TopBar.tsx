"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME, NAV_ITEMS, DETAIL_TITLES } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { AccountDrawer } from "@/components/account/AccountDrawer";

/**
 * TopBar — two modes, both derived from the route:
 *  - Tab route   → section title (left) + bell + account icon.
 *  - Detail route → back button (left) + centered page title.
 *
 * The account icon opens the "My Account" side drawer.
 */
export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);

  // A route is a "tab route" only when it is exactly a nav href; any
  // deeper route (e.g. /trips/12851, /account/settings) is a detail route.
  const tab = NAV_ITEMS.find((item) => pathname === item.href);

  // Detail-route title: from DETAIL_TITLES, with a dynamic case for a
  // trip detail page (/trips/<id>).
  const detailTitle = pathname.startsWith("/trips/")
    ? `Trip ${pathname.split("/")[2]}`
    : (DETAIL_TITLES[pathname] ?? APP_NAME);

  return (
    <>
      {tab ? (
        <header className="absolute inset-x-0 top-0 z-20 flex h-topbar items-center justify-between border-b border-ink/5 bg-surface/80 px-4 pt-safe-top backdrop-blur-md">
          <h1 className="text-base font-semibold text-ink">{tab.label}</h1>
          <div className="flex items-center gap-0.5">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink"
            >
              <Icon name="bell" className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
            </Link>
            <button
              type="button"
              onClick={() => setAccountOpen(true)}
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
            >
              <Icon name="user" className="h-5 w-5" />
            </button>
          </div>
        </header>
      ) : (
        <header className="absolute inset-x-0 top-0 z-20 flex h-topbar items-center border-b border-ink/5 bg-surface/80 px-2 pt-safe-top backdrop-blur-md">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
          >
            <Icon name="chevron-left" className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-semibold text-ink">
            {detailTitle}
          </h1>
          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </header>
      )}

      <AccountDrawer open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
