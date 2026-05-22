"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";

/**
 * BottomNav — a translucent floating "bubble".
 *
 * It overlays the scrolling content (absolute, bottom of the shell) and
 * is semi-transparent with a backdrop blur, so content shows through as
 * it scrolls underneath. Tabs come from NAV_ITEMS.
 */
export function BottomNav({
  badges,
}: {
  /** Unread counts keyed by nav href — shown as iPhone-style badges. */
  badges?: Record<string, number>;
}) {
  const pathname = usePathname();

  return (
    // pointer-events-none on the wrapper so the gap around the bubble
    // doesn't block taps on the content behind it.
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pt-2 pb-nav-bottom">
      <div className="pointer-events-auto flex items-center justify-around gap-1 rounded-full bg-surface/80 px-2 py-2 shadow-nav ring-1 ring-ink/5 backdrop-blur-md">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const count = badges?.[item.href] ?? 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-brand-light text-brand" : "text-ink-muted"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                {count > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white ring-2 ring-surface"
                    aria-label={`${count} unread`}
                  >
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium leading-none ${
                  isActive ? "text-brand" : "text-ink-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
